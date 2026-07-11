import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

@Injectable({ providedIn: 'root' })
export class Order {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // GET /api/orders → listar mis pedidos
  getMisPedidos() {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }

  // GET /api/orders/:id → detalle de un pedido
  getPedidoDetalle(id: number) {
    return this.http.get<any>(`${this.apiUrl}/orders/${id}`);
  }

  // POST /api/orders → crear pedido desde el carrito
  crearPedido(direccion_envio: string, metodo_pago: string) {
    return this.http.post(`${this.apiUrl}/orders`, { direccion_envio, metodo_pago });
  }

  // POST /api/checkout/payment → procesar el pago
  procesarPago(id_pedido: number) {
    return this.http.post(`${this.apiUrl}/checkout/payment`, { id_pedido });
  }

  // La gestión de pedidos del panel admin (listar todos, cambiar estado)
  // vive en AdminService, que ya la usa pages/admin/pedidos/pedidos.ts.
}
