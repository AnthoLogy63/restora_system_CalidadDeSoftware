= Aseguramiento de la Calidad y Verificación (Guías G01 a G09)

El desarrollo del sistema RESTORA se rigió por el ciclo metodológico integral de nueve guías de laboratorio del curso de *Calidad de Software*, articulando la trazabilidad desde los requisitos iniciales hasta la entrega formal con dictamen de liberación.

== Resumen de Trazabilidad Integral

#table(
  columns: (1fr, 1.8fr, 2.5fr, 1.5fr),
  table.header([*Guía*], [*Tema y Propósito*], [*Aplicación Directa al Producto RESTORA*], [*Evidencia Principal*]),
  [G01], [Requerimientos], [Especificación ERS según IEEE 830: 10 RF y 5 RNF con criterios de aceptación medibles.], [Documento ERS versionado, matrices de trazabilidad e instrumentos de elicitación.],
  [G02], [Proceso de Requisitos], [Control de flujo en gestor REM; análisis e implementación del cambio CC-01 (baja lógica de productos).], [Fichas de cambio, historial de transiciones y evidencia de código migrado.],
  [G03], [Análisis y Diseño], [Descripción del diseño de software (SDD) bajo IEEE 1016; diagramas UML de clases, secuencia y casos de uso.], [SDD formal, archivos fuente PlantUML y galería de mockups responsivos.],
  [G04], [Dimensionamiento], [Medición funcional mediante NESMA y COSMIC; estimación de esfuerzo, plazo y costos en PEN con COCOMO II.], [Libro editable con fórmulas paramétricas y análisis de sensibilidad $plus.minus 20$ %.],
  [G05], [Configuración (SVN)], [Control de versiones en Apache Subversion: ramas, resolución de conflictos y generación del tag `v1.0.0`.], [Historial de 8 revisiones, log de fusión controlada y repositorio portable SVN.],
  [G06], [Gestión de Riesgos], [Aplicación de metodología MAGERIT v3 con PILAR; tratamiento de amenazas y controles técnicos implantados.], [Proyecto PILAR, matriz de riesgos activa y evidencia de salvaguardas (JWT/Zod).],
  [G07], [Pruebas Unitarias], [Diseño y ejecución de suite automatizada con Vitest; cobertura $> 80$ % e inyección de defecto controlado.], [114 casos de prueba, reporte V8 coverage y prueba de regresión fallida/corregida.],
  [G08], [Rendimiento (JMeter)], [Evaluación no gráfica de 4 perfiles de carga (nominal, estrés 10-25-50, picos, estabilidad de 15 min).], [Scripts JMX, bitácoras JTL, dashboards HTML y análisis de Apdex / $p_{95}$.],
  [G09], [Calidad Web (Selenium)], [Automatización E2E con Selenium WebDriver 4 cubriendo los 3 procesos de negocio; dictamen de liberación.], [Suite de 10 scripts Python, esperas explícitas, cross-browser y dictamen final.]
)

== Requisitos y Gestión de Cambios (G01 y G02)

=== Línea Base de Requisitos Funcionales y No Funcionales
- *RF-01 (Autenticación y Sesión):* Acceso mediante credenciales seguras y emisión de JWT en cookie httpOnly.
- *RF-02 (Aislamiento Multi-Tenant):* Restricción estricta de acceso a datos según el `restauranteId` del usuario.
- *RF-03 (Registro Multi-Ítem de Operación):* Captura atómica de ventas, producción y residuos por fecha y turno.
- *RF-04 (Cálculo Automatizado de Pérdidas):* Conversión inmediata de masa descartada (kg) a soles (PEN) usando el catálogo.
- *RF-05 (Gestión de Catálogo de Productos):* Registro de productos con precio unitario y control de estado activo/inactivo.
- *RF-06 (Trazabilidad de Entregas Valorizables):* Registro de salidas a reciclaje con evidencia fotográfica y número de constancia.
- *RF-07 (Motor de Reglas Expertas R1-R10):* Generación de alertas operativas ante mermas anómalas o falta de capacitación.
- *RF-08 (Dashboard de Indicadores):* Visualización consolidada de KPIs de sostenibilidad y prevención de desperdicios.
- *RF-09 (Asistente Conversacional Resiliente):* Chat con IA en cascada Gemini -> Groq -> Motor Determinista.
- *RF-10 (Reportes y Exportación CSV):* Generación de instantáneas inmutables de periodos operativos con descarga en CSV.
- *RNF-01 (Tiempo de Respuesta):* Latencia $p_{95} <= 2.0$ segundos bajo carga esperada.
- *RNF-02 (Seguridad Criptográfica):* Almacenamiento de contraseñas mediante funciones unidireccionales con salt.
- *RNF-03 (Disponibilidad y Resiliencia):* Operación continua del asistente guiado aun sin conexión a proveedores de IA.
- *RNF-04 (Cobertura de Código de Negocio):* Mínimo 80 % de cobertura de líneas en el paquete de lógica de negocio.
- *RNF-05 (Compatibilidad Multi-Navegador):* Ejecución sin discrepancias visuales ni funcionales en Chrome, Firefox y Brave.

