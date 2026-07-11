import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environment';
import { ContactoForm, ContactoResponse } from '../models/contacto';

@Injectable({
  providedIn: 'root',
})
export class ContactoService {
  private readonly httpClient = inject(HttpClient);

  /**
   * Endpoint del back:
   * POST http://localhost:10200/api/contacto
   */
  private readonly baseUrl = `${environment.apiUrl}/contacto`;

  enviarMensaje(datos: ContactoForm) {
    return firstValueFrom(this.httpClient.post<ContactoResponse>(this.baseUrl, datos));
  }
}
