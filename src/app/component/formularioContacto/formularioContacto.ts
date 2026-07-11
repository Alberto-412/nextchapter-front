import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ContactoService } from '../../core/services/contacto';
import { ContactoForm } from '../../core/models/contacto';

@Component({
  selector: 'app-formulario-contacto',
  imports: [FormsModule],
  templateUrl: './formularioContacto.html',
  styleUrl: './formularioContacto.css',
})
export class FormularioContacto {
  private readonly contactoService = inject(ContactoService);

  enviando = signal(false);
  mensajeRespuesta = signal('');
  error = signal('');

  formulario: ContactoForm = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  };

  async enviarFormulario() {
    try {
      this.enviando.set(true);
      this.mensajeRespuesta.set('');
      this.error.set('');

      const respuesta = await this.contactoService.enviarMensaje(this.formulario);

      this.mensajeRespuesta.set(respuesta.mensaje);

      this.formulario = {
        nombre: '',
        email: '',
        asunto: '',
        mensaje: '',
      };
    } catch (error) {
      this.error.set('El búho mensajero ha fallado. Revisa los datos y prueba otra vez.');
    } finally {
      this.enviando.set(false);
    }
  }
}
