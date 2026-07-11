import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order as OrderService } from '../../services/order';
import { OrderCard } from '../../components/order-card/order-card';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, OrderCard],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders implements OnInit {
  private orderService = inject(OrderService);
  pedidos = signal<any[]>([]);
  cargando = signal(true);

  ngOnInit() {
    this.orderService.getMisPedidos().subscribe({
      next: (data) => { this.pedidos.set(data); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }
}