=== Gestión del Cambio CC-01 (Inactivación Lógica de Productos)
Para evitar la rotura de relaciones foráneas en registros antiguos de merma, la solicitud CC-01 introdujo el atributo `activo: Boolean @default(true)` en el esquema Prisma, sustituyendo los comandos SQL destructivos por actualizaciones lógicas seguras.

== Dimensionamiento y Estimación Paramétrica (G04)

Se aplicaron mediciones funcionales sobre la frontera del sistema RESTORA:
- *NESMA:* Conteo detallado arrojando 184 Puntos de Función No Ajustados (PFNA) y 166 Puntos de Función Ajustados (PFA) tras considerar factores de influencia de comunicaciones y procesamiento distribuido.
- *COSMIC:* Medición de 92 Puntos de Función COSMIC (CFP) basada en movimientos elementales de Entrada (E), Salida (X), Lectura (R) y Escritura (W).
- *COCOMO II:* Esfuerzo estimado en $17.5$ personas-mes para la variante orgánica calibrada. Se proyectó un plazo de $4.8$ meses para un equipo de 3 desarrolladores, con una inversión estimada de S/ 42,000 PEN considerando tarifas de desarrollo regional y costos de coordinación.

== Gestión de Configuración y Control de Versiones SVN (G05)

La configuración del código se gobernó mediante un repositorio Subversion (*Apache SVN*):
- Estructura canónica: `/trunk` (línea principal de desarrollo), `/branches` (ramas de aislamiento para cambios) y `/tags` (etiquetas congeladas de versiones).
- Se documentaron 8 revisiones formales, destacando la creación de la rama `branches/cambio-cc01-inactivacion`, la simulación y resolución controlada de conflictos en el archivo de rutas `route.ts`, y el etiquetado de la versión final de entrega bajo `tags/v1.0.0`.

== Gestión de Riesgos de Seguridad con MAGERIT / PILAR (G06)

Se aplicó la metodología MAGERIT v3 mediante la herramienta PILAR y matrices de análisis cuantitativo:
- *Activos Clave:* Base de datos SQLite (`dev.db`), Secretos de sesión (`AUTH_SECRET`), API REST del backend, Modelos de ML (`.joblib`) y Archivos de constancia de entrega.
- *Amenazas Evaluadas:* Inyección de datos maliciosos, interceptación o suplantación de sesión JWT, corrupción de base de datos local por cortes de energía, agotamiento de cuota de APIs externas y manipulación de parámetros de URL.
- *Tratamiento:* Se implantaron salvaguardas efectivas: validación estricta de tipos con Zod, cookies httpOnly SameSite Lax, fallback determinista en el chat IA y respaldos programados de `dev.db`.

#figure(
  image("../imagenes/QA_Riesgos.png", width: 88%),
  caption: [Matriz de Evaluación de Riesgos y controles aplicados en RESTORA.]
)

== Pruebas Unitarias y Cobertura con Vitest (G07)

Se implementó una suite automatizada de pruebas unitarias sobre los tres módulos centrales de negocio (`costo.ts`, `estadisticas.ts`, `recomendaciones.ts`) y los esquemas de validación Zod (`registroOperacion.ts` y `residuo.ts`):

