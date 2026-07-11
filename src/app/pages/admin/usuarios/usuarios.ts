// ============================================================
// QUÉ HACE: Página de gestión de usuarios del admin.
//           Permite ver, editar, validar, cambiar rol y dar
//           de baja (lógica) a los usuarios del sistema.
// ============================================================

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService }    from '../../../services/admin.service';
import { BusquedaService } from '../../../services/busqueda.service';
// ↑ FormsModule → necesario para [(ngModel)] en el formulario de edición.
//                 Este componente usa template-driven (ngModel) en lugar
//                 de Reactive Forms porque el admin editó el usuario
//                 directamente sobre el objeto del signal.


@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  // ── PASO 1: DEPENDENCIAS ─────────────────────────────────
  private adminService    = inject(AdminService);
  private busquedaService = inject(BusquedaService);


  // ── PASO 2: SIGNALS DE ESTADO ────────────────────────────
  usuarios            = signal<any[]>([]);
  usuarioSeleccionado = signal<any>(null);  // null = lista, objeto = detalle/edición
  modoEdicion         = signal(false);      // false = detalle de solo lectura
  mensaje             = signal('');
  error               = signal('');


  // ── PASO 3: PAGINACIÓN ───────────────────────────────────
  paginaActual  = signal(1);
  itemsPorPagina = 7;

  // Filtra usuarios por nombre o email usando el buscador del header.
  usuariosFiltrados = computed(() => {
    const termino = this.busquedaService.termino();
    if (!termino) return this.usuarios();
    return this.usuarios().filter(u =>
      u.nombre?.toLowerCase().includes(termino) ||
      u.mail?.toLowerCase().includes(termino)
    );
  });

  // Corta el array filtrado para mostrar solo la página actual.
  usuariosEnPagina = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    return this.usuariosFiltrados().slice(inicio, inicio + this.itemsPorPagina);
  });

  totalPaginas = computed(() =>
    Math.ceil(this.usuariosFiltrados().length / this.itemsPorPagina)
  );

  // Array de números [1, 2, 3...] para generar los botones de paginación en el HTML.
  paginasArray = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );


  // ── PASO 4: CICLO DE VIDA ────────────────────────────────
  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.adminService.getUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios.set(data);
        this.paginaActual.set(1); // siempre volvemos a la primera página al recargar
      },
      error: () => this.error.set('Error al cargar los usuarios')
    });
  }


  // ── PASO 5: PAGINACIÓN ───────────────────────────────────
  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
    }
  }

  paginaAnterior() {
    if (this.paginaActual() > 1) this.paginaActual.update(p => p - 1);
  }

  paginaSiguiente() {
    if (this.paginaActual() < this.totalPaginas()) this.paginaActual.update(p => p + 1);
  }


  // ── PASO 6: VER / EDITAR USUARIO ─────────────────────────
  // Ambos hacen una petición para obtener los datos completos.
  // La diferencia es que editarUsuario() también activa modoEdicion.

  verUsuario(userId: number) {
    this.adminService.getUsuarioById(userId).subscribe({
      next: (data: any) => {
        this.usuarioSeleccionado.set(data);
        this.modoEdicion.set(false); // modo solo lectura
      },
      error: () => this.error.set('Error al cargar el usuario')
    });
  }

  editarUsuario(userId: number) {
    this.adminService.getUsuarioById(userId).subscribe({
      next: (data: any) => {
        this.usuarioSeleccionado.set(data);
        this.modoEdicion.set(true); // modo edición con formulario
      },
      error: () => this.error.set('Error al cargar el usuario')
    });
  }


  // ── PASO 7: guardarUsuario() ─────────────────────────────
  // Envía el objeto usuarioSeleccionado() completo al backend.
  // Los [(ngModel)] del formulario ya modificaron el objeto
  // directamente en el signal con updateUsuarioSeleccionado().
  guardarUsuario() {
    this.adminService.updateUsuario(this.usuarioSeleccionado().id, this.usuarioSeleccionado()).subscribe({
      next: () => {
        this.mensaje.set('Usuario actualizado correctamente');
        this.modoEdicion.set(false);
        this.cargarUsuarios();
      },
      error: () => this.error.set('Error al actualizar el usuario')
    });
  }


  // ── PASO 8: ACCIONES RÁPIDAS ─────────────────────────────

  // Aprueba la cuenta de un usuario pendiente de validación.
  validarUsuario(userId: number) {
    this.adminService.validarUsuario(userId).subscribe({
      next: () => {
        this.mensaje.set('Usuario validado correctamente');
        this.cargarUsuarios();
      },
      error: () => this.error.set('Error al validar el usuario')
    });
  }

  // Alterna el rol entre 'admin' y 'cliente'.
  // El HTML pasa el rol contrario al actual: usuario.rol === 'admin' ? 'cliente' : 'admin'
  cambiarRol(userId: number, rol: string) {
    this.adminService.updateRol(userId, rol).subscribe({
      next: () => {
        this.mensaje.set('Rol actualizado correctamente');
        this.cargarUsuarios();
      },
      error: () => this.error.set('Error al cambiar el rol')
    });
  }

  // Baja lógica: el backend marca al usuario como inactivo,
  // no lo elimina (para conservar el historial de pedidos).
  // El backend devuelve error si el usuario tiene pedidos activos.
  darDeBaja(userId: number) {
    if (confirm('¿Estás seguro de dar de baja a este usuario?')) {
      this.adminService.deleteUsuario(userId).subscribe({
        next: () => {
          this.mensaje.set('Usuario dado de baja correctamente');
          this.usuarioSeleccionado.set(null);
          this.cargarUsuarios();
        },
        // err.error?.message muestra el mensaje específico del backend
        // (ej: "El usuario tiene pedidos activos")
        error: (err: any) => this.error.set(err.error?.message || 'Error al dar de baja al usuario')
      });
    }
  }


  // ── PASO 9: updateUsuarioSeleccionado() ──────────────────
  // Los [(ngModel)] del formulario de edición son "unidireccionales":
  // [ngModel] lee el valor y (ngModelChange) escribe el nuevo valor.
  // Esta función actualiza el campo concreto dentro del signal
  // usando spread (...u) para no mutar el objeto original.
  // [field]: value → notación de propiedad dinámica en JavaScript.
  updateUsuarioSeleccionado(field: string, value: unknown) {
    this.usuarioSeleccionado.update(u => ({ ...u, [field]: value }));
  }


  // ── PASO 10: CERRAR ──────────────────────────────────────
  cerrarDetalle() {
    this.usuarioSeleccionado.set(null);
    this.modoEdicion.set(false);
    this.mensaje.set('');
    this.error.set('');
  }
}