import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibrosService } from '../../core/services/libros';
import { Libro } from '../../core/models/libro';
import { FiltroLibros } from '../../core/models/filtro_libros';

import { FiltrosCatalogo } from '../../component/filtrosCatalogo/filtrosCatalogo';
import { LibroCard } from '../../component/libroCard/libroCard';
import { Newsletter } from '../../component/newsletter/newsletter';
import { Footer } from '../../component/footer/footer';

@Component({
  selector: 'app-catalogo',
  imports: [FiltrosCatalogo, LibroCard, Newsletter, Footer],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo {
  /**
   * Conecta Angular con el back de libros.
   */
  private readonly librosService = inject(LibrosService);
  private route = inject(ActivatedRoute);

  /**
   * Aquí guardamos los libros que se muestran en pantalla.
   *
   * Este signal cambia cuando:
   * - Cargamos libros.
   * - Aplicamos filtros.
   * - Ordenamos por precio.
   */
  libros = signal<Libro[]>([]);

  /**
   * Guardamos una copia de los libros tal y como llegan del back.
   *
   * Sirve para volver al orden inicial cuando
   * el usuario selecciona "Novedades".
   */
  librosOriginales = signal<Libro[]>([]);

  /**
   * Controla si estamos esperando respuesta del back.
   */
  cargando = signal(true);

  /**
   * Guarda un mensaje si ocurre un error al cargar libros.
   */
  error = signal('');

  /**
   * Página actual del catálogo.
   *
   * Empezamos en la página 1 porque
   * es la primera que verá el usuario.
   */
  paginaActual = signal(1);

  /**
   * Número de libros que queremos mostrar
   * por cada página.
   */
  limite = signal(12);

  /**
   * Total de páginas que nos devuelve el backend.
   *
   * Esto cambia si filtramos por categoría,
   * precio o búsqueda.
   */
  totalPaginas = signal(1);

  /**
   * Guardamos los últimos filtros aplicados.
   *
   * Esto es importante porque si estamos filtrando
   * por "manga" y pasamos a la página 2,
   * queremos seguir viendo manga, no volver a todos los libros.
   */
  filtrosActuales = signal<FiltroLibros>({});

  /**
   * Al entrar en la página cargamos todos los libros,
   * sin aplicar filtros.
   */
  async ngOnInit() {
  // escuchamos el ?busqueda= que manda el buscador del navbar
  this.route.queryParamMap.subscribe((params) => {
    const busqueda = params.get('busqueda') ?? '';
    this.paginaActual.set(1);
    const filtros = busqueda ? { busqueda } : {};
    this.filtrosActuales.set(filtros);
    this.cargarLibros(filtros);
  });
}


  /**
   * cargarLibros(filtros?)
   *
   * Llama al servicio getAll().
   *
   * Si no recibe filtros:
   * GET /api/libros
   *
   * Si recibe filtros:
   * GET /api/libros?categoria=1&precioMin=10&precioMax=30
   */

  async cargarLibros(filtros?: FiltroLibros) {
    try {
      this.cargando.set(true);
      this.error.set('');

      /**
       * Creamos un objeto con los filtros que llegan
       * y además le añadimos la paginación.
       *
       * Usamos spread (...) para no perder los filtros
       * de búsqueda, categoría o precio.
       */
      const filtrosConPaginacion: FiltroLibros = {
        ...filtros,
        pagina: this.paginaActual(),
        limite: this.limite(),
      };

      const response = await this.librosService.getAll(filtrosConPaginacion);

      /**
       * Guardamos los libros originales y también
       * los libros que se pintan en pantalla.
       */
      this.librosOriginales.set(response.data);
      this.libros.set(response.data);
      /**
       * Guardamos el total de páginas que devuelve el back.
       *
       * Así Angular sabe cuántos botones de páginas
       * tiene que mostrar.
       */
      this.totalPaginas.set(response.paginacion.totalPaginas);
    } catch (error) {
      console.error(error);
      this.error.set('No se pudieron cargar los libros.');
    } finally {
      this.cargando.set(false);
    }
  }

  /**
   * aplicarFiltros()
   *
   * Este método recibe los filtros emitidos
   * desde el componente hijo FiltrosCatalogo.
   *
   * Flujo:
   * FiltrosCatalogo → filtrosChange → Catalogo → LibrosService
   * Cuando aplicamos filtros volvemos siempre
   * a la página 1.
   *
   * Esto evita estar en página 4 y que al filtrar
   * no aparezca nada porque ese filtro solo tiene 1 página.
   */
  async aplicarFiltros(filtros: FiltroLibros) {
    this.paginaActual.set(1);
    this.filtrosActuales.set(filtros);

    await this.cargarLibros(filtros);
  }
  /**
   * cambiarPagina()
   *
   * Este método se llamará cuando el usuario pulse
   * una página del paginador.
   */
  async cambiarPagina(pagina: number) {
    /**
     * Evitamos ir a páginas que no existen.
     */
    if (pagina < 1 || pagina > this.totalPaginas()) {
      return;
    }

    /**
     * Actualizamos la página actual.
     */
    this.paginaActual.set(pagina);

    /**
     * Volvemos a cargar libros, pero manteniendo
     * los filtros que ya estaban aplicados.
     */
    await this.cargarLibros(this.filtrosActuales());

      // Cuando cargan los nuevos libros
  // volvemos arriba del catálogo.
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  }
  /**
   * paginas()
   *
   * Creamos un array de números para poder pintarlo
   * fácilmente en el HTML con @for.
   *
   * Si totalPaginas es 4, devuelve:
   *
   * [1, 2, 3, 4]
   */
  paginas() {
    return Array.from({ length: this.totalPaginas() }, (_, index) => index + 1);
  }

  /**
   * ordenarLibros()
   *
   * Ordena los libros en el front.
   *
   * No llama al back porque ahora mismo
   * el backend no tiene query param de ordenación.
   *
   * Opciones:
   * - novedades: vuelve al orden original
   * - precio-menor: menor a mayor
   * - precio-mayor: mayor a menor
   */
  ordenarLibros(event: Event) {
    const select = event.target as HTMLSelectElement;
    const valor = select.value;

    /**
     * Creamos una copia del array actual.
     *
     * No ordenamos directamente this.libros()
     * porque queremos mantener el estado controlado
     * usando signals.
     */
    const librosOrdenados = [...this.libros()];

    if (valor === 'precio-menor') {
      librosOrdenados.sort((a, b) => Number(a.precio) - Number(b.precio));
      this.libros.set(librosOrdenados);
      return;
    }

    if (valor === 'precio-mayor') {
      librosOrdenados.sort((a, b) => Number(b.precio) - Number(a.precio));
      this.libros.set(librosOrdenados);
      return;
    }

    /**
     * Si selecciona "Novedades",
     * restauramos el orden original del back.
     */
    this.libros.set(this.librosOriginales());
  }
}
