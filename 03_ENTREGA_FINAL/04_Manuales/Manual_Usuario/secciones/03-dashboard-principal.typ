= Panel de Control Principal (Dashboard)

El *Dashboard* constituye el centro neurálgico de visualización y monitoreo operativo de RESTORA, implementando los requerimientos funcionales *FRQ-0016* (Visualizar indicadores operativos) y *FRQ-0019* (Señalar desperdicios elevados). Su propósito es suministrar al administrador y al jefe de cocina una panorámica en tiempo real del desempeño ambiental y económico del restaurante.

#figure(
  image("../imagenes/05_dashboard_principal.png", width: 95%),
  caption: [Panel de control principal de RESTORA con indicadores operativos y gráficos],
) <fig-dashboard>

== Indicadores Clave de Desempeño (KPIs)

En la sección superior del tablero (@fig-dashboard) se despliegan cuatro tarjetas métricas sintetizadas:

1. *Total de Residuos Generados (kg):* Cuantifica la masa total de desperdicios orgánicos e inorgánicos registrados durante el ciclo operativo actual (semana o mes en curso). Permite evaluar rápidamente si el volumen se encuentra dentro de los márgenes tolerables.
2. *Pérdida Económica Estimada (S/.):* Valor monetario acumulado que representan los alimentos e insumos desechados, calculado automáticamente a partir del costo unitario asignado en el catálogo. Este indicador evidencia el impacto financiero directo de las ineficiencias de cocina.
3. *Meta de Economía Circular / Reducción (%):* Porcentaje de desviación respecto a la línea base semanal establecida para el restaurante. Los valores en verde reflejan cumplimiento o reducción favorable, mientras que los valores en rojo alertan sobre excesos respecto al límite planificado.
4. *Alertas Críticas y Desperdicios Anómalos:* Notificaciones automáticas disparadas cuando una preparación supera el 15 % de merma sobre su producción total o cuando se detecta una tendencia sostenida de caducidad de insumos.

== Gráficos de Tendencia y Distribución

El cuerpo central del Dashboard presenta herramientas analíticas interactivas:

- *Evolución Temporal de Residuos:* Gráfico cronológico de barras y líneas que ilustra la cantidad de kilogramos desechados por día o turno (Almuerzo y Cena). Facilita identificar los días de mayor impacto (como fines de semana y feriados turísticos en Arequipa).
- *Distribución por Categoría de Alimento:* Gráfico circular o de barras compuestas que desglosa los desperdicios según su naturaleza (carnes y pescados, tubérculos y guarniciones, verduras y hortalizas, salsas y caldos). Permite priorizar acciones correctivas en las partidas más costosas.

== Accesos Rápidos Operativos

Desde la barra superior y lateral del panel, el usuario dispone de accesos directos hacia las acciones críticas:
- *Registrar Operación Diaria:* Botón directo para asentar la producción y mermas de la jornada actual.
- *Ver Predicción:* Enlace inmediato para consultar las recomendaciones preventivas del modelo de Machine Learning antes de ordenar las compras de insumos.
- *Historial Completo:* Acceso al listado auditable de todos los pesajes efectuados.
