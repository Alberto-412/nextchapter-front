// ============================================================
// QUÉ HACE: Centraliza TODAS las llamadas HTTP relacionadas
//           con el usuario: autenticación, perfil, wishlist
//           y reviews. Los componentes no saben nada de URLs
//           ni de cabeceras — solo llaman al método que necesitan.
//
// AUTENTICACIÓN: la cabecera Authorization la añade automáticamente
// el authInterceptor global (core/interceptor/auth.interceptor.ts)
// a toda petición saliente cuando hay token en localStorage.
// Por eso ningún método de aquí abajo construye cabeceras a mano.
// ============================================================


// ── PASO 1: IMPORTACIONES ───────────────────────────────────

import { Injectable, inject } from '@angular/core';
// ↑ Injectable → marca la clase como un servicio que Angular puede inyectar
// ↑ inject()   → forma moderna de pedir dependencias (en vez de constructor)

import { HttpClient } from '@angular/common/http';
// ↑ HttpClient  → herramienta de Angular para hacer peticiones HTTP
//                 (GET, POST, PUT, DELETE). Devuelve Observables.

import { environment } from '../environment';

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

  // ── PASO 4: MÉTODOS DE AUTENTICACIÓN (rutas públicas) ─────
  // Estas rutas no necesitan que el usuario esté autenticado.

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

  // Cierra sesión. El backend necesita el token (lo añade el interceptor)
  // para saber qué sesión invalidar.
  logout() {
    return this.http.post(`${this.apiUrl}/auth/logout`, {});
  }

  // ── PASO 5: MÉTODOS DE PERFIL (rutas protegidas) ──────────

  // Obtiene los datos del perfil del usuario autenticado.
  getPerfil() {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  // Actualiza nombre, email u otros datos del perfil.
  updatePerfil(datos: unknown) {
    return this.http.put(`${this.apiUrl}/profile`, datos);
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
    return this.http.put(`${this.apiUrl}/profile/password`, body);
  }


  // Baja lógica del usuario (el backend no borra el registro,
  // solo lo marca como inactivo para conservar el historial de pedidos).
  deletePerfil() {
    return this.http.delete(`${this.apiUrl}/profile`);
  }

  // ── PASO 6: MÉTODOS DE WISHLIST (rutas protegidas) ────────

  // Obtiene todos los libros guardados en la wishlist del usuario
  getWishlist() {
    return this.http.get(`${this.apiUrl}/wishlist`);
  }

  // Añade un libro a la wishlist. El ID del libro va en la URL,
  // no en el body (es un parámetro de ruta REST).
  addToWishlist(bookId: number) {
    return this.http.post(`${this.apiUrl}/wishlist/${bookId}`, {});
  }

  // Elimina un libro de la wishlist.
  removeFromWishlist(bookId: number) {
    return this.http.delete(`${this.apiUrl}/wishlist/${bookId}`);
  }


  // ── PASO 7: MÉTODOS DE REVIEWS (rutas protegidas) ─────────

  // Obtiene todas las reseñas del usuario autenticado.
  getReviews() {
    return this.http.get(`${this.apiUrl}/reviews`);
  }

  // Crea una reseña nueva para un libro.
  addReview(datos: unknown) {
    return this.http.post(`${this.apiUrl}/reviews`, datos);
  }

  // Edita una reseña existente. El ID va en la URL (parámetro REST)
  // y los nuevos datos en el body.
  updateReview(reviewId: number, datos: unknown) {
    return this.http.put(`${this.apiUrl}/reviews/${reviewId}`, datos);
  }

  // Elimina una reseña.
  deleteReview(reviewId: number) {
    return this.http.delete(`${this.apiUrl}/reviews/${reviewId}`);
  }
}
