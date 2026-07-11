/**
 * Datos que enviamos al backend.
 *
 * El backend espera:
 * {
 *   mail: "correo@email.com"
 * }
 */
export interface Newsletter {
  mail: string;
}

/**
 * Respuesta que devuelve el backend.
 *
 * Ejemplo:
 * {
 *   mensaje: "Suscripción realizada correctamente",
 *   id: 1
 * }
 */
export interface NewsletterResponse {
  mensaje: string;
  id?: number;
}
