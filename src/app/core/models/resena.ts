/**
 * Modelo Resena
 *
 * Representa una reseña escrita por un usuario
 * sobre un libro/producto.
 */
export interface Resena {
  id: number;
  calificacion: number;
  comentario: string;
  fecha: string;
  id_usuario: number;
  id_producto: number;
  usuario_nombre: string;
  usuario_mail: string;
}

/**
 * Respuesta del back:
 *
 * GET /api/libros/:id/resenas
 */
export interface ResenasResponse {
  mensaje: string;
  data: Resena[];
}
