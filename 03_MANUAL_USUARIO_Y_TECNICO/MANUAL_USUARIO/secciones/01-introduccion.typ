= Introducción General

El presente *Manual de Usuario* ha sido elaborado para guiar a los operadores, jefes de cocina y administradores gastronómicos en la operación integral de *RESTORA* (versión 1.0), un sistema de información web concebido para optimizar la gestión operativa, cuantificar los desperdicios alimentarios y promover la economía circular en el sector de restaurantes turísticos de la ciudad de Arequipa @fao2013.

En el marco del Trabajo Final Integrador de la asignatura *Calidad de Software* de la Universidad Nacional de San Agustín (UNSA), RESTORA implementa y verifica los principios de calidad establecidos a lo largo de las nueve guías de laboratorio, asegurando trazabilidad desde la especificación de requerimientos según IEEE 830 @ieee830 hasta las pruebas automatizadas con Selenium y pruebas de carga con JMeter.

== Propósito y Objetivos del Manual

El propósito fundamental de este manual es suministrar instrucciones paso a paso, claras, ilustradas y verificables para la ejecución de las funciones del sistema. Sus objetivos específicos comprenden:

- Proporcionar una guía didáctica para el acceso, autenticación y configuración inicial de los establecimientos gastronómicos.
- Describir de manera metódica los tres procesos de negocio fundamentales: el registro diario de operaciones de cocina y mermas, el monitoreo y análisis predictivo de desperdicios, y la consolidación de reportes junto con la valorización de residuos en esquemas de economía circular.
- Facilitar la comprensión e interpretación de los indicadores clave de desempeño (KPIs), métricas económicas y recomendaciones inteligentes emitidas por la plataforma.
- Establecer procedimientos de contingencia y resolución de incidencias operativas comunes, garantizando la consistencia e integridad de los datos almacenados @iso25010.

== Perfiles de Usuario y Matriz de Roles

RESTORA incorpora un esquema de autorización y control de acceso basado en roles (RBAC), el cual diferencia las responsabilidades operativas de las administrativas para salvaguardar la confidencialidad e integridad de la información sensible:

#table(
  columns: (1.5fr, 2fr, 2.5fr),
  inset: 7pt,
  align: (left, left, left),
  table.header(
    [*Rol del Sistema*], [*Perfil de Usuario*], [*Alcance de Permisos y Funcionalidades*],
  ),
  [Administrador / Gerente],
  [Propietario, administrador de operaciones o supervisor general del restaurante.],
  [Acceso completo al sistema: configuración del establecimiento, fijación de línea base semanal, gestión de cuentas y colaboradores, edición del catálogo de alimentos, visualización de costos económicos, generación de reportes consolidados y predicción de mermas.],
  
  [Jefe de Cocina / Personal Operativo],
  [Chef de partida, maestro de cocina o responsable de estación de pesaje.],
  [Registro de jornadas diarias de producción (porciones preparadas y vendidas), pesaje y clasificación de residuos orgánicos/inorgánicos, consulta del historial diario de operaciones y registro de entregas para valorización.],
)

== Requisitos del Entorno de Ejecución

Para una experiencia óptima y sin fricciones durante el uso de RESTORA, el equipo cliente debe satisfacer los siguientes requerimientos mínimos @nielsen1994:

- *Navegador Web:* Google Chrome 120+, Mozilla Firefox 120+, Brave 1.60+ o Microsoft Edge 120+ con soporte habilitado para JavaScript (ES2022) y almacenamiento local (Cookies/SessionStorage).
- *Resolución de Pantalla:* Resolución recomendada de 1440 #math.times 900 píxeles o superior para computadoras de escritorio y estaciones táctiles de cocina; diseño adaptable (responsive) optimizado para pantallas desde 1024 #math.times 768 píxeles.
- *Conectividad:* Conexión a red de área local (LAN) o Internet con latencia inferior a 150 ms hacia el servidor de aplicaciones para garantizar tiempos de respuesta acordes a los umbrales de calidad establecidos ($p 95 < 2.0$ segundos).

== Arquitectura Funcional y Mapa de Navegación

La plataforma se organiza en torno a tres módulos funcionales interconectados:

1. *Módulo Operativo de Cocina:* Abarca el catálogo de platos, el registro diario de producción y ventas, y la cuantificación clasificada de residuos y mermas.
2. *Módulo de Inteligencia y Analítica:* Integra el tablero de control (Dashboard), el módulo de predicción basada en aprendizaje automático y el análisis gráfico de tendencias y causas.
3. *Módulo Administrativo y de Sostenibilidad:* Agrupa la emisión de reportes ejecutivos en CSV, la gestión de entregas a gestores ambientales de economía circular y la administración de perfiles y colaboradores.
