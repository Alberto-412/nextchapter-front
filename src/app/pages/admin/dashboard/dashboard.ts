// ============================================================
// QUÉ HACE: Página de inicio del panel admin. Muestra:
//           · Tarjetas de estadísticas (SQL agregado del back)
//           · Lista de pedidos recientes con paginación
//           · Lista de usuarios pendientes de validación
//           Todo es filtrable desde el buscador del header.
// ============================================================

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService }   from '../../../services/admin.service';
import { BusquedaService } from '../../../services/busqueda.service';
// ↑ OnInit     → interfaz que obliga a implementar ngOnInit()
//                (se ejecuta cuando Angular termina de crear el componente)
// ↑ computed() → valor derivado de signals: se recalcula automáticamente
//                cuando cambia cualquier signal del que depende
// ↑ DatePipe   → pipe para formatear fechas: | date:'dd/MM/yy HH:mm'


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  // ── PASO 1: DEPENDENCIAS ─────────────────────────────────
  private adminService    = inject(AdminService);
  protected busquedaService = inject(BusquedaService);
  // ↑ busquedaService es 'protected' (no 'private') porque el HTML
  //   necesita leerlo directamente: busquedaService.termino()


  // ── PASO 2: SIGNALS DE DATOS ─────────────────────────────
  // Almacenan los datos que llegan del backend.
  // Arrancan vacíos/null y se rellenan en ngOnInit().
  pedidos            = signal<any[]>([]);
  usuariosPendientes = signal<any[]>([]);
  stats              = signal<any>(null);   // estadísticas agregadas
  error              = signal('');
  pedidoSeleccionado = signal<any>(null);   // null = vista de lista, objeto = vista de detalle


  // ── PASO 3: PAGINACIÓN ───────────────────────────────────
  paginaActual = signal(1);
  porPagina    = 4;             // constante: no cambia, no necesita signal


  // ── PASO 4: VALORES DERIVADOS (computed) ─────────────────
  // computed() crea un valor que se recalcula SOLO cuando cambia
  // algún signal del que depende. No hace falta llamarlo manualmente.

  // Filtra pedidos según lo que el usuario teclee en el buscador.
  // Si el término es un número, busca por ID exacto.
  // Si es texto, busca en nombre del cliente o email.
  pedidosFiltrados = computed(() => {
    const termino = this.busquedaService.termino();
    if (!termino) return this.pedidos();

    const esNumero = !isNaN(Number(termino)) && termino !== '';
    if (esNumero) {
      return this.pedidos().filter(p => p.id === Number(termino));
    }
    return this.pedidos().filter(p =>
      p.cliente?.toLowerCase().includes(termino) ||
      p.mail?.toLowerCase().includes(termino)
    );
  });

  // Filtra usuarios pendientes por nombre o email.
  usuariosPendientesFiltrados = computed(() => {
    const termino = this.busquedaService.termino();
    if (!termino) return this.usuariosPendientes();
    return this.usuariosPendientes().filter(u =>
      u.nombre?.toLowerCase().includes(termino) ||
      u.mail?.toLowerCase().includes(termino)
    );
  });

  // Aplica la paginación sobre los pedidos ya filtrados.
  // slice() corta el array para mostrar solo los de la página actual.
  pedidosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.porPagina;
    return this.pedidosFiltrados().slice(inicio, inicio + this.porPagina);
  });

  // Calcula el número total de páginas según los pedidos filtrados.
  totalPaginas = computed(() => Math.ceil(this.pedidosFiltrados().length / this.porPagina));


  // ── PASO 5: ngOnInit ─────────────────────────────────────
  // Se ejecuta automáticamente cuando Angular termina de crear
  // el componente. Es el lugar correcto para cargar datos del backend.
  ngOnInit() {
    this.cargarDashboard();
  }


  // ── PASO 6: cargarDashboard() ────────────────────────────
  // Llama al backend (GET /admin/dashboard) que devuelve en una
  // sola petición: stats, pedidos y usuariosPendientes.
  // Cada dato se guarda en su signal correspondiente.
  cargarDashboard() {
    this.adminService.getDashboard().subscribe({
      next: (data: any) => {
        this.pedidos.set(data.pedidos);
        this.usuariosPendientes.set(data.usuariosPendientes);
        this.stats.set(data.stats);
      },
      error: () => this.error.set('Error al cargar el dashboard')
    });
  }


  // ── PASO 7: validarUsuario() ─────────────────────────────
  // Aprueba la cuenta de un usuario pendiente.
  // Tras la respuesta del backend, elimina al usuario de la lista
  // local con .update() + .filter() sin volver a pedir todos al backend.
  validarUsuario(userId: number) {
    this.adminService.validarUsuario(userId).subscribe({
      next: () => {
        // .update() recibe el array actual y devuelve uno nuevo sin ese usuario
        this.usuariosPendientes.update(u => u.filter(u => u.id !== userId));
      },
      error: () => this.error.set('Error al validar el usuario')
    });
  }


  // ── PASO 8: DETALLE DE PEDIDO ────────────────────────────
  // El dashboard muestra los datos básicos del pedido directamente
  // de la lista (sin petición extra), a diferencia de Pedidos
  // que sí llama a getOrderById().

  // Guarda el pedido en el signal → el @if del HTML cambia de vista.
  verPedido(pedido: any) {
    this.pedidoSeleccionado.set(pedido);
  }

  // null = vuelve a la vista de lista.
  cerrarDetalle() {
    this.pedidoSeleccionado.set(null);
  }


  // ── PASO 9: PAGINACIÓN ───────────────────────────────────
  // Solo cambia de página si el número está dentro del rango válido.
  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
    }
  }
}