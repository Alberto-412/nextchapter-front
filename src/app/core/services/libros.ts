import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { LibrosResponse, LibroResponse } from '../models/libro';
import { FiltroLibros } from '../models/filtro_libros';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class LibrosService {
  /**
   * Inyectamos HttpClient usando inject().
   *
   * HttpClient es la herramienta de Angular que nos permite
   * hacer peticiones HTTP al back: GET, POST, PUT, DELETE.
   */
  private readonly httpClient = inject(HttpClient);

  /**
   * URL base del endpoint de libros en nuestro back.
   *
   * Aquí apuntamos a Node/Express.
   * EL PUERTO IGUAL QUE EN NODE
   */

  //apiUrl
  private readonly baseUrl = `${environment.apiUrl}/libros`;

  /**
   * getAll(filtros)
   *
   * Este método sirve para pedir al back la lista de libros.
   *
   * Puede traer:
   * - Todos los libros.
   * - Libros filtrados por búsqueda.
   * - Libros filtrados por categoría.
   * - Libros filtrados por precio mínimo y máximo.
   *
   * Ejemplo final de URL:
   * http://localhost:5000/api/libros?busqueda=harry&categoria=2
   */
  getAll(filtros?: FiltroLibros) {
    /**
     * HttpParams nos ayuda a construir los query params.
     *
     * En vez de escribir manualmente:
     * ?busqueda=harry&categoria=2
     */
    let params = new HttpParams();

    if (filtros?.busqueda) {
      params = params.set('busqueda', filtros.busqueda);
    }

    if (filtros?.categoria !== undefined) {
      params = params.set('categoria', filtros.categoria);
    }

    if (filtros?.precioMin !== undefined) {
      params = params.set('precioMin', filtros.precioMin);
    }

    if (filtros?.precioMax !== undefined) {
      params = params.set('precioMax', filtros.precioMax);
    }

    if (filtros?.pagina !== undefined) {
      params = params.set('pagina', filtros.pagina);
    }

    if (filtros?.limite !== undefined) {
      params = params.set('limite', filtros.limite);
    }

    /**
     * Hacemos la petición GET al back.
     *
     * firstValueFrom convierte el Observable de Angular
     * en una Promise para poder usar async/await,
     * MArio lo tiene asi en su guia
     */
    return firstValueFrom(
      this.httpClient.get<LibrosResponse>(this.baseUrl, {
        params,
      }),
    );
  }

  /**
   * Obtiene un libro concreto por su id.
   * Endpoint:
   * GET /api/libros/:id
   */
  getById(id: number) {
    return firstValueFrom(this.httpClient.get<LibroResponse>(`${this.baseUrl}/${id}`));
  }
}