=== Catálogo y Ejecución de la Suite
La suite consta de *114 casos de prueba automatizados*, cubriendo escenarios válidos, casos límite, datos inválidos y propagación de excepciones. Se ejecuta mediante el comando:

```bash
npm test -- --coverage
```

#figure(
  image("../imagenes/cobertura_index.png", width: 92%),
  caption: [Reporte de Cobertura de Pruebas Unitarias con V8: Cobertura $> 80$ % en la lógica de negocio.]
)

=== Ensayo de Inyección de Defecto Controlado
Para verificar que el framework de pruebas detecta alteraciones en las reglas de negocio, se alteró deliberadamente la fórmula de costeo en `src/lib/costo.ts`:

```ts
// Código original correcto:
const costoTotal = Number((producto.costoUnitario * cantidadKg).toFixed(2));

// Inyección temporal del defecto controlado (suma en vez de producto):
// const costoTotal = Number((producto.costoUnitario + cantidadKg).toFixed(2));
```

Al ejecutar la prueba `src/lib/costo.test.ts`, Vitest capturó inmediatamente el fallo de aserción (obtenido $15.00$ frente al esperado $36.00$ PEN):

#figure(
  image("../imagenes/defecto.png", width: 88%),
  caption: [Evidencia de fallo capturado por Vitest tras la inyección del defecto controlado.]
)

Tras restaurar el archivo original a su estado íntegro, la suite recuperó su tasa de aprobación del 100 %.

== Pruebas de Rendimiento con Apache JMeter (G08)

Las pruebas de rendimiento evaluaron el comportamiento del backend Next.js bajo cuatro perfiles de carga no gráfica:

#figure(
  image("../imagenes/05_dashboard_apdex_carga.png", width: 88%),
  caption: [Dashboard de JMeter: Índice de satisfacción Apdex (1.000) bajo carga nominal.]
)

+ *Carga Nominal (10 usuarios concurrentes durante 5 minutos):* El sistema exhibió una tasa de error de $0.00$ % y un tiempo de respuesta percentil $p_{95} = 42$ ms, superando holgadamente el umbral de 2 segundos.
+ *Estrés Escalonado (10, 25 y 50 usuarios, 3 minutos por escalón):* Evaluó la capacidad de absorción ante incrementos sostenidos de concurrencia:

#figure(
  image("../imagenes/09_estres_escalonado.png", width: 88%),
  caption: [Curva de respuesta bajo prueba de estrés escalonado de 10 a 50 usuarios.]
)

+ *Pico de Demanda (salto súbito de 10 a 50 usuarios):* El servidor mantuvo la estabilidad sin reinicios ni pérdidas de paquetes HTTP.
+ *Estabilidad o Soak Test (10 usuarios sostenidos por 15 minutos):* Monitoreo continuo de memoria RAM y CPU descartando fugas de memoria (*memory leaks*) en el proceso Node.js.

== Pruebas Automatizadas de Aceptación con Selenium WebDriver (G09)

Se implementó una batería de 10 ejercicios funcionales end-to-end (E2E) con Selenium WebDriver 4 en Python, evaluando la navegación, autenticación, selects dinámicos, switches de estado y esperas explícitas:

#grid(
  columns: (1fr, 1fr),
  gutter: 1em,
  figure(
    image("../imagenes/08_ej9_explicit_wait_restora.png", width: 100%),
    caption: [Prueba E2E con Espera Explícita (WebDriverWait) sobre elementos reactivos.]
  ),
  figure(
    image("../imagenes/10_ej27_crossbrowser_firefox.png", width: 100%),
    caption: [Prueba Cross-Browser ejecutada exitosamente sobre Mozilla Firefox.]
  )
)

=== Dictamen de Calidad y Decisión de Liberación
Integrando los resultados de requisitos verificados (100 %), cobertura unitaria (85.7 %), índice Apdex de rendimiento ($1.000$) y suites Selenium (100 % aprobadas), el Comité de Calidad emite el siguiente dictamen técnico:

> *DICTAMEN FINAL:* #text(weight: "bold")[APTO CON OBSERVACIONES MENORES]
> *Observación:* Se recomienda incorporar en el siguiente ciclo la exportación nativa de reportes a PDF y la vinculación directa con balanzas electrónicas mediante Web Serial API.
