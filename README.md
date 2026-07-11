# NextChapter — Web (frontend)

Cliente web de NextChapter, una librería online, desarrollado con Angular. Es el frontend del proyecto final del bootcamp: catálogo de libros con filtros y búsqueda, ficha de producto con reseñas, carrito, checkout, área de usuario (perfil, pedidos, wishlist, reseñas propias) y un panel de administración (dashboard, usuarios, productos, pedidos).

Repositorio hermano: [nextchapter-back](https://github.com/Alberto-412/nextchapter-back) (API en Node/Express, necesaria para que esta app funcione).

## Stack

- Angular 21 (standalone components, signals)
- Bootstrap 5
- RxJS

## Requisitos previos

- Node.js 20+
- El backend de [nextchapter-back](https://github.com/Alberto-412/nextchapter-back) corriendo (por defecto en `http://localhost:10200`)

## Instalación

```bash
git clone https://github.com/Alberto-412/nextchapter-front.git
cd nextchapter-front
npm install
```

### Configurar la URL de la API

La URL del backend está centralizada en [`src/app/environment.ts`](src/app/environment.ts):

```ts
export const environment = {
  apiUrl: 'http://localhost:10200/api',
};
```

Si tu backend corre en otro puerto o dominio, cambia `apiUrl` aquí.

### Arrancar en desarrollo

```bash
npm start
```

Abre `http://localhost:4200/`. La app recarga sola al guardar cambios.

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm start` | Levanta el servidor de desarrollo (`ng serve`) |
| `npm run build` | Build de producción en `dist/` |
| `npm run watch` | Build en modo desarrollo con watch |
| `npm test` | Ejecuta los tests unitarios (Vitest) |

## Estructura del proyecto

```
src/app/
├── core/           # interceptor de auth, modelos y servicios de solo lectura (libros, categorías, reseñas...)
├── services/       # servicios con estado o que requieren sesión (usuario, admin, carrito, pedidos)
├── guards/         # authGuard (requiere sesión) y adminGuard (requiere rol admin)
├── component/       # componentes compartidos (navbar, footer, header, sidebar admin...)
├── components/     # componentes de las tarjetas de pedido/checkout
└── pages/          # una carpeta por página/ruta (catálogo, checkout, admin, usuario...)
```

## Autenticación

El token JWT se guarda en `localStorage` tras el login. Un interceptor HTTP global (`core/interceptor/auth.interceptor.ts`) lo añade automáticamente a todas las peticiones y, si el backend responde `401` (token caducado o inválido), limpia la sesión y redirige a `/login`.

## Notas

- El método de pago en el checkout es una simulación (proyecto académico, sin pasarela de pago real).