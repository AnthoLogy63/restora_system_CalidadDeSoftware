= Reportes Consolidados y Valorización en Economía Circular

Esta sección aborda el *Proceso de Negocio 3* de RESTORA: la emisión de reportes ejecutivos para auditoría y la gestión de entregas de mermas a cadenas de valorización ambiental (compostaje y biocombustibles), satisfaciendo los requerimientos *FRQ-0018* (Generar reportes resumidos) y *FRQ-0010* en su vertiente de trazabilidad ambiental.

== Generación y Exportación de Reportes Ejecutivos (FRQ-0018)

El módulo de reportes (@fig-reportes) consolida la información transaccional acumulada en un formato sintético, orientado a la rendición de cuentas gerencial, auditorías de calidad y certificaciones gastronómicas sostenibles.

#figure(
  image("../imagenes/11_reportes_consolidados.png", width: 95%),
  caption: [Módulo de generación y exportación de reportes ejecutivos consolidados],
) <fig-reportes>

=== Procedimiento para la Emisión de Reportes
1. Diríjase a la opción *«Reportes»* en el menú lateral.
2. Defina los criterios de consolidación:
   - *Periodo de Análisis:* Seleccione entre la semana en curso, el mes anterior o un intervalo personalizado de fechas.
   - *Desglose Deseado:* Elija si desea agrupar la información por plato, por causa de residuo o por turno de trabajo.
3. El sistema calculará en pantalla el resumen consolidado:
   - Kilogramos totales producidos vs. kilogramos totales desechados.
   - Sumatoria monetaria de pérdidas económicas incurridas (S/.).
   - Ratio de eficiencia global del restaurante durante el periodo.
4. Para exportar la información a herramientas externas de contabilidad u hojas de cálculo (Microsoft Excel o LibreOffice Calc):
   - Haga clic sobre el botón *«Descargar CSV»*.
   - El navegador descargará un archivo estructurado delimitado por comas (`reporte_residuos_restora.csv`) con codificación UTF-8, garantizando que tildes y caracteres especiales de platos locales no se corrompan.

== Entregas y Valorización de Residuos en Economía Circular

RESTORA promueve activamente el cierre de ciclo de los residuos orgánicos e inorgánicos generados en el restaurante. A través del módulo de *«Entregas»* (@fig-entregas), el establecimiento documenta formalmente la transferencia de subproductos hacia empresas y asociaciones de valorización debidamente autorizadas en la región Arequipa.

#figure(
  image("../imagenes/12_entregas_valorizacion.png", width: 95%),
  caption: [Módulo de registro y trazabilidad de entregas a valorización ambiental],
) <fig-entregas>

=== Destinos de Valorización Habilitados
- *Compostaje Agrícola:* Restos orgánicos vegetales, cáscaras y residuos de preparación entregados a agricultores locales de la campiña arequipeña o plantas de compostaje municipal.
- *Reciclaje de Aceite Vegetal Usado:* Grasas y aceites de freidora transferidos a operadores de biocombustibles certificados para su transformación en biodiésel.
- *Alimentación Animal:* Subproductos seguros y controlados destinados a granjas avícolas o porcinas registradas.
- *Reciclaje Inorgánico:* Envases de hojalata, botellas de vidrio y plásticos clasificados y entregados a asociaciones de recicladores formalizados.

=== Procedimiento para Registrar una Entrega
1. Acceda a la sección *«Entregas»*.
2. Pulse el botón *«+ Nueva Entrega»*.
3. Complete los datos de la constancia de entrega:
   - *Fecha:* Fecha de recojo por parte del gestor autorizado.
   - *Tipo de Residuo:* Categoría del material entregado (Orgánico, Aceite Usado, Envases).
   - *Gestor / Empresa Receptora:* Razón social del operador logístico ambiental.
   - *Cantidad (kg o Litros):* Peso total retirado de las instalaciones.
   - *N° de Constancia o Guía de Remisión:* Código del comprobante emitido por el recolector para trazabilidad legal y auditoría.
4. Presione *«Registrar Entrega»*. La entrega sumará directamente al porcentaje de circularidad visible en el Dashboard principal.
