import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Footer } from '../../component/footer/footer';

@Component({
  selector: 'app-nuestras-librerias',

  /**
   * Importamos lo que usamos en esta página.
   *
   * RouterLink lo necesitamos para el botón
   * que lleva a la página de contacto.
   *
   * Footer mantiene el pie de página común.
   */
  imports: [RouterLink, Footer],

  templateUrl: './nuestrasLibrerias.html',
  styleUrl: './nuestrasLibrerias.css',
})
export class NuestrasLibrerias {
  /**
   * Página informativa con nuestras tiendas físicas.
   *
   * En esta página mostramos tres librerías ficticias
   * de NextChapter usando ubicaciones reales de centros comerciales.
   *
   * No usamos backend porque la información es estática.
   */
}
