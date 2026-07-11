export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

/**
 * CategoriasResponse la respuesta  del back:
 * {
 *   mensaje: "Categorías encontradas",
 *   data: [...]
 * }
 */
export interface CategoriasResponse {
  mensaje: string;
  data: Categoria[];
}
