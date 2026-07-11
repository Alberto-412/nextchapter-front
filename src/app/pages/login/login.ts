// ============================================================
// QUÉ HACE: Controla la página de acceso (login + registro).
//           Una sola clase gestiona las dos pestañas.
// RUTAS:    /login    → pestaña "Entrar"
//           /registro → pestaña "Nuevo cliente"
// ============================================================


// ── PASO 1: IMPORTACIONES ───────────────────────────────────

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
// ↑ Component             → marca la clase como un componente Angular
// ↑ signal()              → variable reactiva: cuando cambia, el HTML
//                           que la usa se actualiza automáticamente
// ↑ inject()              → forma moderna de pedir dependencias
// ↑ ChangeDetectionStrategy → estrategia de detección de cambios (ver PASO 4)

import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
// ↑ ReactiveFormsModule    → activa formGroup y formControlName en el HTML
// ↑ NonNullableFormBuilder → crea formularios donde los valores nunca son null
// ↑ Validators             → validaciones predefinidas: required, email, minLength...
// ↑ AbstractControl        → tipo que representa un control O un grupo entero.
//                            Lo usamos en el validador personalizado (PASO 2)
//                            porque necesitamos recibir el grupo, no un campo solo.
// ↑ ValidationErrors       → tipo del objeto que devuelve un validador con error:
//                            ej: { noCoinciden: true }

import { ActivatedRoute, Router } from '@angular/router';
// ↑ ActivatedRoute → da acceso a los datos de la ruta actual.
//                    Lo usamos para leer data: { tab: 'registro' }
//                    que viene de app.routes.ts y decidir qué pestaña abrir.
// ↑ Router         → permite navegar a otra página desde el código TypeScript.
//                    Lo usamos al hacer login para ir a /admin/dashboard o /perfil.

import { UsuarioService } from '../../services/usuario.service';
// ↑ Nuestro servicio: centraliza todas las llamadas HTTP al backend.


// ── PASO 2: VALIDADOR PERSONALIZADO (fuera de la clase) ─────
// Esta función vive FUERA de la clase porque no necesita acceder
// a ninguna propiedad del componente. Es una función pura y reutilizable.
//
// ¿Por qué vive en el GRUPO y no en un control individual?
// Porque necesita comparar dos campos a la vez. Un validador de control
// solo ve su propio valor. Al ponerlo en el grupo, recibe el formulario
// entero y puede leer cualquier campo.
//
// → Devuelve null si las contraseñas coinciden (sin error).
// → Devuelve { noCoinciden: true } si no coinciden (con error).
//   Este error vive en el grupo: registroForm.hasError('noCoinciden').
//   Por eso el input de repetir nunca se marca ng-invalid por esto
//   y necesitamos el binding manual [class.acceso__input--error] en el HTML.

const contrasenasCoinciden = (group: AbstractControl): ValidationErrors | null => {
  const contrasena = group.get('contrasena')?.value;
  const repetir    = group.get('repetirContrasena')?.value;
  return contrasena === repetir ? null : { noCoinciden: true };
};


// ── PASO 3: DECORADOR @Component ────────────────────────────
// Le dice a Angular cómo usar esta clase como componente.

