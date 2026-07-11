// ============================================================
// QUÉ HACE: Servicio compartido que almacena el término de
//           búsqueda del header del admin.
//           Al ser un Singleton (providedIn: 'root'), el
//           AdminLayout escribe en él y todos los componentes
//           de página (dashboard, pedidos, usuarios...) lo leen
//           para filtrar sus datos sin necesidad de @Input/@Output.
// ============================================================

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BusquedaService {

  // signal compartido: cuando AdminLayout llama a buscar(),
  // todos los computed() que lo usan en los componentes se
  // recalculan automáticamente.
  termino = signal('');

  // Normaliza el término: minúsculas y sin espacios extremos
  // para que la comparación con los datos no sea sensible a mayúsculas.
  buscar(termino: string) {
    this.termino.set(termino.toLowerCase().trim());
  }

  // Limpia la búsqueda. Se podría llamar al cambiar de página.
  limpiar() {
    this.termino.set('');
  }
}