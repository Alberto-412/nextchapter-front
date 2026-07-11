import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Libro } from '../../core/models/libro';
import { LibrosService } from '../../core/services/libros';

import { Resena } from '../../core/models/resena';
import { ResenasService } from '../../core/services/resenas';
import { ResenasLibro } from '../../component/resenasLibro/resenasLibro';
import { Cart as CartService } from '../../services/cart';
import { Footer } from '../../component/footer/footer';

// Servicio propio (no de un compañero): ya tiene el método addReview()
// listo para usar, apuntando a POST /reviews.
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-libro-detalle',
  templateUrl: './libroDetalle.html',
  styleUrl: './libroDetalle.css',
  imports: [DatePipe, RouterLink, ResenasLibro, Footer],
})
export class LibroDetalle {
  private readonly cartService = inject(CartService);
  /**
   * ActivatedRoute nos permite leer datos de la URL.
   *
   * Ejemplo:
   * /libros/1
   *
   * De ahí sacamos el id del libro.
   */
  private readonly route = inject(ActivatedRoute);

  /**
   * Servicio que conecta Angular con el backend de libros.
   *
   * Lo usamos para pedir:
   * GET /api/libros/:id
   */
  private readonly librosService = inject(LibrosService);

  /**
   * Servicio que conecta Angular con el backend de reseñas.
   *
   * Lo usamos para pedir:
   * GET /api/libros/:id/resenas
   */
  private readonly resenasService = inject(ResenasService);

  /**
   * Servicio de usuario (propio). Lo usamos solo para el método
   * addReview(), que ya existía y apunta a POST /reviews.
   */
  private readonly usuarioService = inject(UsuarioService);

  /**
   * Aquí guardamos el libro recibido desde el backend.
   *
   * Empieza en null porque al cargar la página
   * todavía no hemos recibido ningún libro.
   */
  libro = signal<Libro | null>(null);

  /**
   * Aquí guardamos las reseñas del libro.
   *
   * Empieza como array vacío porque puede que:
   * - todavía no hayan llegado del backend
   * - o el libro no tenga reseñas
   */
  resenas = signal<Resena[]>([]);

  /**
   * Controla si la página está cargando.
   *
   * Mientras sea true podemos mostrar
   * un mensaje tipo "Cargando libro...".
   */
  cargando = signal(true);

  /**
   * Guarda un mensaje si algo falla.
   *
   * Por ejemplo:
   * - id no válido
   * - error al llamar al backend
   */
  error = signal('');

  /**
   * ngOnInit()
   *
   * Se ejecuta al cargar esta página.
   *
   * Aquí:
   * 1. Leemos el id de la URL.
   * 2. Validamos que sea correcto.
   * 3. Cargamos el libro.
   * 4. Cargamos sus reseñas.
   */
  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('El libro solicitado no es válido.');
      this.cargando.set(false);
      return;
    }

    await this.cargarDetalle(id);
  }
  agregarAlCarrito(libro: Libro) {
  this.cartService.agregarItem(libro);
}

  /**
   * cargarDetalle(id)
   *
   * Carga todo lo necesario para esta página:
   * - Detalle del libro.
   * - Reseñas del libro.
   *
   * Usamos Promise.all para lanzar las dos peticiones
   * a la vez y no esperar una detrás de otra.
   */
  async cargarDetalle(id: number) {
    try {
      this.cargando.set(true);
      this.error.set('');

      const [libroResponse, resenasResponse] = await Promise.all([
        this.librosService.getById(id),
        this.resenasService.getByLibroId(id),
      ]);

      this.libro.set(libroResponse.data);
      this.resenas.set(resenasResponse.data);
    } catch (error) {
      console.error(error);
      this.error.set('No se pudo cargar el detalle del libro.');
    } finally {
      this.cargando.set(false);
    }
  }

  // ════════════════════════════════════════════════════════
  // BLOQUE NUEVO: puntuar el libro y dejar una reseña.
  // Todo lo de aquí abajo es añadido; nada de lo anterior se ha tocado.
  // ════════════════════════════════════════════════════════

  /**
   * true si hay un token guardado → el usuario ha iniciado sesión.
   * Es de solo lectura: no cambia durante la vida de esta página,
   * así que no necesita ser un signal.
   */
  protected readonly estaLogueado = !!localStorage.getItem('token');

  /**
   * Puntuación elegida en el desplegable (0 a 5). 0 = ninguna todavía.
   */
  calificacionSeleccionada = signal(0);

  /** Texto del comentario que está escribiendo el usuario. */
  comentarioNuevo = signal('');

  /** true mientras esperamos la respuesta del backend al publicar. */
  enviandoResena = signal(false);

  /** Mensaje de error al publicar (ej: backend caído, sin puntuación...). */
  errorResena = signal('');

  /** Mensaje de éxito tras publicar correctamente. */
  mensajeOkResena = signal('');

  /**
   * Actualiza la puntuación elegida en el <select>.
   * Mismo patrón que actualizarComentario(): castear el
   * event.target para leer su valor.
   */
  actualizarCalificacion(event: Event) {
    const valor = Number((event.target as HTMLSelectElement).value);
    this.calificacionSeleccionada.set(valor);
  }

  /**
   * Actualiza el comentario mientras el usuario escribe.
   * Mismo patrón que usa AdminLayout.onBuscar(): castear el
   * event.target a HTMLTextAreaElement para leer su valor.
   */
  actualizarComentario(event: Event) {
    const valor = (event.target as HTMLTextAreaElement).value;
    this.comentarioNuevo.set(valor);
  }


  /**
   * Publica la reseña nueva.
   *
   * 1. Valida que se haya elegido una puntuación.
   * 2. Llama a usuarioService.addReview() (ya existía, solo lo usamos).
   * 3. Si va bien: limpia el formulario y recarga solo las reseñas
   *    (no hace falta recargar el libro entero).
   */
  enviarResena() {
    if (this.calificacionSeleccionada() === 0) {
      this.errorResena.set('Selecciona una puntuación del 1 al 5.');
      return;
    }

    const libroActual = this.libro();
    if (!libroActual) return;

    this.enviandoResena.set(true);
    this.errorResena.set('');
    this.mensajeOkResena.set('');

    const body = {
      producto_id: libroActual.id,
      calificacion: this.calificacionSeleccionada(),
      comentario: this.comentarioNuevo().trim(),
    };

    this.usuarioService.addReview(body).subscribe({
      next: () => {
        this.enviandoResena.set(false);
        this.mensajeOkResena.set('¡Gracias! Tu reseña se ha publicado correctamente.');
        this.calificacionSeleccionada.set(0);
        this.comentarioNuevo.set('');
        this.recargarResenas(libroActual.id);
      },
      error: (err: any) => {
        this.enviandoResena.set(false);
        this.errorResena.set(err.error?.message || 'No se pudo publicar la reseña.');
      },
    });
  }

  /**
   * Vuelve a pedir solo las reseñas del libro (no el libro entero)
   * para que la reseña recién publicada aparezca al instante.
   */
  private async recargarResenas(id: number) {
    try {
      const resenasResponse = await this.resenasService.getByLibroId(id);
      this.resenas.set(resenasResponse.data);
    } catch (error) {
      // Si falla este refresco silencioso no mostramos error:
      // la reseña ya se guardó correctamente en el backend,
      // solo no se ha podido refrescar la lista todavía.
      console.error(error);
    }
  }
}