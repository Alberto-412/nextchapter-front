import { Component, input } from '@angular/core';

import { Resena } from '../../core/models/resena';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-resenas-libro',
  imports: [DatePipe],
  templateUrl: './resenasLibro.html',
  styleUrl: './resenasLibro.css',
})
export class ResenasLibro {
  /**
   * Recibimos las reseñas desde el componente padre.
   *
   * En este caso:
   * LibroDetalle → ResenasLibro
   */
  resenas = input.required<Resena[]>();

  /**
   * Convierte una calificación numérica en estrellas.
   *
   * Ejemplo:
   * 5 → ★★★★★
   * 3 → ★★★☆☆
   */
  getEstrellas(calificacion: number): string {
    const estrellasLlenas = Math.round(calificacion);
    const estrellasVacias = 5 - estrellasLlenas;

    return '★'.repeat(estrellasLlenas) + '☆'.repeat(estrellasVacias);
  }
  /**
   * Calcula la media de todas las reseñas.
   */
  mediaResenas(): number {
    if (this.resenas().length === 0) {
      return 0;
    }

    const total = this.resenas().reduce((acc, resena) => acc + resena.calificacion, 0);

    return Number((total / this.resenas().length).toFixed(1));
  }

  /**
   * Calcula cuántas reseñas hay de 5, 4, 3, 2 y 1 estrella.
   */
  distribucion() {
    const totalResenas = this.resenas().length;

    return [5, 4, 3, 2, 1].map((estrellas) => {
      const total = this.resenas().filter((resena) => resena.calificacion === estrellas).length;

      return {
        estrellas,
        total,
        porcentaje: totalResenas > 0 ? (total / totalResenas) * 100 : 0,
      };
    });
  }
}
