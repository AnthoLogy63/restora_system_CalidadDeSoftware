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

Para dar de alta un nuevo producto en el catálogo del restaurante:

1. Ingrese a la sección *«Catálogo»* desde el menú de navegación.
2. En la parte superior escriba el *nombre del producto* y su *costo en soles (S/)* por unidad.
3. Presione el botón *«Agregar»*. El producto queda disponible en las listas del registro diario de operaciones.

== Actualización y Mantenimiento de Costos

Debido a las fluctuaciones estacionales en los precios de los insumos agrícolas en los mercados de Arequipa (como la cebolla, el rocoto, el queso paria o la carne de res):

La interfaz actual no permite editar el costo de un producto existente. Para aplicar un costo vigente:

1. Agregue un producto nuevo con el costo actualizado, como se explicó arriba.
2. Elimine el producto anterior con el icono de papelera. Si ya tiene registros históricos, el sistema *no lo borra*: lo marca como *Inactivo* (cambio CC-01), de modo que los registros previos conservan el costo con el que se grabaron. Un producto inactivo puede volver a usarse con el botón *«Reactivar»*.
