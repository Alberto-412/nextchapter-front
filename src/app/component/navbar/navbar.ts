import { Component, ElementRef, HostListener, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Cart as CartService } from '../../services/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private cartService = inject(CartService);
  private router = inject(Router);

  @ViewChild('cuentaWrapper') cuentaWrapper?: ElementRef;

  items = this.cartService.items;
  total = this.cartService.total;
  cartCount = this.cartService.cartCount;

  drawerAbierto = signal(false);
  menuCuentaAbierto = signal(false);

  buscar(termino: string) {
  const t = termino.trim();
  this.router.navigate(['/catalogo'], {
    queryParams: t ? { busqueda: t } : {},
  });
}
  logueado(): boolean {
    return !!localStorage.getItem('token');
  }

  toggleMenuCuenta() {
    this.menuCuentaAbierto.set(!this.menuCuentaAbierto());
  }

  cerrarMenuCuenta() {
    this.menuCuentaAbierto.set(false);
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.menuCuentaAbierto.set(false);
    this.router.navigate(['/']);
  }

  // cierra el desplegable al hacer clic en cualquier sitio fuera de él
  @HostListener('document:click', ['$event'])
  onClickFuera(event: MouseEvent) {
    if (!this.menuCuentaAbierto()) return;
    const wrapper = this.cuentaWrapper?.nativeElement;
    if (wrapper && !wrapper.contains(event.target)) {
      this.menuCuentaAbierto.set(false);
    }
  }

  toggleDrawer() {
    this.drawerAbierto.set(!this.drawerAbierto());
  }

  cerrarDrawer() {
    this.drawerAbierto.set(false);
  }

  eliminar(id: number) {
    this.cartService.removeItem(id);
  }
}