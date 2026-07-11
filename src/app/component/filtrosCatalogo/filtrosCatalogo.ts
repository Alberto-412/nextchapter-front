import { Component, inject, output, signal } from '@angular/core';

import { FiltroLibros } from '../../core/models/filtro_libros';
import { Categoria } from '../../core/models/categoria';
import { CategoriasService } from '../../core/services/categorias';

@Component({
  selector: 'app-filtros-catalogo',
  templateUrl: './filtrosCatalogo.html',
  styleUrl: './filtrosCatalogo.css',
})
export class FiltrosCatalogo {
  /**
   * Servicio que conecta este componente con el back
   * para obtener las categorías desde MySQL.
   */
  private readonly categoriasService = inject(CategoriasService);

  /**
   * Envía los filtros seleccionados al componente padre.
   */
  filtrosChange = output<FiltroLibros>();

  /**
   * Categoría seleccionada actualmente.
   *
   * null significa "todas las categorías".
   */
  categoriaSeleccionada = signal<number | null>(null);

  /**
   * Precio mínimo seleccionado.
   */
  precioMin = signal<number | null>(null);

  /**
   * Precio máximo seleccionado.
   */
  precioMax = signal<number | null>(null);

  /**
   * Categorías recibidas desde el back.
   *
   * Empieza vacío y se llena cuando carga el componente.
   */
  categorias = signal<Categoria[]>([]);

  /**
   * Controla si las categorías están cargando.
   */
  cargandoCategorias = signal(true);

  /**
   * Guarda un mensaje si falla la carga de categorías.
   */
  errorCategorias = signal('');

  /**
   * Al cargar el componente, pedimos las categorías al back.
   */
  async ngOnInit() {
    await this.cargarCategorias();
  }

  /**
   * cargarCategorias()
   *
   * Llama a:
   * GET /api/categorias
   *
   * Y guarda response.data dentro del signal categorias.
   */
  async cargarCategorias() {
    try {
      this.cargandoCategorias.set(true);
      this.errorCategorias.set('');

      const response = await this.categoriasService.getAll();

      this.categorias.set(response.data);
    } catch (error) {
      console.error(error);
      this.errorCategorias.set('No se pudieron cargar las categorías.');
    } finally {
      this.cargandoCategorias.set(false);
    }
  }

  /**
   * Guarda la categoría elegida y emite los filtros.
   */
  seleccionarCategoria(categoriaId: number | null) {
    this.categoriaSeleccionada.set(categoriaId);
    this.emitirFiltros();
  }

  /**
   * Lee el input de precio mínimo.
   */
  actualizarPrecioMin(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = input.value ? Number(input.value) : null;

    this.precioMin.set(valor);
    this.emitirFiltros();
  }

  /**
   * Lee el input de precio máximo.
   */
  actualizarPrecioMax(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = input.value ? Number(input.value) : null;

    this.precioMax.set(valor);
    this.emitirFiltros();
  }

  /**
   * Resetea todos los filtros.
   */
  limpiarFiltros() {
    this.categoriaSeleccionada.set(null);
    this.precioMin.set(null);
    this.precioMax.set(null);

    this.emitirFiltros();
  }

  /**
   * Construye el objeto que recibe LibrosService.getAll(filtros).
   */
  private emitirFiltros() {
    this.filtrosChange.emit({
      categoria: this.categoriaSeleccionada() ?? undefined,
      precioMin: this.precioMin() ?? undefined,
      precioMax: this.precioMax() ?? undefined,
    });
  }
}
