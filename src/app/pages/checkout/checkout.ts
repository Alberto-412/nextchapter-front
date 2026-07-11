import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Cart as CartService } from '../../services/cart';
import { Order as OrderService } from '../../services/order';
import { CheckoutSummary } from '../../components/checkout-summary/checkout-summary';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckoutSummary],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  items = this.cartService.items;

  direccion_envio = signal('');
  metodo_pago = signal('tarjeta');
  cargando = signal(false);
  error = signal('');
  necesitaLogin = signal(false); // ← nuevo: controla el aviso de login

  subtotal() {
    return this.items().reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  finalizarPedido() {
    if (!this.direccion_envio().trim()) {
      this.error.set('Introduce una dirección de envío');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.necesitaLogin.set(true); // en vez de redirigir de golpe, mostramos el aviso
      return;
    }
    this.necesitaLogin.set(false);

    this.cargando.set(true);
    this.error.set('');

    this.cartService.sincronizarConBackend().pipe(
      switchMap(() => this.orderService.crearPedido(this.direccion_envio(), this.metodo_pago()))
    ).subscribe({
      next: (resp: any) => {
        this.cargando.set(false);
        this.cartService.vaciarCarrito();
        this.router.navigate(['/orders', resp.id_pedido]);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(err.error?.error || 'Error al crear el pedido');
      },
    });
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}