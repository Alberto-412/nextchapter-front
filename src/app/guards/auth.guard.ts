// ============================================================
// QUÉ HACE: Protege rutas para que no se puedan visitar
//           sin estar autenticado o sin tener el rol correcto.
//           Se usan en app.routes.ts con canActivate: [guard].
// ============================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// ↑ CanActivateFn → tipo de Angular para un guard funcional.
//                   Recibe la ruta que se intenta visitar y devuelve
//                   true (permitir) o false (bloquear + redirigir).


// ── GUARD 1: authGuard ───────────────────────────────────────
// Protege rutas que requieren estar logado (cualquier rol).
// Usado en: /perfil, /wishlist, /reviews.
//
// Lógica: si hay token → acceso permitido.
//         si no hay token → redirige a /login y bloquea.

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token  = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};


// ── GUARD 2: adminGuard ──────────────────────────────────────
// Protege rutas que requieren ser administrador.
// Usado en: todas las rutas bajo /admin.
//
// Lógica:
//   1. Si no hay token → redirige a /login.
//   2. Si hay token pero el rol no es 'admin' → redirige a /.
//   3. Si hay token y rol es 'admin' → acceso permitido.
//
// ¿Cómo sabe el rol? El JWT tiene tres partes separadas por puntos:
// cabecera.payload.firma. El payload (parte central) está en Base64
// y contiene { id, rol, ... }. atob() lo decodifica y JSON.parse()
// lo convierte en objeto para leer el rol sin hacer una petición extra.

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token  = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));

  if (payload.rol !== 'admin') {
    router.navigate(['/']);
    return false;
  }

  return true;
};