// ============================================================
// ARCHIVO: admin.service.ts
// QUÉ HACE: Centraliza todas las llamadas HTTP del panel admin.
//           Cubre cuatro áreas: usuarios, productos, pedidos
//           y dashboard. Todas las rutas son protegidas (llevan
//           la cabecera Authorization con el JWT).
// ============================================================

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment';

// ── PASO 1: DECORADOR ────────────────────────────────────────
// providedIn: 'root' → Angular crea una única instancia del
// servicio para toda la app. Todos los componentes que lo pidan
// con inject() reciben la misma instancia (Singleton).

@Injectable({ providedIn: 'root' })
export class AdminService {

  // ── PASO 2: DEPENDENCIAS ─────────────────────────────────
  private http   = inject(HttpClient);     // para hacer peticiones HTTP
  private apiUrl = environment.apiUrl;     // URL base del backend


  // ── PASO 3: getHeaders() ─────────────────────────────────
  // Método PRIVADO que construye la cabecera Authorization.
  // El middleware "auth" del backend verifica este token antes
  // de responder. Es privado porque ningún componente debe
  // construir cabeceras manualmente; solo los métodos de abajo lo usan.

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }


  // ── PASO 4: MÉTODOS DE USUARIOS ──────────────────────────

  // Lista todos los usuarios pendientes de validación por el admin.
  getUsuariosPendientes() {
    return this.http.get(`${this.apiUrl}/admin/usuarios/pendientes`, { headers: this.getHeaders() });
  }

  // Valida (aprueba) una cuenta de usuario. El backend la marca
  // como validada y el usuario podrá hacer login desde ese momento.
  validarUsuario(userId: number) {
    return this.http.put(`${this.apiUrl}/admin/usuarios/${userId}/validar`, {}, { headers: this.getHeaders() });
    //                                                                      ↑
    //                                         body vacío: toda la info va en la URL
  }

  // Cambia el rol de un usuario entre 'cliente' y 'admin'.
  updateRol(userId: number, rol: string) {
    return this.http.put(`${this.apiUrl}/admin/usuarios/${userId}/rol`, { rol }, { headers: this.getHeaders() });
  }

  // Lista todos los usuarios del sistema.
  getUsuarios() {
    return this.http.get(`${this.apiUrl}/admin/usuarios`, { headers: this.getHeaders() });
  }

  // Obtiene los datos completos de un usuario por su ID.
  // Se usa al abrir el detalle o el formulario de edición.
  getUsuarioById(userId: number) {
    return this.http.get(`${this.apiUrl}/admin/usuarios/${userId}`, { headers: this.getHeaders() });
  }

  // Actualiza los datos de un usuario (nombre, email, rol, activo...).
  updateUsuario(userId: number, datos: unknown) {
    return this.http.put(`${this.apiUrl}/admin/usuarios/${userId}`, datos, { headers: this.getHeaders() });
  }

  // Baja lógica: el backend marca al usuario como inactivo,
  // no lo elimina de la base de datos (para conservar historial de pedidos).
  deleteUsuario(userId: number) {
    return this.http.delete(`${this.apiUrl}/admin/usuarios/${userId}`, { headers: this.getHeaders() });
  }


  // ── PASO 5: MÉTODOS DE PRODUCTOS ─────────────────────────

  // Lista todos los productos del catálogo.
  getProducts() {
    return this.http.get(`${this.apiUrl}/admin/products`, { headers: this.getHeaders() });
  }

  // Obtiene un producto por ID. Se usa al abrir el formulario de edición.
  getProductById(productId: number) {
    return this.http.get(`${this.apiUrl}/admin/products/${productId}`, { headers: this.getHeaders() });
  }

  // Crea un producto nuevo con los datos del formulario de creación.
  createProduct(datos: unknown) {
    return this.http.post(`${this.apiUrl}/admin/products`, datos, { headers: this.getHeaders() });
  }

  // Actualiza un producto existente. El ID va en la URL (REST)
  // y los datos actualizados en el body.
  updateProduct(productId: number, datos: unknown) {
    return this.http.put(`${this.apiUrl}/admin/products/${productId}`, datos, { headers: this.getHeaders() });
  }

  // Elimina un producto definitivamente.
  deleteProduct(productId: number) {
    return this.http.delete(`${this.apiUrl}/admin/products/${productId}`, { headers: this.getHeaders() });
  }


  // ── PASO 6: MÉTODOS DE PEDIDOS ───────────────────────────

  // Lista todos los pedidos de la tienda.
  getOrders() {
    return this.http.get(`${this.apiUrl}/admin/orders`, { headers: this.getHeaders() });
  }

  // Obtiene el detalle completo de un pedido (productos, cliente, etc.).
  getOrderById(orderId: number) {
    return this.http.get(`${this.apiUrl}/admin/orders/${orderId}`, { headers: this.getHeaders() });
  }

  // Cambia el estado de un pedido: pendiente → procesando → enviado → entregado.
  updateOrderStatus(orderId: number, estado: string) {
    return this.http.put(`${this.apiUrl}/admin/orders/${orderId}`, { estado }, { headers: this.getHeaders() });
  }


  // ── PASO 7: DASHBOARD ────────────────────────────────────
  // Devuelve en una sola petición:
  //   · stats: agregados SQL (total pedidos, ingresos, enviados, cancelados...)
  //   · pedidos: los últimos pedidos recientes
  //   · usuariosPendientes: cuentas sin validar
  getDashboard() {
    return this.http.get(`${this.apiUrl}/admin/dashboard`, { headers: this.getHeaders() });
  }
}