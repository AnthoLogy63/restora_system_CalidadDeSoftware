# RESTORA — Guion de sustentación (20 minutos)

Tercer entregable: 02/12/2026. Fuentes: `RESTORA_PRESENTACIÓN_FINAL_PROYECTO.pptx` (13 diapositivas), `Informe_Final_RESTORA` y las guías G01 a G09.

El enunciado reparte los 20 minutos así: problema y alcance (3), demostración de los tres procesos (6), un cambio, una recuperación SVN y una ejecución de pruebas (6), y resultados de calidad con preguntas (5). El docente puede pedir que se **modifique una regla o se repita una prueba**, así que cada integrante debe poder hacer en vivo lo que presenta.

## 1. Reparto

| Integrante | Diapositivas | Minutos | Tema | Prepara en vivo |
|---|---|---|---|---|
| **Ryan Fabián Valdivia Segovia** | 1, 2, 3 y 8 | 0:00–3:00 y 9:00–10:30 | Problema, alcance, flujo y G01 a G03 (cambio CC-01) | Cambio CC-01: dar de baja un producto con historial |
| **Jeans Anthony Ajra Huacso** | 4, 5, 6, 7 y la parte de G06 de la 9 | 3:00–9:00 y 12:00–12:30 | Demostración de los tres procesos, arquitectura y riesgos | Los tres procesos y los dos tratamientos de G06 |
| **Mathias Alonso Barrios Medina** | 9 (G04 y G05) y 13 | 10:30–12:00 y 19:30–20:00 | Dimensionamiento, SVN y cierre | Recuperación SVN y recálculo de G04 |
| **Sergio Danilo Hancco Mullisaca** | 10, 11 y 12 | 12:30–17:00 | Pruebas unitarias, JMeter, Selenium y decisión | Ejecución de la suite y de un perfil de JMeter |

Preguntas del docente: 17:00–20:00, responde quien presentó ese tema.

Repartí los tramos según qué guías subió cada quien al repositorio (Ryan G02 y G03; Mathias G04 y G05; Sergio G07, G08 y G09; Anthony G01 y G06 y la aplicación). Si alguien hizo otro tramo, intercambien los bloques, pero mantengan los tiempos.

## 2. Preparación (antes de empezar)

