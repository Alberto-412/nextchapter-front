//HOME
import { Home } from './pages/home/home';
// ============================================================
// QUÉ HACE: Define qué componente se muestra en cada URL.
//           También define qué rutas están protegidas con guards
//           y cuáles tienen un layout compartido (admin).
// ============================================================

import { Routes } from '@angular/router';

// Importaciones de componentes de rutas de compañeros
import { Cart }        from './pages/cart/cart';
import { Checkout }    from './pages/checkout/checkout';
import { MyOrders }    from './pages/my-orders/my-orders';
import { OrderDetail } from './pages/order-detail/order-detail';

// Guards: controlan el acceso a las rutas protegidas
import { authGuard, adminGuard } from './guards/auth.guard';
// ↑ authGuard  → requiere estar logado (cualquier rol)
// ↑ adminGuard → requiere estar logado Y tener rol 'admin'

// Componentes del panel de administración
import { AdminLayout } from './component/admin-layout/admin-layout';
import { Dashboard }   from './pages/admin/dashboard/dashboard';
import { Productos }   from './pages/admin/productos/productos';
import { Pedidos }     from './pages/admin/pedidos/pedidos';
import { Usuarios }    from './pages/admin/usuarios/usuarios';

// Componentes del área de usuario
import { Perfil }    from './pages/usuario/perfil/perfil';
import { Wishlist }  from './pages/usuario/wishlist/wishlist';
import { Reviews }   from './pages/usuario/reviews/reviews';

// Login (propio)
import { Login } from './pages/login/login';

// Catálogo (compañeros)
import { Catalogo }    from './pages/catalogo/catalogo';
import { LibroDetalle } from './pages/libroDetalle/libroDetalle';

//Paginas simuladsas
import { Devoluciones } from './pages/devoluciones/devoluciones';
import { QuienesSomos } from './pages/quienesSomos/quienesSomos';
import { PreguntasFrecuentes } from './pages/preguntasFrecuentes/preguntasFrecuentes';
import { TrabajaConNosotros } from './pages/trabajaConNosotros/trabajaConNosotros';
import { Envios } from './pages/envios/envios';
import { BonoCulturalJoven } from './pages/bonoCulturalJoven/bonoCulturalJoven';
import { NuestrasLibrerias } from './pages/nuestrasLibrerias/nuestrasLibrerias';

//COntacto
import { Contacto } from './pages/contacto/contacto';

export const routes: Routes = [
  // Home
  { path: '', component: Home },

  // Rutas públicas
  { path: 'login', component: Login },

  // ── RUTAS PÚBLICAS ────────────────────────────────────────
  // No requieren token. Cualquiera puede acceder.
  { path: 'login',    component: Login },
  { path: 'registro', component: Login, data: { tab: 'registro' } },
  // ↑ Misma página de login con la pestaña "Nuevo cliente" abierta.
  //   data: { tab: 'registro' } → el componente lee este valor para
  //   saber qué pestaña mostrar al arrancar.

  // ── RUTAS DEL PANEL ADMIN ─────────────────────────────────
  // canActivate: [adminGuard] → el guard se ejecuta ANTES de
  // montar el componente. Si falla, redirige y no muestra nada.
  //
  // AdminLayout actúa como "marco": tiene el sidebar y el header.
  // Las rutas children se renderizan dentro de su <router-outlet>.
  // Así el sidebar no desaparece al navegar entre páginas admin.
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'productos', component: Productos },
      { path: 'pedidos',   component: Pedidos   },
      { path: 'usuarios',  component: Usuarios  },
    ],
  },

  // ── RUTAS DE USUARIO ──────────────────────────────────────
  // canActivate: [authGuard] → requiere estar logado, cualquier rol.
  { path: 'perfil',    component: Perfil,    canActivate: [authGuard] },
  { path: 'wishlist',  component: Wishlist,  canActivate: [authGuard] },
  { path: 'reviews',   component: Reviews,   canActivate: [authGuard] },

  // ── RUTAS DEL CATÁLOGO (compañeros) ───────────────────────
  { path: '',           component: Catalogo    }, // ruta raíz
  { path: 'catalogo',   component: Catalogo    },
  { path: 'libros/:id', component: LibroDetalle }, // :id = parámetro dinámico
  { path: 'cart',       component: Cart        },
  { path: 'checkout',   component: Checkout    },
  { path: 'orders',     component: MyOrders    },
  { path: 'orders/:id', component: OrderDetail },

  // Ruta temporal de desarrollo — pendiente de eliminar
  { path: 'XXXXXXXXXXX', redirectTo: 'login', pathMatch: 'full' },

  // Catálogo
  { path: 'catalogo', component: Catalogo },
  { path: 'libros/:id', component: LibroDetalle },

  //Carrito y ordenes
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'orders', component: MyOrders },
  { path: 'orders/:id', component: OrderDetail },

  //Paginas simuladas
  { path: 'devoluciones', component: Devoluciones },
  { path: 'quienes-somos', component: QuienesSomos },

  { path: 'preguntas-frecuentes', component: PreguntasFrecuentes },
  { path: 'trabaja-con-nosotros', component: TrabajaConNosotros },

  { path: 'envios', component: Envios },

  { path: 'bono-cultural-joven', component: BonoCulturalJoven },

  { path: 'nuestras-librerias', component: NuestrasLibrerias },

  //Contacto
  { path: 'contacto', component: Contacto },
];
