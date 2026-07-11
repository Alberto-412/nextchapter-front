import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart as CartService } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private cartService = inject(CartService);

  items = this.cartService.items;
  total = this.cartService.total;

  cambiarCantidad(id: number, cantidad: number) {
    this.cartService.cambiarCantidad(id, cantidad);
  }

  eliminar(id: number) {
    this.cartService.removeItem(id);
  }

  vaciar() {
    this.cartService.vaciarCarrito();
  }
}