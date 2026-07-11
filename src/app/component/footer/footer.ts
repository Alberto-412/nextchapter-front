import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Newsletter } from '../newsletter/newsletter';

@Component({
  selector: 'app-footer',

  /**
   * Importamos lo que usamos en el HTML.
   *
   * RouterLink → Para navegar entre páginas.
   * Newsletter → Componente reutilizable en modo compacto.
   */
  imports: [RouterLink, Newsletter],

  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  /**
   * Año actual para no tener que cambiarlo a mano.
   */
  anioActual = new Date().getFullYear();
}
