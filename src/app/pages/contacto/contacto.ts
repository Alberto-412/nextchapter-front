import { Component } from '@angular/core';
import { FormularioContacto } from '../../component/formularioContacto/formularioContacto';
import { Footer } from '../../component/footer/footer';

@Component({
  selector: 'app-contacto',
  imports: [FormularioContacto, Footer],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {}
