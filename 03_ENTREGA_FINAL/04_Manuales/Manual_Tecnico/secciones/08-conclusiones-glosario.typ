= Conclusiones Técnicas y Glosario

== Conclusiones Técnicas

+ *Alineación Metodológica y Rigor de Calidad:* La integración sistemática de las nueve guías de laboratorio permitió gobernar el desarrollo de RESTORA con un estándar industrial verificable. La trazabilidad bidireccional entre la especificación de requisitos (G01), el control formal de cambios (G02), el diseño arquitectónico (G03), las métricas paramétricas (G04), el versionado en SVN (G05), la gestión de riesgos MAGERIT (G06), las pruebas unitarias con cobertura $> 80$ % (G07), el análisis de rendimiento bajo carga con JMeter (G08) y la aceptación automatizada con Selenium (G09) garantiza un producto estable y auditable.
+ *Robustez Arquitectónica y Desacoplamiento:* La decisión de adoptar un frontend reactivo con TanStack Start y un backend API en Next.js 16 con Prisma ORM y SQLite proporcionó un equilibrio óptimo entre alto rendimiento, facilidad de despliegue local y portabilidad absoluta, eliminando la fricción de instalar gestores de bases de datos pesados.
+ *Resiliencia en Inteligencia Artificial:* El diseño del asistente conversacional con una cascada de tolerancia a fallos (*Gemini* $arrow$ *Groq* $arrow$ *Motor Determinista*) demostró ser una solución eficaz para entornos críticos de producción, garantizando que el usuario nunca quede desasistido ante problemas de red o agotamiento de cuotas de APIs externas.
+ *Control Riguroso de Integridad:* La implementación del cambio de ingeniería CC-01 evidenció la importancia de priorizar las bajas lógicas sobre el borrado físico en sistemas orientados a la auditoría y sostenibilidad, preservando el cálculo exacto de costos y mermas en periodos históricos cerrados.

== Glosario de Términos Técnicos y Acrónimos

#table(
  columns: (1.2fr, 3fr),
  table.header([*Término / Acrónimo*], [*Definición Técnica en el Contexto de RESTORA*]),
  [*ACID*], [Propiedades de Atomicidad, Consistencia, Aislamiento y Durabilidad que garantizan transacciones seguras en SQLite.],
  [*Apdex*], [Índice de Rendimiento de Aplicaciones (*Application Performance Index*) que cuantifica la satisfacción del usuario ante tiempos de respuesta.],
  [*CUID*], [Identificador único universalmente resistente a colisiones optimizado para sistemas distribuidos y bases de datos relacionales.],
  [*DDL*], [Lenguaje de Definición de Datos (*Data Definition Language*) para crear y modificar tablas relacionales mediante migraciones Prisma.],
  [*E2E*], [Pruebas de Extremo a Extremo (*End-to-End*) que evalúan la interacción completa del sistema desde la interfaz web hasta la base de datos.],
  [*IPC*], [Comunicación Interproceso (*Inter-Process Communication*) mediante tuberías estándar (`stdin`/`stdout`) entre Node.js y el subproceso Python.],
  [*JWT*], [JSON Web Token; estándar abierto (RFC 7519) para la transmisión segura de información firmada criptográficamente en cookies de sesión.],
  [*MAGERIT*], [Metodología de Análisis y Gestión de Riesgos de los Sistemas de Información promovida por el Centro Criptológico Nacional (CCN).],
  [*ORM*], [Mapeo Objeto-Relacional (*Object-Relational Mapping*); capa de abstracción provista por Prisma para interactuar con la base de datos mediante objetos TypeScript.],
  [*p95*], [Percentil 95: umbral de tiempo de respuesta bajo el cual se resuelve el 95 % de las peticiones evaluadas en JMeter.],
  [*REST*], [Transferencia de Estado Representacional; estilo arquitectónico para servicios web que emplea verbos y códigos HTTP estándar.],
  [*RMSE*], [Raíz del Error Cuadrático Medio (*Root Mean Square Error*); métrica de precisión utilizada para validar el modelo de Machine Learning en Python.],
  [*SVN*], [Apache Subversion; sistema centralizado de control de versiones utilizado para el gobierno de código, ramas y etiquetas.],
  [*WAL*], [Modo *Write-Ahead Logging* de SQLite que permite lecturas concurrentes simultáneas mientras se ejecutan operaciones de escritura en disco.],
  [*Zod*], [Biblioteca de declaración y validación de esquemas tipados en tiempo de ejecución para TypeScript y Node.js.]
)
