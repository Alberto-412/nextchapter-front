import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Footer } from '../../component/footer/footer';

@Component({
  selector: 'app-preguntas-frecuentes',

  /**
   * Importamos los elementos que utilizaremos
   * dentro de la plantilla HTML.
   *
   * RouterLink → Permite navegar a otras páginas.
   * Footer → Pie de página común de la aplicación.
   */
  imports: [RouterLink, Footer],

  templateUrl: './preguntasFrecuentes.html',
  styleUrl: './preguntasFrecuentes.css',
})
export class PreguntasFrecuentes {
  /**
   * Página informativa de preguntas frecuentes.
   *
   * Aquí resolvemos las dudas más habituales
   * que pueden tener los usuarios sobre:
   *
   * - Registro
   * - Pedidos
   * - Envíos
   * - Devoluciones
   * - Estado de los pedidos
   * - Funcionalidades del e-commerce
   *
   * No necesitamos lógica ni llamadas al backend
   * porque todo el contenido es estático.
   */
}
