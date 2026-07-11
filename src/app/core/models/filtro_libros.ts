/**
 * FiltroLibros
 *
 * Chicos esta interfaz representa los filtros que podemos enviar
 * desde Angular al back cuando queremos buscar libros.
 *
 * Ejemplos de uso:
 * - Buscar por texto: ?busqueda=harry
 * - Filtrar por categoría: ?categoria=2
 * - Filtrar por precio: ?precioMin=10&precioMax=30
 *
 * Todos los campos llevan ? porque son opcionales.
 * El usuario puede buscar con un filtro, varios o ninguno.
 */
export interface FiltroLibros {
  busqueda?: string;
  categoria?: number;
  precioMin?: number;
  precioMax?: number;
  //paginación
  pagina?: number;
  limite?: number;
}
