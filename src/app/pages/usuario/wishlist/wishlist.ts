import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';
import { Cart as CartService } from '../../../services/cart';
@Component({
  selector: 'app-wishlist',
  imports: [CommonModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})

// en el constructor, añade el servicio:

export class Wishlist implements OnInit {

  wishlist: any[] = [];
  mensaje: string = '';
  error: string = '';

  constructor(private usuarioService: UsuarioService,private cartService: CartService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarWishlist();
  }

  agregarAlCarrito(libro: any) {
  this.cartService.agregarItem({
    id: libro.libro_id,   // ← la wishlist usa libro_id; el carrito espera id
    titulo: libro.titulo,
    precio: libro.precio,
    imagen: libro.imagen,
  });
  this.mensaje = `"${libro.titulo}" añadido al carrito`;
}

  cargarWishlist() {
    this.usuarioService.getWishlist().subscribe({
      next: (data: any) => {
        this.wishlist = [...data];
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error al cargar la lista de deseos'
    });
  }

  eliminarDeFavoritos(bookId: number) {
    this.usuarioService.removeFromWishlist(bookId).subscribe({
      next: () => {
        this.mensaje = 'Libro eliminado de favoritos';
        this.cargarWishlist();
      },
      error: () => this.error = 'Error al eliminar el libro de favoritos'
    });
  }
}