- **Aplicación en marcha:** API en `http://localhost:3000` y web en `http://localhost:8080`. Comando: en `01_APLICACION`, `npm run dev`; en `01_APLICACION/frontend`, `npm run dev -- --port 8080`. Comprobar `http://localhost:3000/api/health`.
- **Acceso de demostración:** `demo@circularaqp.pe` / `demo1234` (restaurante El Buen Sabor AQP).
- **Base limpia:** si hay datos de pruebas, reiniciar con `npx prisma migrate reset --force` (en `01_APLICACION`) y volver a sembrar. Así las pantallas coinciden con las capturas.
- **Pestañas abiertas:** login, registrar turno, entregas, análisis, predicción, reportes, catálogo, y el informe PDF.
- **Terminal lista** en `01_APLICACION` para `npx vitest run` (unas 2 s).
- **Plan B por si algo falla:** las capturas de `03_ENTREGA_FINAL/Capturas_Web/` y los reportes de `02_GUIAS_CALIDAD/G08_RENDIMIENTO_JMETER/RESULTADOS/` y `G09_CALIDAD_SELENIUM/RESULTADOS/`.
- **Aviso sobre SVN:** `restore_svn.bat` apunta a `..\EVIDENCIAS_SVN\`, una carpeta que no existe (el dump está en `G05_CONFIGURACION_SVN/Evidencias/SVN/restora_g05_svn_repository.svndump.gz`), y `svnadmin` no está instalado en esta máquina. Antes del día: instalar Subversion, probar los pasos manuales de `Respaldo_SVN.md` en una carpeta nueva, y corregir la ruta del script. Si no se logra, mostrar `registro_ejecucion_svn.txt` y decirlo con franqueza.

## 3. Guion por intervención

### Ryan — Problema, alcance y flujo (diapositivas 1 a 3, 0:00–3:00)

**Diap. 1 (0:00–0:20).** «Buenos días. Somos el equipo de RESTORA: Jeans Ajra, Mathias Barrios, Sergio Hancco y yo, Ryan Valdivia. Vamos a mostrar el producto, cómo gestionamos su calidad con las nueve guías y qué resultados obtuvimos, incluidos los límites.»

**Diap. 2 (0:20–1:40).** «Un restaurante pequeño o mediano suele llevar sus ventas, su producción y sus mermas en registros separados. Eso hace difícil saber cuánto se desperdicia y cuánto cuesta. RESTORA centraliza esos registros, calcula la pérdida económica con el costo de cada producto y ofrece indicadores y recomendaciones. Una aclaración desde el inicio: en esta versión hay una sola cuenta por restaurante. Los roles de administrador y personal operativo se pidieron en el cambio CC-02 y lo rechazamos para esta versión por su impacto.»

**Diap. 3 (1:40–3:00).** «El producto tiene tres procesos de negocio. Uno: registrar el turno, con ventas, producción y desperdicios por plato. Dos: gestionar las entregas a recicladores, con peso, receptor y evidencia. Tres: analizar y decidir, con pérdida económica, tendencias, predicción de demanda y reportes. Ahora Anthony los demuestra.»

### Anthony — Demostración de los tres procesos (diapositivas 4 a 7, 3:00–9:00)

**Preparación.** Con la sesión ya iniciada, o iniciar sesión con el botón de demostración.

**Proceso 1 (3:00–5:00), diap. 4.** Ir a «Registrar turno». «Elijo fecha y turno. Registro ventas y producción por plato, y un desperdicio con su categoría, causa y peso. El sistema calcula el costo con el costo del catálogo.» Guardar. Mostrar el aviso de que repetir fecha y turno devuelve un error claro (409), que corregimos en la observación OBS-04. Pasar al historial y mostrar el registro con los filtros por fecha y turno.

**Proceso 2 (5:00–6:30), diap. 4.** Ir a «Entregas». «Registro una entrega a un reciclador: categoría, peso, receptor.» Probar un peso negativo y mostrar que el botón queda deshabilitado, como comprueba el caso CP-05 de Selenium. Guardar una entrega válida y mostrar que aparece en la lista.

**Proceso 3 (6:30–8:30), diap. 5 y 6.** Ir al panel y al análisis: «Aquí se ven la pérdida estimada, el desperdicio por causa y la evolución semanal.» Luego a «Predicción»: «Un modelo RandomForest en Python, entrenado con el historial del restaurante, estima la demanda por plato.» Aclarar: son datos de demostración, no de un cliente real. Mostrar un reporte mensual y su descarga en CSV.

**Arquitectura (8:30–9:00), diap. 7.** «El frontend es TanStack Start en el puerto 8080; la API es Next.js 16 en el 3000; los datos van en SQLite con Prisma 7, y la predicción corre en un subproceso de Python. La sesión usa JWT en una cookie httpOnly y cada ruta valida la sesión y el restaurante.»

**Riesgos (12:00–12:30), parte de la diap. 9.** «En G06 inventariamos 15 activos y 30 escenarios de riesgo. Implementamos y probamos dos tratamientos: R01, que impide acceder a datos de otro restaurante (respuesta 403), y R15, que neutraliza fórmulas en el CSV exportado. Los otros diez siguen pendientes y no recalculamos el riesgo residual.»

### Ryan — Cambio CC-01 (diapositiva 8, 9:00–10:30)

**Diap. 8.** «En G01 especificamos 20 requisitos funcionales y 8 no funcionales. En G02 gestionamos dos cambios. CC-01 reemplaza la eliminación de productos con historial por una inactivación, para no perder el costo de los registros antiguos. Se aprobó, se implementó y se probó. CC-02, los roles, se rechazó con su análisis de impacto. G03 documenta el diseño con IEEE 1016 y diagramas UML.»

**Demostración (en vivo).** Ir a «Catálogo». «Este producto tiene registros: si lo elimino, el sistema no lo borra, lo marca como *Inactivo*.» Eliminarlo, mostrar el aviso y la insignia «Inactivo», y pulsar «Reactivar». Después correr en la terminal `npx vitest run src/lib/catalogo.test.ts`, la prueba que cubre este cambio. «El cambio quedó ligado a una regresión automatizada.»

### Mathias — Dimensionamiento y configuración (diapositiva 9, 10:30–12:00)

**G04 (10:30–11:15).** «Medimos el tamaño funcional con NESMA, 328 puntos sin ajustar, y con COSMIC, 82 CFP. Con COCOMO II estimamos 36,38 personas-mes y 11,51 meses. El costo de 109 140 soles usa una tarifa supuesta de 3 000 por persona-mes, así que es una referencia ilustrativa: no tenemos horas reales para contrastarla.»

**G05 (11:15–12:00).** «Usamos Subversion con ramas, un conflicto resuelto y la etiqueta `Version_1.0.0`, que coincide con los archivos de la aplicación del corte. Son 8 revisiones que hicimos en una demostración local el 19 de noviembre.» **Recuperación:** restaurar el dump en una carpeta nueva con los pasos de `Respaldo_SVN.md` (`svnadmin create`, `svnadmin load`, `svnadmin verify`) y mostrar `svn log`. Si no se pudo preparar `svnadmin`, mostrar `registro_ejecucion_svn.txt` y decir que la restauración en Windows no se certificó.

### Sergio — Pruebas y rendimiento (diapositivas 10 a 12, 12:30–17:00)

**Diap. 10, G07 (12:30–14:00).** «Con Vitest escribimos pruebas unitarias de las reglas de negocio. Hoy hay 132 aprobadas en 13 archivos, y el informe de la guía documenta 114 de una ejecución anterior. La cobertura es de 100 % de líneas y 95,69 % de ramas, pero en cinco archivos de lógica de negocio, no en toda la aplicación.» **En vivo:** `npx vitest run` desde `01_APLICACION` y mostrar 132 aprobadas. Contar el defecto controlado: se cambió la multiplicación del costo por una suma, la prueba falló con 15 en lugar de 36, y se restauró.

**Diap. 11, G08 y G09 (14:00–15:30).** «Con JMeter medimos siete perfiles y 217 543 muestras sin errores: el p95 global estuvo entre 24 y 479 ms, y el de las predicciones llegó a 1 857 ms, dentro del límite de 2 segundos. El cuello de botella es el subproceso de Python. Una caché de 60 segundos bajó la media de la predicción de 1 097 a 25 ms en una corrida de 45 segundos con la misma consulta; con consultas variadas la ganancia sería menor. Nuestros perfiles son más cortos que los del enunciado. Con Selenium automatizamos 8 casos sobre los tres procesos, con reporte; el reporte cubre solo Firefox, las duraciones por caso son una estimación y el caso de rutas protegidas verifica sesión, no roles. Además tenemos 35 pruebas e2e de Playwright del 14 de noviembre.» **En vivo (opcional):** `npm run test:selenium` solo si se probó antes (el script usa una ruta de entorno de macOS y Linux); si no, abrir `RESULTADOS/reporte_ejecucion_selenium.html`.

**Diap. 12, resultados y decisión (15:30–17:00).** «Tenemos 28 requisitos documentados, 11 de los 20 funcionales totalmente implementados, 132 pruebas unitarias, 35 e2e y 8 casos Selenium, y 2 de 12 tratamientos de riesgo. Nuestro dictamen provisional es *no apto* para liberar la versión 1.0.0, por estas razones principales: no hay dos roles, quedan diez tratamientos de riesgo, los perfiles de rendimiento son más cortos que los del enunciado, el número de versión no es coherente entre documentos y el registro de defectos está incompleto. Lo que sí respaldamos con evidencia es el flujo de los tres procesos, las reglas de cálculo y una gestión de cambios que llegó hasta una versión probada.»

### Mathias — Cierre (diapositiva 13, 19:30–20:00)

«Gracias. Nuestro próximo paso es resolver los roles con el docente, tratar los riesgos pendientes, repetir Selenium en más navegadores y unificar la versión. Quedamos atentos a sus preguntas.»

## 4. Preguntas probables y quién responde

| Pregunta | Responde | Respuesta corta |
|---|---|---|
| ¿Por qué no hay dos roles? | Ryan | CC-02 se analizó y se rechazó para v1.0.0 por su impacto en autorización y datos; es una limitación declarada en el informe. |
| ¿Cómo sabemos que la cobertura es de 100 %? | Sergio | Se midió en G07 en cinco archivos; no se repitió hoy porque `@vitest/coverage-v8` no está instalado en este equipo. |
| Modifiquen una regla de negocio. | Anthony o Sergio | Editar `src/lib/costo.ts` o `recomendaciones.ts`, correr `npx vitest run` y mostrar qué prueba falla; restaurar con `git checkout` del archivo. |
| ¿Por qué el dictamen es «no apto» si Selenium aprobó 8 de 8? | Sergio | Selenium cubre solo parte del producto; faltan roles, tratamientos y perfiles completos. |
| ¿Cómo repiten una prueba de rendimiento? | Sergio | `run_profile.sh smoke` o `carga` desde G08 con la aplicación en producción; hay también perfiles académicos con `ACADEMIC=1`. |
| ¿Qué es el cambio CC-01? | Ryan | Inactivación lógica de productos con historial (`activo` en el esquema Prisma). |
| ¿De dónde sale el costo de G04? | Mathias | De COCOMO II con una tarifa supuesta; no hay horas reales. |
| ¿Qué parte es código propio y cuál usa un código base previo? | Anthony | El repositorio menciona CircularAQP; el aporte propio del equipo debe declararse. Respondan con lo que cada uno hizo. |
| ¿Qué parte se hizo con IA? | Todos | Declarar con franqueza qué se generó con asistentes de IA y qué revisaron y entendieron. |

## 5. Antes del ensayo (revisar)

1. Cada uno ensaya su tramo con cronómetro y su demostración en vivo.
2. Anthony y Ryan acuerdan quién maneja el teclado en la demostración.
3. Corregir el dictamen de G09 antes de mostrarlo: tiene cifras que no coinciden con las evidencias.
4. Completar la declaración de uso de IA (anexo B del informe).
5. Decidir con el docente el tema de los roles antes de la sustentación.
