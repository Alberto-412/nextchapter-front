import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-status-badge.html',
  styleUrl: './order-status-badge.css',
})
export class OrderStatusBadge {
  estado = input<string>('pendiente');
}