// ============================================================
// ARCHIVO: admin-layout.ts
// QUÉ HACE: Marco (layout) compartido por todas las páginas admin.
//           Contiene el sidebar, el header con buscador y el
//           <router-outlet> donde se renderizan las páginas hijas.
//           Al usar children en app.routes.ts, este layout persiste
//           mientras se navega entre dashboard, pedidos, etc.
// ============================================================

import { Component, inject, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarAdmin } from '../sidebar-admin/sidebar-admin';
import { BusquedaService } from '../../services/busqueda.service';
// ↑ RouterOutlet    → hueco donde Angular renderiza los componentes hijos
// ↑ SidebarAdmin    → componente del sidebar de navegación
// ↑ BusquedaService → servicio singleton para compartir el término de búsqueda


@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, SidebarAdmin],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

  // ── PASO 1: DEPENDENCIAS ─────────────────────────────────
  private busquedaService = inject(BusquedaService);


  // ── PASO 2: ESTADO DEL MENÚ Y RESPONSIVE ─────────────────
  menuOpen = false;                            // sidebar abierto en móvil
  isMobile = window.innerWidth <= 768;         // true si estamos en móvil


  // ── PASO 3: @HostListener ────────────────────────────────
  // Escucha el evento 'resize' de la ventana del navegador.
  // Cada vez que el usuario redimensiona la ventana, actualiza
  // isMobile para que el placeholder del buscador cambie.
  // @HostListener es la forma Angular de añadir event listeners
  // globales sin manipular el DOM directamente.
  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }


  // ── PASO 4: searchPlaceholder ────────────────────────────
  // Getter (propiedad calculada): devuelve un texto diferente
  // según si estamos en móvil o escritorio.
  // El HTML lo lee como una propiedad normal: [placeholder]="searchPlaceholder"
  get searchPlaceholder(): string {
    return this.isMobile ? 'Buscar' : 'Buscar ...';
  }


  // ── PASO 5: onMenuToggled() ──────────────────────────────
  // Recibe el evento (menuToggled) que emite SidebarAdmin
  // cuando el usuario pulsa el hamburguesa o el overlay.
  // Actualiza menuOpen para que el layout ajuste el margen
  // del contenido principal al abrirse/cerrarse el sidebar.
  onMenuToggled(isOpen: boolean) {
    this.menuOpen = isOpen;
  }


  // ── PASO 6: onBuscar() ───────────────────────────────────
  // Lee el valor del input de búsqueda y lo escribe en
  // BusquedaService.termino. Al ser un signal compartido,
  // todos los computed() de los componentes hijos (dashboard,
  // pedidos, usuarios...) que lo consumen se recalculan solos.
  onBuscar(event: Event) {
    const termino = (event.target as HTMLInputElement).value;
    this.busquedaService.buscar(termino);
  }
}