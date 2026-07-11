import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Order as OrderService } from '../../services/order';
import { OrderStatusBadge } from '../../components/order-status-badge/order-status-badge';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, OrderStatusBadge],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  pedido = signal<any>(null);
  cargando = signal(true);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getPedidoDetalle(id).subscribe({
      next: (data) => { this.pedido.set(data); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }
imprimirFactura() {
  window.print();
}

}