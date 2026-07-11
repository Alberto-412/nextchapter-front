import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environment';
import { Newsletter, NewsletterResponse } from '../models/newsletter';

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  /**
   * HttpClient permite hacer peticiones HTTP.
   */
  private readonly httpClient = inject(HttpClient);

  /**
   * URL base del endpoint.
   *
   * Resultado:
   * http://localhost:10200/api/newsletter
   */
  private readonly baseUrl = `${environment.apiUrl}/newsletter`;

  /**
   * Registrar email.
   *
   * POST /api/newsletter
   */
  subscribe(newsletter: Newsletter) {
    return firstValueFrom(this.httpClient.post<NewsletterResponse>(this.baseUrl, newsletter));
  }
}
