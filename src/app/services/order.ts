import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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

  // GET /api/admin/orders → todos los pedidos (admin)
  getTodosPedidos() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/orders`);
  }

  // PUT /api/admin/orders/:id → cambiar estado (admin)
  cambiarEstado(id: number, estado: string) {
    return this.http.put(`${this.apiUrl}/admin/orders/${id}`, { estado });
  }
}