@Component({
  selector: 'app-login',          // etiqueta HTML: <app-login>
  imports: [ReactiveFormsModule], // módulos que necesita el template
  templateUrl: './login.html',
  styleUrl: './login.css',

  // PASO 4: OnPush
  // Estrategia de detección de cambios recomendada por Angular.
  // Con la estrategia por defecto, Angular revisa todo el componente
  // en cada ciclo. Con OnPush, solo lo repinta cuando:
  //   - Cambia un signal que el template usa.
  //   - El usuario dispara un evento (click, submit...).
  // Es más eficiente y es el patrón recomendado en angular.dev.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {


  // ── PASO 5: DEPENDENCIAS ──────────────────────────────────
  // Se inyectan con inject() como propiedades privadas.
  // "private readonly" → solo se usan dentro de esta clase y no cambian.

  private readonly usuarioService = inject(UsuarioService); // llamadas HTTP
  private readonly router         = inject(Router);         // navegación
  private readonly route          = inject(ActivatedRoute); // datos de la ruta
  private readonly fb             = inject(NonNullableFormBuilder); // crear formularios


  // ── PASO 6: SIGNALS DE ESTADO ─────────────────────────────
  // Cada signal controla una parte del estado de la UI.
  // Cuando se llama a .set() o .update(), el HTML se actualiza solo.
  // En el HTML se leen con paréntesis: tabActiva(), error(), etc.

  // Qué pestaña está visible: 'entrar' (login) o 'registro'.
  // Lee el dato que pasó app.routes.ts: si venimos de /registro,
  // arranca en 'registro'; si no, en 'entrar' por defecto.
  tabActiva = signal<'entrar' | 'registro'>(
    this.route.snapshot.data['tab'] === 'registro' ? 'registro' : 'entrar'
  );

  cargando      = signal(false); // true mientras espera respuesta del backend
                                 // → deshabilita el botón para evitar doble envío
  error         = signal('');    // mensaje de error del servidor (credenciales, etc.)
  mensajeOk     = signal('');    // mensaje de éxito (ej: cuenta creada)
  verContrasena = signal(false); // true → los inputs de contraseña muestran texto plano


  // ── PASO 7: FORMULARIOS REACTIVOS ─────────────────────────
  // Dos formularios independientes, uno por pestaña.
  // fb.group() crea el formulario con sus campos y validadores.
  // El formato de cada campo es: ['valor inicial', [validadores]]

  // Formulario de LOGIN: solo email y contraseña.
  loginForm = this.fb.group({
    mail:      ['', [Validators.required, Validators.email]],
    contrasena:['', [Validators.required]],
  });

  // Formulario de REGISTRO: cuatro campos.
  // IMPORTANTE: "repetirContrasena" es solo del frontend.
  // Nunca se envía al backend, solo sirve para la validación visual.
  registroForm = this.fb.group(
    {
      nombre:            ['', [Validators.required, Validators.minLength(2)]],
      mail:              ['', [Validators.required, Validators.email]],
      contrasena:        ['', [Validators.required, Validators.minLength(6)]],
      repetirContrasena: ['', [Validators.required]],
    },
    { validators: contrasenasCoinciden } // ← validador del GRUPO (ver PASO 2)
  );


  // ── PASO 8: MÉTODO cambiarTab() ───────────────────────────
  // Cambia la pestaña visible y limpia los mensajes para que
  // no se arrastren de una pestaña a la otra.
  // Lo llaman: los botones de pestaña y los enlaces "Regístrate"/"Inicia sesión".

  cambiarTab(tab: 'entrar' | 'registro') {
    this.tabActiva.set(tab);
    this.error.set('');
    this.mensajeOk.set('');
  }


  // ── PASO 9: MÉTODO toggleVerContrasena() ──────────────────
  // Alterna entre mostrar y ocultar la contraseña (icono del ojo).
  // .update() recibe el valor actual (v) y devuelve el nuevo (!v).

  toggleVerContrasena() {
    this.verContrasena.update((v) => !v);
  }


  // ── PASO 10: MÉTODO login() ───────────────────────────────
  // Se ejecuta cuando el usuario pulsa "iniciar sesión".
  // Lo dispara el (ngSubmit) del <form> en el HTML.

  login() {

    // 10a. Validación en el frontend antes de llamar al backend.
    //      Si el formulario es inválido, markAllAsTouched() activa
    //      las clases ng-touched en todos los campos para mostrar
    //      los bordes rosas y los mensajes de error. El return
    //      corta la ejecución: no se hace ninguna petición HTTP.
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // 10b. Activamos el estado de carga y limpiamos mensajes anteriores.
    this.cargando.set(true);
    this.error.set('');
    this.mensajeOk.set('');

    // 10c. Construimos el body que espera el backend.
    //      getRawValue() devuelve los valores aunque el campo esté deshabilitado.
    //      Usamos "contraseña" con ñ porque así lo espera el backend.
    const body = {
      mail:      this.loginForm.getRawValue().mail,
      contraseña:this.loginForm.getRawValue().contrasena,
    };

    // 10d. Llamamos al servicio. Devuelve un Observable, que es la forma
    //      de Angular de manejar operaciones asíncronas (como una promesa).
    //      .subscribe() define qué hacer cuando llega la respuesta:
    //        next  → respuesta correcta (token recibido)
    //        error → el backend respondió con un código de error HTTP

    this.usuarioService.login(body).subscribe({

      next: (data: any) => {
        // Guardamos el token en localStorage para que sobreviva recargas.
        localStorage.setItem('token', data.token);

        // Decodificamos el payload del JWT para leer el rol sin otra petición.
        // Un JWT tiene 3 partes separadas por puntos: cabecera.payload.firma
        // El payload está en Base64 → atob() lo decodifica → JSON.parse() lo convierte en objeto.
        const payload = JSON.parse(atob(data.token.split('.')[1]));

        // Redirigimos según el rol: misma lógica que usa el adminGuard.
        if (payload.rol === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/perfil']);
        }
      },

      error: (err: any) => {
        this.cargando.set(false);

        // 403 → cuenta existe pero el admin aún no la ha validado.
        //       Lo tratamos aparte para dar un mensaje específico.
        // Otro → credenciales incorrectas u otro error del servidor.
        if (err.status === 403) {
          this.error.set(
            err.error?.message || 'Tu cuenta está pendiente de validación por un administrador.'
          );
        } else {
          this.error.set(err.error?.message || 'Error al iniciar sesión.');
        }
      },
    });
  }


  // ── PASO 11: MÉTODO registrar() ───────────────────────────
  // Se ejecuta cuando el usuario pulsa "crear cuenta".

  registrar() {

    // 11a. Igual que en login(): validamos antes de llamar al backend.
    //      markAllAsTouched() muestra todos los errores de campo.
    //      El validador de grupo (contrasenasCoinciden) también se evalúa aquí.
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    this.mensajeOk.set('');

    const valores = this.registroForm.getRawValue();

    // 11b. Construimos el body con SOLO los tres campos que espera el backend.
    //      "repetirContrasena" NO se incluye: es una validación exclusiva del front.
    const body = {
      nombre:    valores.nombre,
      mail:      valores.mail,
      contraseña:valores.contrasena,
    };

    this.usuarioService.register(body).subscribe({

      next: () => {
        this.cargando.set(false);

        // 11c. Registro exitoso: limpiamos el formulario, volvemos a la pestaña
        //      de login y mostramos el aviso de validación pendiente.
        //      NO guardamos token ni redirigimos: el usuario no puede entrar aún.
        this.registroForm.reset();
        this.tabActiva.set('entrar');
        this.mensajeOk.set(
          'Tu cuenta se ha creado correctamente. Un administrador debe validarla antes de que puedas iniciar sesión.'
        );
      },

      error: (err: any) => {
        this.cargando.set(false);
        // Ej: email ya registrado.
        this.error.set(err.error?.message || 'Error al crear la cuenta.');
      },
    });
  }
}