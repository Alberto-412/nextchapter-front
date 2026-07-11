import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css'
})
export class Reviews implements OnInit {

  reviews: any[] = [];
  reviewSeleccionada: any = null;
  modoEdicion: boolean = false;
  mensaje: string = '';
  error: string = '';

  datosEdicion = {
    calificacion: 0,
    comentario: ''
  };

  constructor(private usuarioService: UsuarioService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarReviews();
  }

  cargarReviews() {
    this.usuarioService.getReviews().subscribe({
      next: (data: any) => {
        this.reviews = [...data];
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error al cargar las reseñas'
    });
  }

  editarReview(review: any) {
    this.reviewSeleccionada = review;
    this.datosEdicion = { calificacion: review.calificacion, comentario: review.comentario };
    this.modoEdicion = true;
    this.mensaje = '';
    this.error = '';
  }

  guardarReview() {
    this.usuarioService.updateReview(this.reviewSeleccionada.id, this.datosEdicion).subscribe({
      next: () => {
        this.mensaje = 'Reseña actualizada correctamente';
        this.modoEdicion = false;
        this.reviewSeleccionada = null;
        this.cargarReviews();
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error al actualizar la reseña'
    });
  }

  eliminarReview(reviewId: number) {
    if (confirm('¿Estás seguro de eliminar esta reseña?')) {
      this.usuarioService.deleteReview(reviewId).subscribe({
        next: () => {
          this.mensaje = 'Reseña eliminada correctamente';
          this.cargarReviews();
          this.cdr.detectChanges();
        },
        error: () => this.error = 'Error al eliminar la reseña'
      });
    }
  }

  cancelar() {
    this.modoEdicion = false;
    this.reviewSeleccionada = null;
    this.mensaje = '';
    this.error = '';
  }
}