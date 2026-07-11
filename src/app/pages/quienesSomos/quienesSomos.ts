import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Footer } from '../../component/footer/footer';

@Component({
  selector: 'app-quienes-somos',

  /**
   * Importamos lo que usamos dentro del HTML.
   *
   * RouterLink lo usamos para navegar a otras páginas.
   * Footer lo usamos para mantener el pie de página común.
   */
  imports: [RouterLink, Footer],

  templateUrl: './quienesSomos.html',
  styleUrl: './quienesSomos.css',
})
export class QuienesSomos {
  /**
   * Página informativa sobre el equipo.
   *
   * No necesitamos backend porque solo mostramos
   * contenido estático sobre NextChapter.
   */
}
