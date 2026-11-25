= Aseguramiento de la Calidad y Verificación (Guías G01 a G09)

El desarrollo del sistema RESTORA se acompañó del ciclo de nueve guías de laboratorio del curso de *Calidad de Software*. Esta sección resume lo que cada guía aportó al producto y su estado al *25 de noviembre de 2026*, con las cifras que constan en los archivos del repositorio. Los detalles y las limitaciones de cada guía están en el informe final integrador (`03_ENTREGA_FINAL/Informe_Final_RESTORA`).

== Resumen de Trazabilidad Integral

#table(
  columns: (1fr, 1.8fr, 2.5fr, 1.5fr),
  table.header([*Guía*], [*Tema y Propósito*], [*Aplicación Directa al Producto RESTORA*], [*Evidencia Principal*]),
  [G01], [Requerimientos], [Especificación en REM 1.2.2 con 20 requisitos funcionales (FRQ-0001 a FRQ-0020) y 8 no funcionales (NFR-0001 a NFR-0008), con criterios de aceptación.], [Informe G01, archivo `.rem` e instrumentos de elicitación.],
  [G02], [Proceso de Requisitos], [Gestor de cambios: CC-01 (inactivación lógica de productos) implementada y probada; CC-02 (roles) rechazada para v1.0.0.], [Gestor_Requisitos_G02.xlsx y evidencias del cambio.],
  [G03], [Análisis y Diseño], [Descripción del diseño (SDD) con IEEE 1016, diagramas UML y tres casos de uso.], [SDD, fuentes PlantUML y mockups.],
  [G04], [Dimensionamiento], [328 puntos de función NESMA sin ajustar, 82 CFP (COSMIC) y COCOMO II con 36,38 persona-mes y 11,51 meses. El costo de S/ 109 140 usa una tarifa supuesta.], [Libros de cálculo y memoria de G04; sin horas reales para contrastar.],
  [G05], [Configuración (SVN)], [Repositorio Subversion con 8 revisiones, un conflicto resuelto y la etiqueta `Version_1.0.0`, que coincide con los archivos de `01_APLICACION` del corte.], [Dump restaurable y registro de revisiones.],
  [G06], [Gestión de Riesgos], [MAGERIT con matriz de 15 activos y 30 escenarios. De 12 tratamientos propuestos, 2 están implementados y probados: R01 (acceso por restaurante) y R15 (neutralización de fórmulas en CSV).], [Matriz G06 y pruebas `auth.test.ts` y `csv.test.ts`.],
  [G07], [Pruebas Unitarias], [Suite Vitest de 132 pruebas aprobadas en 13 archivos; cobertura de 100 % de líneas y 95,69 % de ramas en 5 archivos de lógica de negocio, medida en G07.], [Catálogo de pruebas y reportes de cobertura.],
  [G08], [Rendimiento (JMeter)], [7 perfiles medidos con 217 543 muestras y 0 % de error, más una comparación antes y después de una caché de predicciones.], [Archivos `.jtl` y dashboards de G08.],
  [G09], [Calidad Web (Selenium)], [Suite de 8 casos sobre los 3 procesos, con reporte y registro de defectos.], [Reportes de ejecución y evidencias de G09.]
)

== Requisitos y Gestión de Cambios (G01 y G02)

=== Línea Base de Requisitos
La línea base tiene 28 requisitos (20 funcionales y 8 no funcionales). De los funcionales, 11 están implementados por completo, 8 de forma parcial y 1 no está implementado; los principales son:

- *FRQ-0001 y FRQ-0002 (Sesión):* acceso con credenciales y JWT en cookie httpOnly; cierre de sesión.
- *FRQ-0003 y FRQ-0004 (Cuentas y roles):* se registra una cuenta por restaurante; la asignación de permisos por rol *no está implementada* (CC-02 rechazada).
- *FRQ-0005 (Catálogo):* productos con costo y estado activo o inactivo.
- *FRQ-0006 a FRQ-0013 (Operación):* registro por fecha y turno de ventas, producción y desperdicios, y cálculo de la pérdida en soles con el costo del catálogo.
- *FRQ-0014 a FRQ-0018:* historial con filtros, panel de indicadores y reportes con exportación CSV.
- *Asistente conversacional:* cascada Gemini, Groq y modo guiado determinista cuando no hay claves configuradas.
- *NFR-0006 (Tiempo de respuesta):* p95 de 2 s como meta, contrastada en G08.
- *NFR-0007 (Compatibilidad):* Chrome y Edge; los e2e se ejecutaron en Chromium y Selenium en Firefox.

