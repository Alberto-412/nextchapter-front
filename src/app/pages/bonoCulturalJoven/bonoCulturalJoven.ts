import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Footer } from '../../component/footer/footer';

@Component({
  selector: 'app-bono-cultural-joven',

  /**
   * Componentes utilizados en la página.
   *
   * RouterLink → Navegación interna.
   * Footer → Pie de página común.
   */
  imports: [RouterLink, Footer],

  templateUrl: './bonoCulturalJoven.html',
  styleUrl: './bonoCulturalJoven.css',
})
export class BonoCulturalJoven {
  /**
   * Página informativa sobre el Bono Cultural Joven.
   *
   * No necesitamos llamadas al backend porque
   * toda la información es estática.
   */
}
