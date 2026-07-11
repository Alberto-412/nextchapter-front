import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { forkJoin, of } from 'rxjs';

export interface CartItem {
  id_producto: number;
  titulo: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class Cart {
  private readonly STORAGE_KEY = 'carrito';
private http = inject(HttpClient);
private apiUrl = `${environment.apiUrl}/cart`;

  items = signal<CartItem[]>(this.cargarDeLocalStorage());
  cartCount = computed(() => this.items().reduce((acc, it) => acc + it.cantidad, 0));
  total = computed(() => this.items().reduce((acc, it) => acc + it.precio * it.cantidad, 0));

  private cargarDeLocalStorage(): CartItem[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private guardar(items: CartItem[]) {
    this.items.set(items);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  agregarItem(libro: { id: number; titulo: string; precio: number | string; imagen: string }) {
    const items = [...this.items()];
    const existente = items.find((it) => it.id_producto === libro.id);
    if (existente) {
      existente.cantidad++;
    } else {
      items.push({
        id_producto: libro.id,
        titulo: libro.titulo,
        precio: Number(libro.precio),
        imagen: libro.imagen,
        cantidad: 1,
      });
    }
    this.guardar(items);
  }

  cambiarCantidad(id_producto: number, cantidad: number) {
    if (cantidad < 1) return;
    this.guardar(this.items().map((it) => it.id_producto === id_producto ? { ...it, cantidad } : it));
  }

  removeItem(id_producto: number) {
    this.guardar(this.items().filter((it) => it.id_producto !== id_producto));
  }

  vaciarCarrito() {
    this.guardar([]);
  }

  // Vuelca el carrito local al carrito del back (el token lo pone el interceptor).
  // Solo se usa en el checkout, justo antes de crear el pedido.
  sincronizarConBackend() {
    const items = this.items();
    if (items.length === 0) return of([]);
    const peticiones = items.map((it) =>
      this.http.post(`${this.apiUrl}/items`, { id_producto: it.id_producto, cantidad: it.cantidad })
    );
    return forkJoin(peticiones);
  }


}