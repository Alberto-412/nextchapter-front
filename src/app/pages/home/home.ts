import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LibrosService } from '../../core/services/libros';
import { Libro } from '../../core/models/libro';
import { Footer } from '../../component/footer/footer';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  /**
   * Traemos el servicio de libros para pedir datos reales al backend.
   */
  private readonly librosService = inject(LibrosService);

  /**
   * Con esto puedo acceder al contenedor del carrusel desde TypeScript.
   */
  @ViewChild('slider')
  slider!: ElementRef<HTMLDivElement>;

  /**
   * Aquí guardo las novedades que se van a mostrar en el home.
   */
  novedades = signal<Libro[]>([]);

  constructor() {
    this.cargarNovedades();
  }

  /**
   * Cargo libros desde el backend.
   * Uso slice(0, 15) para tener bastantes portadas y que las flechas tengan sentido.
   */
  async cargarNovedades() {
    try {
      const response = await this.librosService.getAll();

      this.novedades.set(response.data.slice(0, 15));
    } catch (error) {
      console.log('Error al cargar las novedades del home', error);
    }
  }

  /**
   * Mueve el carrusel hacia la derecha.
   */
  scrollDerecha() {
    this.slider.nativeElement.scrollBy({
      left: 500,
      behavior: 'smooth',
    });
  }

  /**
   * Mueve el carrusel hacia la izquierda.
   */
  scrollIzquierda() {
    this.slider.nativeElement.scrollBy({
      left: -500,
      behavior: 'smooth',
    });
  }
}
