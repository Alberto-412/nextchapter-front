import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Footer } from '../../component/footer/footer';

@Component({
  selector: 'app-devoluciones',

  /**
   * Importamos lo que usamos en el HTML.
   *
   * RouterLink lo necesitamos para el botón
   * que lleva a la página de contacto.
   *
   * Footer lo usamos para mostrar el pie de página.
   */
  imports: [RouterLink, Footer],

  templateUrl: './devoluciones.html',
  styleUrl: './devoluciones.css',
})
export class Devoluciones {
  /**
   * Esta página es informativa.
   *
   * De momento no necesita lógica,
   * solo muestra contenido estático al usuario.
   */
}
