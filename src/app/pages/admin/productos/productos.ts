// ============================================================
// QUÉ HACE: Página de gestión del catálogo de libros.
//           Muestra la lista con paginación y permite crear,
//           editar y eliminar productos mediante formularios
//           reactivos. Los modos se controlan con signals
//           (modoCreacion / modoEdicion) que el HTML usa para
//           mostrar la lista, el form de creación o el de edición.
// ============================================================

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService }    from '../../../services/admin.service';
import { BusquedaService } from '../../../services/busqueda.service';
// ↑ FormGroup   → agrupa FormControl en un formulario
// ↑ FormControl → representa un campo individual con su valor y validadores
// ↑ Validators  → validaciones predefinidas (required, min...)


@Component({
  selector: 'app-productos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {

  // ── PASO 1: DEPENDENCIAS ─────────────────────────────────
  private adminService    = inject(AdminService);
  private busquedaService = inject(BusquedaService);


  // ── PASO 2: SIGNALS DE ESTADO ────────────────────────────
  productos    = signal<any[]>([]);
  modoEdicion  = signal(false);   // true = muestra el formulario de edición
  modoCreacion = signal(false);   // true = muestra el formulario de creación
  mensaje      = signal('');
  error        = signal('');
  isLoading    = signal(false);   // bloquea botones mientras se espera respuesta


  // ── PASO 3: PAGINACIÓN ───────────────────────────────────
  paginaActual  = signal(1);
  itemsPorPagina = 8;

  // Devuelve solo los productos de la página actual.
  productosEnPagina = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    return this.productos().slice(inicio, inicio + this.itemsPorPagina);
  });

  totalPaginas = computed(() =>
    Math.ceil(this.productos().length / this.itemsPorPagina)
  );

  // Array numérico para generar los botones de paginación en el HTML.
  paginasArray = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );


  // ── PASO 4: COMPUTED DE CLASIFICACIÓN ────────────────────
  // Extrae editoriales y categorías únicas de los productos cargados
  // para rellenar los <select> de los formularios dinámicamente.
  // Set<string> evita duplicados; luego se convierte a array ordenado.

  editoriales = computed(() => {
    const eds = new Set<string>();
    this.productos().forEach(p => { if (p.editorial) eds.add(p.editorial); });
    return Array.from(eds).map(nombre => ({ nombre })).sort((a, b) => a.nombre.localeCompare(b.nombre));
  });

  categorias = computed(() => {
    const cats = new Set<string>();
    this.productos().forEach(p => {
      if (p.categorias) {
        // Las categorías vienen como string separado por comas: "Ficción,Thriller"
        p.categorias.split(',').forEach((c: string) => cats.add(c.trim()));
      }
    });
    return Array.from(cats).map(nombre => ({ nombre })).sort((a, b) => a.nombre.localeCompare(b.nombre));
  });

  autores = computed(() => {
    const auts = new Set<string>();
    this.productos().forEach(p => {
      if (p.autores) {
        // Los autores vienen como string separado por comas: "Autor 1,Autor 2"
        p.autores.split(',').forEach((c: string) => auts.add(c.trim()));
      }
    });
    return Array.from(auts).map(nombre => ({ nombre })).sort((a, b) => a.nombre.localeCompare(b.nombre));
  });

  // ── PASO 5: FORMULARIOS REACTIVOS ────────────────────────
  // Dos formularios separados: uno para crear y otro para editar.
  // Esto evita que los campos se "contaminen" entre operaciones.
  //
  // El de edición tiene un campo 'id' (hidden) para saber qué
  // producto actualizar al guardar.

  formularioCreacion = new FormGroup({
    titulo:            new FormControl('',   [Validators.required]),
    autores:           new FormControl(''),
    descripcion:       new FormControl(''),
    isbn:              new FormControl(''),
    precio:            new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    stock:             new FormControl(0,    [Validators.required, Validators.min(0)]),
    pre_reserva:       new FormControl(0),
    imagen:            new FormControl(''),
    fecha_publicacion: new FormControl(''),
    editorial:         new FormControl(''),
    categorias:        new FormControl('')
  });

  formularioEdicion = new FormGroup({
    id:                new FormControl<number | null>(null), // ID del producto a editar
    titulo:            new FormControl('',   [Validators.required]),
    autores:           new FormControl(''),
    descripcion:       new FormControl(''),
    isbn:              new FormControl(''),
    precio:            new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    stock:             new FormControl(0,    [Validators.required, Validators.min(0)]),
    pre_reserva:       new FormControl(0),
    imagen:            new FormControl(''),
    fecha_publicacion: new FormControl(''),
    editorial:         new FormControl(''),
    categorias:        new FormControl('')
  });


  // ── PASO 6: CICLO DE VIDA ────────────────────────────────
  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.isLoading.set(true);
    this.adminService.getProducts().subscribe({
      next: (data: any) => {
        this.productos.set(data);
        this.paginaActual.set(1); // siempre volvemos a la primera página al recargar
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los productos');
        this.isLoading.set(false);
      }
    });
  }


  // ── PASO 7: PAGINACIÓN ───────────────────────────────────
  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) this.paginaActual.set(pagina);
  }
  paginaAnterior() {
    if (this.paginaActual() > 1) this.paginaActual.update(p => p - 1);
  }
  paginaSiguiente() {
    if (this.paginaActual() < this.totalPaginas()) this.paginaActual.update(p => p + 1);
  }


  // ── PASO 8: CREACIÓN ─────────────────────────────────────
  // mostrarFormularioCreacion() activa el modo y resetea el form.
  mostrarFormularioCreacion() {
    this.modoCreacion.set(true);
    this.modoEdicion.set(false);
    this.formularioCreacion.reset();
    this.mensaje.set('');
    this.error.set('');
  }

  crearProducto() {
    if (this.formularioCreacion.invalid) {
      this.error.set('Por favor completa los campos obligatorios');
      return;
    }
    this.isLoading.set(true);
    this.adminService.createProduct(this.formularioCreacion.value).subscribe({
      next: () => {
        this.mensaje.set('Producto creado correctamente');
        this.modoCreacion.set(false);
        this.formularioCreacion.reset();
        this.cargarProductos();
      },
      error: () => {
        this.error.set('Error al crear el producto');
        this.isLoading.set(false);
      }
    });
  }


  // ── PASO 9: EDICIÓN ──────────────────────────────────────
  // editarProducto() carga los datos del producto del backend
  // y los vuelca en el formulario con patchValue().
  //
  // DETALLE de la fecha: el backend devuelve la fecha en formato ISO
  // (con tiempo: "2020-01-15T00:00:00.000Z"). El input type="date"
  // solo acepta "YYYY-MM-DD", así que la convertimos antes de patchValue().
  editarProducto(productId: number) {
    this.isLoading.set(true);
    this.adminService.getProductById(productId).subscribe({
      next: (data: any) => {
        if (data.fecha_publicacion) {
          const fecha  = new Date(data.fecha_publicacion);
          const year   = fecha.getFullYear();
          const month  = String(fecha.getMonth() + 1).padStart(2, '0');
          const day    = String(fecha.getDate()).padStart(2, '0');
          data.fecha_publicacion = `${year}-${month}-${day}`;
        }
        // patchValue() rellena el formulario con los datos del producto.
        // A diferencia de setValue(), acepta objetos parciales.
        this.formularioEdicion.patchValue(data);
        this.modoEdicion.set(true);
        this.modoCreacion.set(false);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar el producto');
        this.isLoading.set(false);
      }
    });
  }

  guardarProducto() {
    if (this.formularioEdicion.invalid) {
      this.error.set('Por favor completa los campos obligatorios');
      return;
    }
    // Leemos el ID del campo oculto del formulario para la URL del PUT.
    const productId = this.formularioEdicion.get('id')?.value;
    if (!productId || typeof productId !== 'number') {
      this.error.set('Error: ID del producto inválido');
      return;
    }
    this.isLoading.set(true);
    this.adminService.updateProduct(productId, this.formularioEdicion.value).subscribe({
      next: () => {
        this.mensaje.set('Producto actualizado correctamente');
        this.modoEdicion.set(false);
        this.formularioEdicion.reset();
        this.cargarProductos();
      },
      error: () => {
        this.error.set('Error al actualizar el producto');
        this.isLoading.set(false);
      }
    });
  }


  // ── PASO 10: ELIMINACIÓN ─────────────────────────────────
  // confirm() muestra un diálogo nativo del navegador para confirmar.
  // Si el usuario cancela, la función termina sin hacer nada.
  eliminarProducto(productId: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    this.isLoading.set(true);
    this.adminService.deleteProduct(productId).subscribe({
      next: () => {
        this.mensaje.set('Producto eliminado correctamente');
        this.cargarProductos();
      },
      error: () => {
        this.error.set('Error al eliminar el producto');
        this.isLoading.set(false);
      }
    });
  }


  // ── PASO 11: CERRAR ──────────────────────────────────────
  // Vuelve a la vista de lista desactivando ambos modos y
  // reseteando los formularios y mensajes.
  cerrar() {
    this.modoEdicion.set(false);
    this.modoCreacion.set(false);
    this.formularioCreacion.reset();
    this.formularioEdicion.reset();
    this.mensaje.set('');
    this.error.set('');
  }
}