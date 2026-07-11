import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderStatusBadge } from '../order-status-badge/order-status-badge';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, RouterLink, OrderStatusBadge],
  templateUrl: './order-card.html',
  styleUrl: './order-card.css',
})
export class OrderCard {
  pedido = input<any>();
}