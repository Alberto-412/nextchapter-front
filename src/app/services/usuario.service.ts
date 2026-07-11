// ============================================================
// QUÉ HACE: Centraliza TODAS las llamadas HTTP relacionadas
//           con el usuario: autenticación, perfil, wishlist
//           y reviews. Los componentes no saben nada de URLs
//           ni de cabeceras — solo llaman al método que necesitan.
// ============================================================
 
 
// ── PASO 1: IMPORTACIONES ───────────────────────────────────
 
import { Injectable, inject } from '@angular/core';
// ↑ Injectable → marca la clase como un servicio que Angular puede inyectar
// ↑ inject()   → forma moderna de pedir dependencias (en vez de constructor)

import { HttpClient, HttpHeaders } from '@angular/common/http';
// ↑ HttpClient  → herramienta de Angular para hacer peticiones HTTP
//                 (GET, POST, PUT, DELETE). Devuelve Observables.
// ↑ HttpHeaders → clase para construir las cabeceras HTTP
//                 (en nuestro caso, la cabecera Authorization con el JWT)

import { environment } from '../environment';
// ↑ HttpClient  → herramienta de Angular para hacer peticiones HTTP
//                 (GET, POST, PUT, DELETE). Devuelve Observables.
// ↑ HttpHeaders → clase para construir las cabeceras HTTP
//                 (en nuestro caso, la cabecera Authorization con el JWT)

// ── PASO 2: DECORADOR @Injectable ───────────────────────────
// providedIn: 'root' → Angular crea UNA SOLA instancia de este servicio
// para toda la aplicación (patrón Singleton). Todos los componentes que
// lo pidan con inject() reciben la misma instancia, no una copia.

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  // ── PASO 3: DEPENDENCIAS ──────────────────────────────────
  // Se declaran como propiedades privadas con inject().
  // "private" significa que solo se pueden usar dentro de esta clase,
  // nunca desde un componente directamente.

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // ── PASO 4: MÉTODO PRIVADO getHeaders() ───────────────────
  // Construye la cabecera Authorization que exige el middleware
  // "auth" del backend para las rutas protegidas.
  //
  // Formato esperado por el backend: "Bearer eyJhbGci..."
  //
  // Es PRIVADO porque es un detalle interno del servicio.
  // Ningún componente debería construir cabeceras manualmente.
  // Solo lo llaman los métodos de abajo que necesitan autenticación.
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ── PASO 5: MÉTODOS DE AUTENTICACIÓN (rutas públicas) ─────
  // Estas rutas NO llevan cabecera porque el usuario aún no
  // está autenticado (no tiene token todavía).
 
  // Crea una cuenta nueva. El backend la deja en estado "pendiente"
  // hasta que un admin la valide. No devuelve token.
    register(datos: unknown) {
    return this.http.post(`${this.apiUrl}/auth/register`, datos);
  }

  // Inicia sesión. Si las credenciales son correctas y la cuenta
  // está validada, el backend devuelve { token: "eyJ..." }.
  login(datos: unknown) {
    return this.http.post(`${this.apiUrl}/auth/login`, datos);
  }

  // Cierra sesión. Sí lleva cabecera porque el backend necesita
  // saber qué sesión invalidar.
  logout() {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers: this.getHeaders() });
  }

  // ── PASO 6: MÉTODOS DE PERFIL (rutas protegidas) ──────────
  // Todas llevan { headers: this.getHeaders() } porque el backend
  // verifica el JWT antes de responder.
 
  // Obtiene los datos del perfil del usuario autenticado.
  getPerfil() {
    return this.http.get(`${this.apiUrl}/profile`, { headers: this.getHeaders() });
  }

  // Actualiza nombre, email u otros datos del perfil.
  updatePerfil(datos: unknown) {
    return this.http.put(`${this.apiUrl}/profile`, datos, { headers: this.getHeaders() });
  }

  // Actualiza la contraseña.
  // IMPORTANTE: el parámetro llega SIN Ñ (contrasenaActual, contrasenaNueva)
  // porque trabajar con ñ en nombres de propiedades TypeScript es incómodo.
  // Justo antes de enviar, construimos el body CON Ñ, que es lo que espera
  // el backend. La interfaz interna habla TypeScript; la externa habla backend.
  updatePassword(datos: { contrasenaActual: string; contrasenaNueva: string }) {
    const body = {
      contraseñaActual: datos.contrasenaActual,
      contraseñaNueva: datos.contrasenaNueva
    };
    return this.http.put(`${this.apiUrl}/profile/password`, body, { headers: this.getHeaders() });
  }


  // Baja lógica del usuario (el backend no borra el registro,
  // solo lo marca como inactivo para conservar el historial de pedidos).
  deletePerfil() {
    return this.http.delete(`${this.apiUrl}/profile`, { headers: this.getHeaders() });
  }

  // ── PASO 7: MÉTODOS DE WISHLIST (rutas protegidas) ────────
 
  // Obtiene todos los libros guardados en la wishlist del usuario
  getWishlist() {
    return this.http.get(`${this.apiUrl}/wishlist`, { headers: this.getHeaders() });
  }

  // Añade un libro a la wishlist. El ID del libro va en la URL,
  // no en el body (es un parámetro de ruta REST).
  addToWishlist(bookId: number) {
    return this.http.post(`${this.apiUrl}/wishlist/${bookId}`, {}, { headers: this.getHeaders() });
  }

  //                                                           ↑
  //                                  body vacío {} porque toda la info ya va en la URL
  
 
  // Elimina un libro de la wishlist.
  removeFromWishlist(bookId: number) {
    return this.http.delete(`${this.apiUrl}/wishlist/${bookId}`, { headers: this.getHeaders() });
  }


  // ── PASO 8: MÉTODOS DE REVIEWS (rutas protegidas) ─────────
 
  // Obtiene todas las reseñas del usuario autenticado.
  getReviews() {
    return this.http.get(`${this.apiUrl}/reviews`, { headers: this.getHeaders() });
  }

  // Crea una reseña nueva para un libro.
  addReview(datos: unknown) {
    return this.http.post(`${this.apiUrl}/reviews`, datos, { headers: this.getHeaders() });
  }

  // Edita una reseña existente. El ID va en la URL (parámetro REST)
  // y los nuevos datos en el body.
  updateReview(reviewId: number, datos: unknown) {
    return this.http.put(`${this.apiUrl}/reviews/${reviewId}`, datos, { headers: this.getHeaders() });
  }

  // Elimina una reseña.
  deleteReview(reviewId: number) {
    return this.http.delete(`${this.apiUrl}/reviews/${reviewId}`, { headers: this.getHeaders() });
  }
}