// ============================================================
// QUÉ HACE: Guarda la URL base del backend en un único sitio.
//           Si algún día cambia el puerto o el dominio, solo
//           hay que cambiarla aquí y afecta a todos los servicios.
// ============================================================

export const environment = {
  apiUrl: 'http://localhost:10200/api',
  // ↑ Todos los servicios importan este valor con:
  //   private apiUrl = environment.apiUrl;
  // y construyen las URLs así: `${this.apiUrl}/admin/products`
};