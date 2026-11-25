= Acceso al Sistema y Autenticación

El módulo de autenticación implementa los requerimientos funcionales *FRQ-0001* (Iniciar sesión), *FRQ-0002* (Cerrar sesión) y parcialmente *FRQ-0003* (Administrar cuentas: se registra una cuenta por restaurante). *FRQ-0004* (Asignar permisos por rol) no está implementado en esta versión, protegiendo la confidencialidad mediante tokens de sesión seguros y cifrado de contraseñas con salting criptográfico (NFR-0002).

== Portal de Bienvenida y Acceso Web

Al acceder a la dirección base del servidor (en el entorno local, `http://localhost:3000` para la API y `http://localhost:8080` para la aplicación web), el usuario visualiza la pantalla de bienvenida de RESTORA, en la cual se presentan las capacidades de la solución y los enlaces directos a la aplicación operativa y al monitor de salud de servicios.

#figure(
  image("../imagenes/01_portal_inicio.png", width: 90%),
  caption: [Portal de inicio institucional de RESTORA v1.0.0],
) <fig-portal-inicio>

Desde este portal, el usuario puede pulsar el botón *«Abrir Aplicación Frontend»* para ingresar a la interfaz interactiva alojada en el puerto de servicio web:

#figure(
  image("../imagenes/02_landing_frontend.png", width: 90%),
  caption: [Página de bienvenida interactiva de la aplicación web RESTORA],
) <fig-landing-frontend>

== Inicio de Sesión (FRQ-0001)

Para acceder a las funcionalidades protegidas de la aplicación:

1. Haga clic en el botón *«Iniciar Sesión»* ubicado en la esquina superior derecha o en el botón de acción principal.
2. El sistema presentará el formulario de autenticación ilustrado en la @fig-login.
3. Ingrese su dirección de correo electrónico corporativo registrado (ejemplo: `demo@circularaqp.pe`).
4. Ingrese su contraseña secreta asignada (ejemplo de demostración: `demo1234`).
5. Haga clic en el botón *«Entrar a RESTORA»*.

#figure(
  image("../imagenes/03_login_autenticacion.png", width: 85%),
  caption: [Formulario de inicio de sesión seguro con credenciales de prueba],
) <fig-login>

Si las credenciales son válidas, el sistema emitirá una cookie de sesión cifrada `httpOnly`, impidiendo accesos no autorizados mediante scripts de terceros (Cross-Site Scripting), y redirigirá de inmediato al usuario a su panel de control principal (*Dashboard*).

== Registro de Nuevos Restaurantes (FRQ-0003)

Los establecimientos gastronómicos que utilicen RESTORA por primera vez pueden darse de alta a través de la pestaña *«Registrarse»* del mismo módulo:

1. En la pantalla de autenticación, seleccione la pestaña superior derecha rotulada *«Registrarse»*.
2. Complete los campos requeridos en el formulario (@fig-registro):
   - *Nombre del Restaurante:* Razón comercial del establecimiento (ejemplo: «Picantería Tradición Yanahuara»).
   - *Nombre del Administrador:* Nombre y apellidos del responsable operativo.
   - *Correo Electrónico:* Correo de contacto que actuará como identificador único de usuario.
   - *Contraseña:* Clave de acceso con una longitud mínima de 8 caracteres alfanuméricos.
3. Presione el botón *«Crear Cuenta de Restaurante»*. El sistema inicializará el entorno del restaurante y cargará las categorías estándar de residuos gastronómicos de la región.

#figure(
  image("../imagenes/04_registro_restaurante.png", width: 85%),
  caption: [Formulario de registro para nuevos restaurantes turísticos],
) <fig-registro>

== Cierre de Sesión Seguro (FRQ-0002)

Para finalizar la jornada y proteger la estación de trabajo:

1. Diríjase a la barra lateral de navegación o a la esquina superior del panel.
2. Haga clic sobre la opción *«Cerrar Sesión»*.
3. El sistema invalidará inmediatamente el token de sesión activo tanto en memoria del navegador como en el servidor backend, retornando al usuario al formulario de acceso público.
