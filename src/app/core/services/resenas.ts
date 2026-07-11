import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environment';
import { ResenasResponse } from '../models/resena';

@Injectable({
  providedIn: 'root',
})
export class ResenasService {
  /**
   * HttpClient permite hacer peticiones HTTP al backend.
   */
  private readonly httpClient = inject(HttpClient);

  /**
   * URL base del back.
   */
  private readonly baseUrl = environment.apiUrl;

  /**
   * getByLibroId()
   *
   * Pide al backend todas las reseñas
   * de un libro concreto.
   *
   * Endpoint:
   * GET /api/libros/:id/resenas
   */
  getByLibroId(idLibro: number) {
    return firstValueFrom(
      this.httpClient.get<ResenasResponse>(`${this.baseUrl}/libros/${idLibro}/resenas`),
    );
  }
}
