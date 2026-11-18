= Gestión de Operaciones y Medición de Desperdicios

Esta sección detalla el *Proceso de Negocio 1* de RESTORA: el flujo operativo diario mediante el cual el personal de cocina registra la producción, asienta las porciones vendidas, pesa los residuos generados y clasifica las causas del desperdicio, calculando en tiempo real el impacto económico asociado.

== Registro Diario de Operaciones (FRQ-0006 a FRQ-0013)

Para efectuar el registro de una jornada operativa:

1. Ingrese a la opción *«Registrar Operación»* desde el menú de navegación lateral o desde el botón superior del Dashboard.
2. Se desplegará el formulario de captura estructurada ilustrado en la @fig-registro-operacion.
3. Complete los datos de la cabecera operativa:
   - *Fecha:* Seleccione la fecha de trabajo (por defecto se carga la fecha actual).
   - *Turno de Servicio:* Elija entre *«Almuerzo»* o *«Cena»*.
   - *Plato / Alimento:* Seleccione el ítem gastronómico correspondiente del menú desplegable vinculado al catálogo oficial (ejemplo: *Rocoto Relleno Tradicional*, *Pastel de Papa Arequipeño*, *Chupe de Camarones*).

#figure(
  image("../imagenes/06_registro_operacion.png", width: 90%),
  caption: [Formulario interactivo de registro diario de producción, ventas y mermas],
) <fig-registro-operacion>

4. Ingrese las variables cuantitativas de cocina:
   - *Porciones Preparadas:* Número entero de raciones cocinadas o dispuestas en mise en place.
   - *Porciones Vendidas:* Número entero de platos despachados a comensales. El sistema valida automáticamente la regla de integridad de negocio: $text("Porciones Vendidas") <= text("Porciones Preparadas")$.
   - *Residuo Generado (kg):* Masa en kilogramos obtenida en la balanza digital de cocina. Se admiten valores con hasta dos decimales (ejemplo: `2.45` kg).
5. Seleccione la *Causa Principal del Desperdicio* (*FRQ-0011*):
   - *Preparación Excesiva:* Sobras en olla por sobrestimación de comensales.
   - *Caducidad / Insumo Vencido:* Insumo deteriorado en cámara fría o almacén.
   - *Merma en Cocina / Procesamiento:* Exceso de recortes, cáscaras o grasa no aprovechable.
   - *Sobras de Comensal (Post-consumo):* Alimento servido pero no consumido en mesa.
   - *Error de Cocción / Temperatura:* Plato quemado, sobrecocido o servido incorrectamente.
6. Observe el campo *«Pérdida Económica Estimada (S/.)»*: el sistema calcula este valor dinámicamente multiplicando los kilogramos desechados por el factor de costo unitario del plato (*FRQ-0013*).
7. Presione el botón *«Guardar Operación»*. El registro se almacenará de forma persistente en la base de datos SQLite y actualizará de inmediato los consolidados del Dashboard.

== Consulta y Auditoría en el Historial de Operaciones (FRQ-0014 y FRQ-0015)

Para auditar registros anteriores, revisar discrepancias o verificar el cumplimiento histórico de los pesajes:

1. Seleccione la opción *«Historial»* en la barra lateral.
2. El sistema presentará la tabla cronológica de registros (@fig-historial).

#figure(
  image("../imagenes/07_historial_operaciones.png", width: 95%),
  caption: [Historial cronológico de operaciones con filtros avanzados y detalle de mermas],
) <fig-historial>

3. Utilice las herramientas de búsqueda y filtrado:
   - *Filtro por Rango de Fechas:* Permite acotar la consulta a un día específico, una semana o un mes calendario (*FRQ-0014*).
   - *Filtro por Causa de Desperdicio:* Facilita aislar únicamente las mermas causadas por vencimiento o error de cocina (*FRQ-0015*).
   - *Búsqueda Rápida por Alimento:* Campo de texto para localizar inmediatamente todas las preparaciones de un plato específico.
4. En cada fila de la tabla se exhibe la fecha, turno, plato, volumen producido, volumen vendido, kilogramos de merma, causa y el costo monetario en Soles.