=== Gestión del Cambio CC-01 (Inactivación Lógica de Productos)
Para evitar la rotura de relaciones en registros antiguos de merma, la solicitud CC-01 introdujo el atributo `activo: Boolean @default(true)` en el esquema Prisma: un producto con historial se inactiva en lugar de eliminarse, y puede reactivarse desde el catálogo. El cambio está cubierto por pruebas unitarias y e2e.

== Dimensionamiento y Estimación Paramétrica (G04)

- *NESMA:* 328 puntos de función sin ajustar sobre la frontera del sistema.
- *COSMIC:* 82 puntos de función COSMIC (CFP), a partir de los movimientos de datos.
- *COCOMO II:* 36,38 persona-mes y 11,51 meses. El costo de S/ 109 140 usa una tarifa supuesta de S/ 3 000 por persona-mes, por lo que es una referencia ilustrativa y no se contrastó con horas reales.

== Gestión de Configuración y Control de Versiones SVN (G05)

La configuración del código se gestionó en un repositorio Subversion de demostración local:
- Estructura `/trunk`, `/branches` y `/tags`.
- 8 revisiones realizadas el 19/11/2026, un conflicto resuelto y la etiqueta `Version_1.0.0`.
- El repositorio se entregó como volcado (dump) restaurable; el desarrollo diario del producto se hizo con Git.

== Gestión de Riesgos de Seguridad con MAGERIT (G06)

La matriz de G06 inventaría 15 activos (base SQLite `dev.db`, secreto `AUTH_SECRET`, API REST, modelos `.joblib`, entre otros) y 30 escenarios, de los cuales 16 son de nivel alto y 14 moderados.

- *Tratamientos implementados y probados (22/11/2026):* *R01*, `requireSession` valida el restaurante de la sesión (3 pruebas); *R15*, `toCsv` neutraliza celdas que empiezan con `=`, `+`, `-` o `@` (8 pruebas).
- *Controles ya presentes en el diseño:* validación de entradas con Zod, cookie httpOnly con SameSite Lax y asistente con modo guiado cuando no hay proveedores de IA.
- *Pendientes:* 10 de los 12 tratamientos, entre ellos el respaldo y la restauración de SQLite, el secreto de ejemplo y la cuenta demo. El riesgo residual no se recalculó y PILAR quedó sin activos cargados.

#figure(
  image("../imagenes/QA_Riesgos.png", width: 88%),
  caption: [Vista de la matriz de riesgos de G06 (hoja de escenarios).]
)

== Pruebas Unitarias y Cobertura con Vitest (G07)

La suite cubre funciones de negocio como `costo.ts`, `estadisticas.ts`, `recomendaciones.ts`, los esquemas Zod, las contraseñas, la exportación CSV y el control de acceso por restaurante.

=== Catálogo y Ejecución de la Suite
El 25/11/2026 la suite dio *132 pruebas aprobadas en 13 archivos*; el informe de G07 documenta 114 de una ejecución anterior. Se ejecuta con:

```bash
npm test
```

La cobertura (100 % de líneas y 95,69 % de ramas en 5 archivos de negocio) proviene de la ejecución documentada en G07; no incluye rutas HTTP, persistencia real ni frontend.

#figure(
  image("../imagenes/cobertura_index.png", width: 92%),
  caption: [Reporte de cobertura de pruebas unitarias con V8 (alcance de 5 archivos de negocio).]
)

=== Ensayo de Inyección de Defecto Controlado
Para verificar que la suite detecta alteraciones en las reglas de negocio, se alteró deliberadamente la fórmula de costeo en `src/lib/costo.ts`:

```ts
// Código original correcto:
const costoTotal = Number((producto.costoUnitario * cantidadKg).toFixed(2));

// Inyección temporal del defecto controlado (suma en vez de producto):
// const costoTotal = Number((producto.costoUnitario + cantidadKg).toFixed(2));
```

Al ejecutar `src/lib/costo.test.ts`, Vitest capturó el fallo de aserción (se obtuvo $15.00$ frente al esperado $36.00$ PEN):

#figure(
  image("../imagenes/defecto.png", width: 88%),
  caption: [Fallo capturado por Vitest tras la inyección del defecto controlado.]
)

Tras restaurar el archivo original, la suite volvió a aprobar todas sus pruebas.

== Pruebas de Rendimiento con Apache JMeter (G08)

Las pruebas se ejecutaron en modo no gráfico con JMeter 5.6.3 sobre el backend Next.js, con perfiles más cortos que los del enunciado. Resultados recalculados de los archivos `.jtl`:

