import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Footer } from '../../component/footer/footer';

@Component({
  selector: 'app-envios',

  /**
   * Importamos lo que usamos en esta página.
   *
   * RouterLink lo necesitamos para mandar al usuario
   * a contacto si tiene alguna duda.
   *
   * Footer mantiene el pie de página común.
   */
  imports: [RouterLink, Footer],

  templateUrl: './envios.html',
  styleUrl: './envios.css',
})
export class Envios {
  /**
   * Página informativa sobre gastos y formas de envío.
   *
   * No necesita backend porque mostramos información fija
   * para orientar al usuario antes de comprar.
   */
}
