import { Component } from '@angular/core';

import { Footer } from '../../component/footer/footer';

@Component({
  selector: 'app-trabaja-con-nosotros',

  /**
   * Importamos el footer para mantener
   * la misma estructura visual del resto
   * de páginas públicas.
   */
  imports: [Footer],

  templateUrl: './trabajaConNosotros.html',
  styleUrl: './trabajaConNosotros.css',
})
export class TrabajaConNosotros {
  /**
   * Página informativa de empleo.
   *
   * Mostramos algunas ofertas ficticias
   * para dar más realismo al proyecto.
   */
}
