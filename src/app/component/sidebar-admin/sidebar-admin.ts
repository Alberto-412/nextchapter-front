// ============================================================
// ARCHIVO: sidebar-admin.ts
// QUÉ HACE: Sidebar de navegación del panel admin.
//           Gestiona su propio estado abierto/cerrado (móvil)
//           y avisa al AdminLayout cuando cambia mediante un
//           EventEmitter para que el layout ajuste el margen.
// ============================================================

import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
// ↑ RouterLink       → convierte href en navegación Angular (sin recarga)
// ↑ RouterLinkActive → añade la clase 'active' al enlace de la ruta actual
// ↑ CommonModule     → necesario para [class.open] y otras directivas básicas


@Component({
  selector: 'app-sidebar-admin',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar-admin.html',
  styleUrl: './sidebar-admin.css',
})
export class SidebarAdmin {

  // ── PASO 1: ESTADO DEL MENÚ ──────────────────────────────
  // true = sidebar visible en móvil, false = oculto.
  // El CSS usa la clase .open para mostrarlo u ocultarlo.
  menuOpen: boolean = false;


  // ── PASO 2: OUTPUT (comunicación hijo → padre) ───────────
  // @Output permite que el componente hijo (SidebarAdmin)
  // envíe datos al componente padre (AdminLayout).
  //
  // Cuando el menú se abre o cierra, emitimos el nuevo estado
  // para que AdminLayout lo sepa y pueda ajustar el layout.
  // En el HTML del padre: (menuToggled)="onMenuToggled($event)"
  @Output() menuToggled = new EventEmitter<boolean>();


  // ── PASO 3: toggleMenu() ─────────────────────────────────
  // Invierte el estado del menú y avisa al padre.
  // Lo llaman:
  //   · El botón hamburguesa del AdminLayout: sidebar.toggleMenu()
  //   · El overlay oscuro de móvil: (click)="toggleMenu()"
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.menuToggled.emit(this.menuOpen);
  }


  // ── PASO 4: logout() ─────────────────────────────────────
  // Elimina el token de localStorage y redirige al login.
  // Se usa window.location.href en vez de router.navigate()
  // para forzar una recarga completa y limpiar cualquier
  // estado en memoria que pudiera quedar de la sesión.
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}