# Guía 06 — Gestión de riesgos RESTORA

## Entregables

- `Lab06_Calidad de Software_Ajra_Barrios_Hancco_Valdivia.docx`: informe de la guía, con evidencia visual integrada en el desarrollo y no como anexos.
- `Lab06_Calidad de Software_Ajra_Barrios_Hancco_Valdivia.pdf`: exportación actualizada del informe Word.
- `Matriz_Riesgos_RESTORA_G06.xlsx`: inventario de 15 activos, matriz de 30 escenarios, tratamiento prioritario, comparación de herramientas, ejemplo docente separado y fuentes.

## Tratamientos implementados y probados

- `R01`: el guard `requireSession` permite el restaurante asociado a la sesión y rechaza otro tenant con HTTP 403 o la falta de sesión con HTTP 401. Tres pruebas específicas aprobadas.
- `R15`: el serializador CSV neutraliza prefijos que pueden interpretarse como fórmula y conserva los valores numéricos negativos. Ocho pruebas específicas aprobadas.
- Ejecución focalizada: 11 pruebas aprobadas en `01_APLICACION/src/lib/auth.test.ts` y `01_APLICACION/src/lib/csv.test.ts`.
- Suite completa: 132 pruebas aprobadas en 13 archivos.
- Los detalles están en `EVIDENCIAS/G06_Tratamientos_Verificados_2026-11-22.json` y en los registros `EVIDENCIAS/RUN-G06-01-*.log`.
- El riesgo residual no se recalculó. La suite no verifica todos los endpoints ni abre una descarga CSV en Excel/LibreOffice; los demás tratamientos siguen pendientes.

## Evidencia de herramientas

- `EVIDENCIAS/PIRANI/`: estado actual de Pirani Free, matriz con 12 riesgos ORM-4 a ORM-15, cinco fichas de riesgo, mapa de calor y panel de reportes. Son escenarios potenciales; no se afirman incidentes. La herramienta muestra 11 Medium y 1 High, sin controles asociados.
- `EVIDENCIAS/PILAR/`: seis capturas del proyecto RESTORA-G06, contexto, dominios, identificación y valoración. PILAR muestra cero activos y cero servicios esenciales; no se generó una valoración ni se verificó un archivo `.mgr`.

Los puntajes de Pirani, PILAR y la matriz auxiliar no se presentan como equivalentes. El modelo PILAR necesita que se carguen activos y se complete el análisis para producir resultados propios.

## Organización

- `RESULTADOS/BUILD/`: scripts, logs de construcción y registro técnico de inspección del Excel; la evidencia histórica no debe confundirse con las capturas vigentes.
- `RESULTADOS/QA_*.png`: vistas previas del Excel generadas durante la revisión.
- `HERRAMIENTAS/`: instalador de PILAR Basic utilizado en la sesión.
