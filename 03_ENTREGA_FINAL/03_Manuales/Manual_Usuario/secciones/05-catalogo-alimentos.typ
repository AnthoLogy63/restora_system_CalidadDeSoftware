= Mantenimiento del Catálogo de Alimentos

El catálogo de alimentos constituye la base maestra de datos para la valorización económica de las operaciones gastronómicas, implementando el requerimiento funcional *FRQ-0005* (Mantener el catálogo de alimentos) y sirviendo de soporte directo a la estimación de pérdidas (*FRQ-0013*).

== Estructura del Catálogo Gastronómico

Cada producto registrado en el catálogo contiene la definición cuantitativa y económica de una receta o preparación estándar:

#figure(
  image("../imagenes/08_catalogo_alimentos.png", width: 95%),
  caption: [Vista de administración del catálogo de alimentos y costos unitarios],
) <fig-catalogo>

Como se aprecia en la @fig-catalogo, los atributos clave de cada alimento comprenden:
- *Nombre del Alimento / Plato:* Denominación culinaria estándar (ejemplo: *Rocoto Relleno*, *Pastel de Papa*, *Adobo Arequipeño*, *Ceviche Clásico*).
- *Categoría Gastronómica:* Clasificación de la preparación (Entradas frías/calientes, Platos de fondo, Guarniciones, Salsas base).
- *Porción Estándar (gramos):* Peso promedio de servicio en plato servido al comensal (referencia habitual: entre 250 g y 500 g).
- *Costo Unitario por Porción (S/.):* Costo de materia prima (costo directo de insumos) incurrido para preparar una porción individual.
- *Costo Estimado por Kilogramo (S/./kg):* Factor de conversión calculado internamente por el sistema:
$ text("Costo por kg") = frac{text("Costo Unitario por Porción") times 1000}{text("Porción Estándar (g)")} $
Este factor es el que multiplica automáticamente a la masa pesada en el módulo de operaciones para cuantificar la pérdida económica.

== Procedimiento para Añadir un Nuevo Alimento

Para dar de alta un nuevo plato en el catálogo del restaurante:

1. Ingrese a la sección *«Catálogo»* desde el menú de navegación.
2. Pulse el botón *«+ Nuevo Alimento»* ubicado en la parte superior derecha de la tabla.
3. Complete el formulario emergente:
   - Ingrese el nombre descriptivo del plato.
   - Seleccione la categoría correspondiente.
   - Especifique el tamaño de porción estándar en gramos.
   - Ingrese el costo estimado de los ingredientes por porción en moneda nacional (PEN / S/.).
4. Presione el botón *«Guardar en Catálogo»*. El nuevo ítem quedará inmediatamente disponible en las listas desplegables del registro diario de operaciones.

== Actualización y Mantenimiento de Costos

Debido a las fluctuaciones estacionales en los precios de los insumos agrícolas en los mercados de Arequipa (como la cebolla, el rocoto, el queso paria o la carne de res):

1. Localice el alimento que desea actualizar en la tabla maestra.
2. Haga clic en el botón *«Editar»* (icono de lápiz) correspondiente a la fila del producto.
3. Actualice el costo unitario de la porción con el valor vigente.
4. Presione *«Actualizar»*. Los registros históricos previos conservarán el costo con el que fueron grabados originalmente (garantizando consistencia contable histórica), mientras que las nuevas operaciones aplicarán el costo actualizado.
