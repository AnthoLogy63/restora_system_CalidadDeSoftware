= Monitoreo, Alertas y Análisis Predictivo

Esta sección describe el *Proceso de Negocio 2* de RESTORA: la anticipación inteligente a la generación de mermas mediante modelos de predicción y la toma de decisiones basada en analítica avanzada de datos, dando cumplimiento a los requerimientos *FRQ-0017* (Comparar periodos), *FRQ-0019* (Señalar desperdicios elevados) y *FRQ-0020* (Presentar recomendaciones básicas).

== Módulo de Predicción de Merma y Demanda (FRQ-0020)

El módulo predictivo (@fig-predict) utiliza un modelo de regresión entrenado sobre datos históricos de consumo gastronómico de Arequipa, proyectando el volumen probable de desperdicios antes de iniciar el turno de cocina.

#figure(
  image("../imagenes/09_analisis_predictivo.png", width: 95%),
  caption: [Módulo de análisis predictivo con proyección de mermas y recomendaciones],
) <fig-predict>

=== Parámetros de Simulación Operativa
Para generar una proyección para la jornada siguiente:
1. Ingrese a la opción *«Predicción»* del menú lateral.
2. Seleccione las condiciones proyectadas de la jornada:
   - *Día de la Semana:* Indica los patrones estacionales de consumo (por ejemplo, el domingo registra mayor afluencia en picanterías y comida típica).
   - *Condición Climática:* Clima proyectado en Arequipa (Soleado, Nublado o Lluvia estacional). En días lluviosos la afluencia suele disminuir repentinamente, elevando el riesgo de preparación excesiva.
   - *Número Estimado de Comensales / Reservas:* Cantidad prevista de clientes a atender en el turno.
3. Haga clic en el botón *«Calcular Proyección»*.

=== Interpretación de Resultados y Recomendaciones Preventivas
El sistema desplegará de inmediato:
- *Residuo Estimado (kg):* Masa prevista de mermas para el turno en cuestión.
- *Rango de Tolerancia:* Límites mínimo y máximo proyectados con un 95 % de nivel de confianza estadística.
- *Recomendaciones Preventivas Inteligentes (*FRQ-0020*):* Acciones concretas dirigidas al chef de partida:
  - «Reducir la mise en place de tubérculos en un 12 % respecto a la jornada anterior».
  - «Preparar caldos y salsas base en dos lotes fraccionados para evitar sobrantes al cierre del turno».
  - «Priorizar la rotación de carnes y quesos almacenados antes de abrir nuevos empaques al vacío».

== Analítica Avanzada y Diagnóstico de Causas (FRQ-0017)

Para una comprensión profunda de las fuentes de ineficiencia, el usuario puede acceder a la sección *«Analítica»* (@fig-analitica).

#figure(
  image("../imagenes/10_analitica_avanzada.png", width: 95%),
  caption: [Tablero de analítica avanzada con desglose de causas y análisis comparativo],
) <fig-analitica>

En esta vista se presentan los siguientes análisis gráficos:
- *Diagrama de Pareto de Causas:* Identifica cuál es la causa que genera el 80 % del volumen y costo de las mermas. Típicamente revela si el problema radica en errores de cocción (requiriendo capacitación del personal) o en sobreproducción (requiriendo ajustes en las comandas).
- *Comparativa de Desempeño Inter-períodos (*FRQ-0017*):* Gráficos superpuestos que comparan la semana actual con las tres semanas previas, evidenciando si las políticas de ahorro y buenas prácticas adoptadas están reduciendo progresivamente la curva de residuos.
- *Índice de Eficiencia en Plato (%):* Relación matemática entre las porciones consumidas y la materia prima empleada, ofreciendo una métrica objetiva de rendimiento para el equipo directivo.