#table(
  columns: (2.6fr, 1fr, 1.3fr, 1fr, 1fr),
  table.header([*Perfil*], [*Muestras*], [*Throughput*], [*p95*], [*Error*]),
  [Humo (1 hilo)], [2 407], [161 req/s], [24 ms], [0 %],
  [Carga (20 hilos web y 2 de predicción, 120 s)], [53 203], [443 req/s], [108 ms], [0 %],
  [Estrés con 10, 30 y 50 hilos (45 s cada uno)], [52 874], [409, 393 y 373 req/s], [63, 184 y 309 ms], [0 %],
  [Picos (60 hilos, 30 s)], [9 069], [303 req/s], [479 ms], [0 %],
  [Estabilidad (10 hilos, 300 s)], [99 990], [333 req/s], [80 ms], [0 %],
)

#figure(
  image("../imagenes/05_dashboard_apdex_carga.png", width: 88%),
  caption: [Dashboard de JMeter del perfil de carga.]
)

- *Cuello de botella:* la predicción de demanda, un subproceso de Python de cerca de 1 s por solicitud (p95 de hasta 1 857 ms en el pico). Aun así, se cumple la meta de p95 de 2 s.
- *Mejora medida:* una caché de 60 s en `prediccion.ts` redujo la media de `POST /predicciones` de 1 097 a 25 ms en una corrida de 45 s con la misma consulta repetida (antes y después en `antes.jtl` y `despues.jtl`). La ganancia con consultas variadas sería menor.
- *Límites:* la estabilidad duró 5 minutos y no los 15 del enunciado, por lo que no se puede descartar una fuga de memoria a más largo plazo. El script `run_all.sh` con `ACADEMIC=1` permite los perfiles largos, pero no hay resultados de esa ejecución.

#figure(
  image("../imagenes/09_estres_escalonado.png", width: 88%),
  caption: [Dashboard de JMeter del perfil de estrés escalonado.]
)

== Pruebas Automatizadas de Aceptación con Selenium WebDriver (G09)

La suite `test_casos_negocio.py` de G09 automatiza 8 casos con Selenium 4 y esperas explícitas sobre la aplicación, y cubre los tres procesos de negocio:

#table(
  columns: (0.7fr, 2fr, 3fr),
  table.header([*Caso*], [*Escenario*], [*Qué comprueba*]),
  [CP-01], [Acceso correcto], [La URL deja `/auth` y aparece el restaurante.],
  [CP-02], [Credenciales inválidas], [Alerta visible y permanencia en `/auth`.],
  [CP-03], [Rutas privadas sin sesión], [Redirección a `/auth` (no hay autorización por rol).],
  [CP-04], [Registro válido de entrega], [La entrega aparece en la vista tras guardar.],
  [CP-05], [Datos inválidos], [El botón Guardar queda deshabilitado con peso negativo o sin receptor.],
  [CP-06], [Consulta], [Productos y colaboradores visibles.],
  [CP-07], [Cambio de estado], [El estado de capacitación cambia al accionar el control.],
  [CP-08], [Cierre de sesión], [Vuelve a `/auth` y el botón atrás no reabre la vista.]
)

#grid(
  columns: (1fr, 1fr),
  gutter: 1em,
  figure(
    image("../imagenes/cp01_acceso_correcto_ok.png", width: 100%),
    caption: [CP-01, acceso correcto.]
  ),
  figure(
    image("../imagenes/cp05_datos_invalidos_rechazo_ok.png", width: 100%),
    caption: [CP-05, validación de datos inválidos.]
  )
)

El reporte del 22/11/2026 registra 8 de 8 casos aprobados en Firefox. La duración por caso es una estimación (tiempo total entre 8) y el reporte no cubre otros navegadores.

=== Estado de la Decisión de Liberación
El informe final integrador emite un dictamen *provisional de «no apto» para liberar la versión 1.0.0*, por estas razones: el producto tiene una sola cuenta por restaurante (CC-02 rechazada) y el enunciado exige dos roles; quedan 10 tratamientos de riesgo pendientes; los perfiles de rendimiento fueron más cortos que los pedidos; y el número de versión no es coherente entre documentos. El equipo también redactó un dictamen en `G09_CALIDAD_SELENIUM/DICTAMEN_LIBERACION.md` que concluye «apto con observaciones menores»; varias de las cifras que cita no coinciden con las evidencias y deben corregirse antes de usarlo.

> *Mejoras recomendadas:* exportación nativa de reportes a PDF, integración con balanzas electrónicas mediante Web Serial API y una cola de tareas para el reentrenamiento del modelo.
