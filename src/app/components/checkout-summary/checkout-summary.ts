import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-summary.html',
  styleUrl: './checkout-summary.css',
})
export class CheckoutSummary {
  subtotal = input<number>(0);
  cargando = input<boolean>(false);
  finalizar = output<void>();

  envio = computed(() => (this.subtotal() >= 30 || this.subtotal() === 0 ? 0 : 3.99));
  total = computed(() => this.subtotal() + this.envio());
}