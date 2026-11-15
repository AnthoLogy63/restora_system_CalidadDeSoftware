# G07 RESTORA

## Entregables principales

- Lab07_Calidad de Software_Ajra_Barrios_Hancco_Valdivia.docx: informe con las 114 fichas y capturas de código.
- Catalogo_Pruebas_Unitarias_RESTORA.xlsx: resumen, casos y datos/aserciones.
- EVIDENCIAS/: capturas de ejecución, cobertura, defecto, regresión y CODIGO/ con las 114 imágenes de fragmentos fuente.
- RESULTADOS/: JSON, logs, vistas HTML, cobertura/ y FUENTES_PRUEBAS/.

## Ejecutar

Desde 01_APLICACION ejecutar `npm test -- --coverage`. La configuración mide costo.ts, estadisticas.ts, recomendaciones.ts, validation/registroOperacion.ts y validation/residuo.ts, con umbral 80 % en líneas, sentencias, funciones y ramas. No representa todo el backend. El nuevo reporte se guarda en 01_APLICACION/coverage; la copia de la ejecución documentada está en RESULTADOS/cobertura/index.html.

## Evidencias y procedencia

RESULTADOS/resultados.json contiene las 114 ejecuciones. Las capturas de código se generan a partir de fragmentos verificados contra los archivos de prueba, sin alterar sus entradas ni aserciones. Son vistas de código fuente, no una interfaz de IDE. EVIDENCIAS/CODIGO/manifiesto.json relaciona cada caso con ruta, línea y SHA-256 de su archivo. FUENTES_PRUEBAS conserva copias de los nueve archivos de prueba; la versión ejecutable permanece en 01_APLICACION/src/lib.

Las capturas de ejecución, defecto y regresión son vistas HTML de reportes JSON reales. RESULTADOS/cobertura contiene el HTML original de V8. Las imágenes están incrustadas en el Word y conservadas por separado en EVIDENCIAS.

## Defecto controlado

Guardar una copia exacta de src/lib/costo.ts. Sustituir temporalmente `producto.costoUnitario * cantidadKg` por `producto.costoUnitario + cantidadKg`. Ejecutar `npm test -- src/lib/costo.test.ts`: una aserción debe fallar con 36 esperado y 15 obtenido. Restaurar siempre la copia original y ejecutar `npm test -- --coverage`. El ensayo ya se realizó: RESULTADOS/restauracion.json conserva hashes idénticos; defecto_controlado.json y regresion_restaurada.json conservan fallo y restauración.

## Límites

No se accedió a la base operativa. Las pruebas con dobles no verifican persistencia ni rutas HTTP reales. La aceptación docente de Vitest y una regresión vinculada a un cambio aprobado de G02 permanecen pendientes. No se generó PDF.
