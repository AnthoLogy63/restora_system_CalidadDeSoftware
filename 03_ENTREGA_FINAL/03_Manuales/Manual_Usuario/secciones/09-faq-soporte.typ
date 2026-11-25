= Preguntas Frecuentes, Incidencias y Glosario

Esta sección proporciona respuestas directas a las situaciones operativas más comunes durante el uso diario de RESTORA y define los términos técnicos clave de la gestión gastronómica y de calidad @pressman2014.

== Preguntas Frecuentes (FAQ)

=== ¿Qué hacer si se ingresó un dato erróneo al registrar una operación?
Si se registró por equivocación un peso o una causa incorrecta, la pantalla *«Historial»* permite localizar la transacción con los filtros de fecha y turno y *eliminarla* con el icono de papelera; después se vuelve a registrar el turno con los datos correctos (el sistema no permite repetir la misma fecha y turno mientras exista el registro). La edición directa de un registro existente no está disponible en la interfaz de esta versión. Al eliminar, el sistema recalcula los totales consolidados.

=== ¿Por qué el formulario rechaza que las porciones vendidas superen a las preparadas?
Por regla fundamental de integridad de negocio (*RF-0008*), no es posible despachar a mesa una cantidad de porciones superior a las que fueron efectivamente cocinadas en el turno. Si hubo preparaciones adicionales imprevistas, debe incrementarse primero el campo *«Porciones Preparadas»*.

=== ¿Los datos se conservan si se apaga el servidor o se reinicia la computadora?
Sí. A diferencia de prototipos en memoria volátil, RESTORA almacena todas las transacciones de forma persistente en SQLite mediante el ORM Prisma (*NFR-0004*). Toda la información de restaurantes, usuarios, platos, operaciones de pesaje y entregas permanece intacta tras reinicios o cortes de energía.

=== ¿Cómo se debe registrar el pesaje si la balanza de cocina marca en gramos?
El sistema trabaja en la unidad estándar de *kilogramos (kg)* con dos cifras decimales. Por tanto, si una tara o recipiente con mermas pesa `750` gramos, el operador debe registrar `0.75` kg. Si pesa `1` kg y `200` gramos, se ingresa `1.20` kg.

=== ¿Qué hacer ante un mensaje de advertencia «Error al sincronizar con el servidor»?
1. Compruebe que el servidor backend de RESTORA se encuentre activo (puede verificar abriendo `http://localhost:3000/api/health` en otra pestaña; la respuesta debe ser `{"status":"ok"}`).
2. Verifique su conexión de red local.
3. Si la sesión ha expirado por inactividad prolongada, cierre la pestaña y vuelva a ingresar mediante el formulario de login.

== Glosario de Términos

- *Merma en Cocina:* Pérdida de masa de materia prima ocurrida durante las fases de limpieza, pelado, deshuesado, fileteado o cocción en cocina.
- *Desperdicio Post-consumo:* Alimento completamente preparado y servido en sala que no es ingerido por el comensal y queda en el plato al retirarse de la mesa.
- *Línea Base Semanal:* Volumen de referencia cuantitativo (en kg) que representa el umbral máximo de desperdicios considerado aceptable para el restaurante en una semana de trabajo.
- *Economía Circular:* Modelo económico y productivo que busca reducir la generación de desechos al mínimo y reincorporar los residuos a nuevos ciclos útiles (mediante compostaje orgánico o reciclaje de aceite para biocombustibles).
- *Valorización de Residuos:* Operación cuyo objetivo principal es que el residuo sirva a una finalidad útil, sustituyendo a otros materiales o materias primas.
- *Costo Unitario por Porción:* Importe monetario directo que cuesta la materia prima requerida para elaborar una porción individual de un plato del menú.
