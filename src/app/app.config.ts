// ============================================================
// QUÉ HACE: Configura los proveedores globales de la aplicación.
//           Es el punto de arranque donde Angular registra
//           los servicios esenciales que necesita toda la app.
// ============================================================

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptor/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [

    // Captura errores globales del navegador y los muestra en consola.
    provideBrowserGlobalErrorListeners(),

    provideRouter(
      routes,

      /**
       * scrollPositionRestoration Esto hace que al cambiar de página Angular suba automáticamente al inicio.
       * anchorScrolling Esto hace que haga scroll hasta novedades
       */
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'top',
      }),
    ),

    /**
     * Esto activa HttpClient en toda la aplicación.
     */
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};