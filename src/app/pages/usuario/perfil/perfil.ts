import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {

  perfil: any = null;
  modoEdicion: boolean = false;
  modoPassword: boolean = false;
  mensaje: string = '';
  error: string = '';

  datosPerfil = {
    nombre: '',
    mail: ''
  };

  datosPassword = {
    contrasenaActual: '',
    contrasenaNueva: ''
  };

  constructor(private usuarioService: UsuarioService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.usuarioService.getPerfil().subscribe({
      next: (data: any) => {
        this.perfil = data;
        this.datosPerfil = { nombre: data.nombre, mail: data.mail };
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error al cargar el perfil'
    });
  }

  editarPerfil() {
    this.modoEdicion = true;
    this.modoPassword = false;
    this.mensaje = '';
    this.error = '';
  }

  guardarPerfil() {
    this.usuarioService.updatePerfil(this.datosPerfil).subscribe({
      next: () => {
        this.mensaje = 'Perfil actualizado correctamente';
        this.modoEdicion = false;
        this.cargarPerfil();
      },
      error: () => this.error = 'Error al actualizar el perfil'
    });
  }

  mostrarCambioPassword() {
    this.modoPassword = true;
    this.modoEdicion = false;
    this.mensaje = '';
    this.error = '';
  }

  cambiarPassword() {
    this.usuarioService.updatePassword(this.datosPassword).subscribe({
      next: () => {
        this.mensaje = 'Contraseña actualizada correctamente';
        this.modoPassword = false;
        this.datosPassword = { contrasenaActual: '', contrasenaNueva: '' };
      },
      error: () => this.error = 'Error al actualizar la contraseña'
    });
  }

  darDeBaja() {
    if (confirm('¿Estás seguro de que quieres darte de baja? Esta acción no se puede deshacer.')) {
      this.usuarioService.deletePerfil().subscribe({
        next: () => {
          this.mensaje = 'Cuenta dada de baja correctamente';
          localStorage.removeItem('token');
        },
        error: (err: any) => this.error = err.error?.message || 'Error al darte de baja'
      });
    }
  }

  cancelar() {
    this.modoEdicion = false;
    this.modoPassword = false;
    this.mensaje = '';
    this.error = '';
  }
}