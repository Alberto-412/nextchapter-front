import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NewsletterService } from '../../core/services/newsletter';

@Component({
  selector: 'app-newsletter',
  imports: [FormsModule],
  templateUrl: './newsletter.html',
  styleUrl: './newsletter.css',
})
export class Newsletter {
  /**
   * Permite reutilizar este mismo componente
   * en dos tamaños diferentes.
   *
   * false → Newsletter grande, para la Home.
   * true → Newsletter compacto, para el Footer.
   */
  compacto = input(false);

  /**
   * Servicio que conecta este formulario
   * con el backend y la tabla newsletter de MySQL.
   */
  private readonly newsletterService = inject(NewsletterService);

  /**
   * Aquí guardamos el correo que escribe el usuario.
   */
  mail = '';

  /**
   * Mensaje para avisar si se ha guardado bien
   * o si ha ocurrido algún error.
   */
  mensaje = signal('');

  /**
   * Controla si el formulario está enviando datos.
   */
  cargando = signal(false);

  /**
   * Esta función se ejecuta al enviar el formulario.
   */
  async enviarNewsletter() {
    this.mensaje.set('');

    if (!this.mail.trim()) {
      this.mensaje.set('Necesitamos un email antes de pasar al siguiente capítulo.');
      return;
    }

    try {
      this.cargando.set(true);

      const response = await this.newsletterService.subscribe({
        mail: this.mail,
      });

      this.mensaje.set(response.mensaje);

      this.mail = '';
    } catch (error) {
      console.error(error);

      this.mensaje.set('Houston, tenemos un problema...');
    } finally {
      this.cargando.set(false);
    }
  }
}
