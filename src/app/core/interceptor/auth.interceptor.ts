import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');     // 1. saco el token guardado
  if (token) {                                      // 2. si hay token (estoy logueado)...
    req = req.clone({                               // 3. clono la petición añadiéndole la cabecera
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(                            // 4. dejo que la petición siga su camino
    catchError((error) => {
      // Si el backend responde 401, el token ya no es válido
      // (expiró o se cerró sesión en otra pestaña): lo limpiamos
      // y mandamos al usuario a loguearse de nuevo.
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};