// ============================================================
// QUÉ HACE: Página de gestión de pedidos del admin.
//           Muestra la lista completa, permite filtrar por
//           estado y por el buscador del header, y al pulsar
//           "Ver" carga el detalle completo con los productos.
// ============================================================

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService }    from '../../../services/admin.service';
import { BusquedaService } from '../../../services/busqueda.service';


@Component({
  selector: 'app-pedidos',
  imports: [CommonModule, DatePipe],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class Pedidos implements OnInit {

  // ── PASO 1: DEPENDENCIAS ─────────────────────────────────
  private adminService    = inject(AdminService);
  private busquedaService = inject(BusquedaService);


  // ── PASO 2: SIGNALS DE ESTADO ────────────────────────────
  pedidos            = signal<any[]>([]);
  pedidoSeleccionado = signal<any>(null);  // null = lista, objeto = detalle
  estadoFiltro       = signal('');         // filtro por estado del <select>
  mensaje            = signal('');         // mensaje de éxito (estado actualizado)
  error              = signal('');

  // Lista de estados válidos usada para generar las opciones del <select>.
  // Es una constante, no un signal, porque nunca cambia.
  estadosValidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];


  // ── PASO 3: FILTRADO COMBINADO (computed) ─────────────────
  // Aplica hasta dos filtros en cascada:
  //   1. Filtro por estado (si hay uno seleccionado en el <select>)
  //   2. Filtro por buscador (ID numérico o nombre/email de cliente)
  // Al ser computed(), se recalcula automáticamente cuando cambia
  // estadoFiltro o busquedaService.termino.
  pedidosFiltrados = computed(() => {
    const estado   = this.estadoFiltro();
    const termino  = this.busquedaService.termino();
    let resultado  = this.pedidos();

    if (estado) {
      resultado = resultado.filter(p => p.estado === estado);
    }

    if (termino) {
      const esNumero = !isNaN(Number(termino));
      if (esNumero) {
        resultado = resultado.filter(p => String(p.id).includes(termino));
      } else {
        resultado = resultado.filter(p =>
          p.cliente?.toLowerCase().includes(termino) ||
          p.mail?.toLowerCase().includes(termino)
        );
      }
    }

    return resultado;
  });


  // ── PASO 4: CICLO DE VIDA ────────────────────────────────
  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.adminService.getOrders().subscribe({
      next: (data: any) => this.pedidos.set(data),
      error: () => this.error.set('Error al cargar los pedidos')
    });
  }


  // ── PASO 5: FILTRO POR ESTADO ────────────────────────────
  // Lo llama el (change) del <select> del header de la tabla.
  // Un string vacío '' significa "todos los estados".
  filtrarEstado(estado: string) {
    this.estadoFiltro.set(estado);
  }


  // ── PASO 6: VER DETALLE ──────────────────────────────────
  // A diferencia del dashboard (que usa los datos de la lista),
  // aquí hacemos una petición extra para obtener el detalle
  // completo: productos, cantidades, precios, datos del cliente.
  verPedido(orderId: number) {
    this.adminService.getOrderById(orderId).subscribe({
      next: (data: any) => {
        this.pedidoSeleccionado.set(data);
        this.mensaje.set('');
        this.error.set('');
      },
      error: () => this.error.set('Error al cargar el pedido')
    });
  }


  // ── PASO 7: ACTUALIZAR ESTADO ────────────────────────────
  // Lo llaman tanto el <select> del detalle (desktop) como el
  // <select> de cada tarjeta en móvil.
  // Tras actualizar, recarga la lista para reflejar el cambio.
  actualizarEstado(orderId: number, estado: string) {
    if (!estado) return; // ignoramos la opción vacía "Seleccionar estado"
    this.adminService.updateOrderStatus(orderId, estado).subscribe({
      next: () => {
        this.mensaje.set('Estado actualizado correctamente');
        this.cargarPedidos();
      },
      error: () => this.error.set('Error al actualizar el estado')
    });
  }


  // ── PASO 8: CERRAR DETALLE ───────────────────────────────
  cerrar() {
    this.pedidoSeleccionado.set(null);
    this.mensaje.set('');
    this.error.set('');
  }
}