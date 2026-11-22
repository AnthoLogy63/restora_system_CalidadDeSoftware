= Perfil, Configuración y Gestión de Colaboradores

La sección de configuración permite al administrador del restaurante adaptar los parámetros clave del negocio, fijar metas ambientales cuantitativas y gestionar al equipo humano encargado de las operaciones de cocina y salón.

== Perfil del Restaurante y Línea Base Ambiental

Al ingresar a la opción *«Perfil»* en el menú de navegación, se visualiza la información general del establecimiento gastronómico (@fig-perfil).

#figure(
  image("../imagenes/13_perfil_configuracion.png", width: 95%),
  caption: [Vista de configuración de perfil del restaurante, línea base y colaboradores],
) <fig-perfil>

=== Parámetros Configurables
- *Nombre Comercial del Establecimiento:* Razón social registrada del restaurante (ejemplo: *El Buen Sabor AQP*).
- *Ciudad y Ubicación:* Región de operación (por defecto fijada en Arequipa), empleada para correlacionar factores climáticos y estacionales en el motor predictivo.
- *Línea Base Semanal de Residuos (kg):* Umbral de referencia cuantitativo fijado por la administración. Representa la masa máxima de desperdicios semanales considerada aceptable para el volumen operativo del local (ejemplo: `70.00` kg semanales). Cuando los pesajes acumulados de una semana superan este valor, el sistema activa alertas visuales en el Dashboard indicando desviación negativa de la meta de sostenibilidad.

Para modificar la línea base:
1. Ingrese el nuevo valor en kilogramos en el campo *«Línea Base Semanal»*.
2. Presione el botón *«Actualizar Parámetros»*.
3. El semáforo de economía circular del Dashboard recalculará de inmediato el porcentaje de reducción en base al nuevo límite.

== Gestión de Colaboradores y Capacitación en Cocina

El éxito en la reducción de mermas gastronómicas depende directamente del compromiso del personal de cocina. RESTORA permite registrar al equipo operativo y supervisar su nivel de formación técnica:

=== Alta de Nuevos Colaboradores
1. En la tabla inferior de *«Colaboradores»*, presione el botón *«+ Agregar Colaborador»*.
2. Complete la ficha del trabajador:
   - *Nombre Completo:* Identificación del empleado.
   - *Rol Operativo:* Cargo asignado dentro del restaurante (por ejemplo: *Chef Principal*, *Cocinero de Línea*, *Responsable de Almacén*, *Ayudante de Cocina*).
   - *Estado de Capacitación:* Casilla de verificación que certifica si el colaborador ha aprobado el taller de manejo de residuos, pesaje y segregación en origen.
3. Presione *«Guardar Colaborador»*.

=== Monitoreo del Indicador de Personal Capacitado
El sistema evalúa el ratio de personal capacitado frente al total de la dotación operativa:
$ text("Tasa de Capacitación") = frac{text("Colaboradores Capacitados")}{text("Total de Colaboradores")} times 100 $
Mantener este indicador por encima del 80 % es un criterio indispensable para asegurar la precisión en los registros de balanza y la reducción efectiva de errores de cocción.
