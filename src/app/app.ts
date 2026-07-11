import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './component/navbar/navbar';
import { LibrosService } from './core/services/libros';
import { Footer } from './component/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('nextChapterFront');

  /**
   * Inyectamos el servicio de libros para poder probar
   * si Angular se conecta correctamente con Node.
   */
  private readonly librosService = inject(LibrosService);

  /**
   * ngOnInit se ejecuta cuando carga la app.
   * Lo usamos temporalmente para probar si llegan libros.
   */
  async ngOnInit() {
    const response = await this.librosService.getAll();
    console.log('RESPUESTA COMPLETA:', response);

    console.log('MENSAJE:', response.mensaje);

    console.log('LIBROS:', response.data);
  }
}
