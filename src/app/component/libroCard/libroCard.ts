import { Component, input, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { Libro } from '../../core/models/libro';
import { UsuarioService } from '../../services/usuario.service'; // ajusta la ruta si tu carpeta difiere

@Component({
  selector: 'app-libro-card',
  templateUrl: './libroCard.html',
  styleUrl: './libroCard.css',
  imports: [RouterLink],
})
export class LibroCard {
  libro = input.required<Libro>();

  // ¿Este libro está marcado como favorito? (estado local de la tarjeta)
  esFavorito = signal(false);

  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  toggleFavorito(event: Event) {
    // Evita que el clic en el corazón navegue al detalle del libro
    event.preventDefault();
    event.stopPropagation();

    // Favoritos requiere sesión
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.libro().id;

    if (this.esFavorito()) {
      this.usuarioService.removeFromWishlist(id).subscribe({
        next: () => this.esFavorito.set(false),
        error: () => this.esFavorito.set(true), // si falla, dejamos el icono como estaba
      });
    } else {
      this.usuarioService.addToWishlist(id).subscribe({
        next: () => this.esFavorito.set(true),
        error: () => this.esFavorito.set(false),
      });
    }
  }

  getEstrellas(rating?: string | null): string {
    const numeroRating = Number(rating ?? 0);
    const estrellasLlenas = Math.round(numeroRating);
    const estrellasVacias = 5 - estrellasLlenas;
    return '★'.repeat(estrellasLlenas) + '☆'.repeat(estrellasVacias);
  }
}