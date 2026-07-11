import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');     // 1. saco el token guardado
  if (token) {                                      // 2. si hay token (estoy logueado)...
    req = req.clone({                               // 3. clono la petición añadiéndole la cabecera
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);                                 // 4. dejo que la petición siga su camino
};