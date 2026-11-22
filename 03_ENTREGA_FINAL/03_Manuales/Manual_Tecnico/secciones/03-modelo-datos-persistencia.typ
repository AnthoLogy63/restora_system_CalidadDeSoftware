= Modelo de Datos y Persistencia

El subsistema de persistencia de RESTORA está gobernado por *Prisma ORM 7* sobre una base de datos relacional *SQLite* (`dev.db`). El modelo garantiza integridad referencial estricta, unicidad de turnos de trabajo y preservación histórica de métricas de sostenibilidad.

== Diagrama Entidad-Relación y Estructura de Clases

La base de datos modela doce entidades principales que encapsulan el ciclo completo de operaciones, mermas, salidas a reciclaje y analítica:

#figure(
  image("../imagenes/G03_modelo_datos.png", width: 95%),
  caption: [Diagrama Entidad-Relación del modelo de datos de RESTORA.]
)

El diagrama de clases correspondiente describe los métodos de acceso y las relaciones de agregación y composición del dominio:

#figure(
  image("../imagenes/G03_clases.png", width: 95%),
  caption: [Diagrama de Clases del dominio de RESTORA.]
)

== Diccionario de Datos Exhaustivo

A continuación se detalla la especificación de las entidades relacionales que conforman el esquema de la base de datos:

=== Tabla: `Restaurante`
Entidad raíz multi-tenant del sistema. Cada restaurante registrado opera en un espacio de datos aislado.
#table(
  columns: (1.5fr, 1.2fr, 1fr, 3fr),
  table.header([*Campo*], [*Tipo*], [*Nulo*], [*Descripción y Restricciones*]),
  [`id`], [`String (cuid)`], [No], [Clave primaria única generada mediante CUID.],
  [`nombre`], [`String`], [No], [Razón social o nombre comercial del establecimiento.],
  [`ciudad`], [`String`], [No], [Ciudad de operación (por defecto 'Arequipa').],
  [`lineaBaseSemanalKg`], [`Float`], [Sí], [Meta semanal de referencia para cálculo de reducción de residuos.],
  [`createdAt`], [`DateTime`], [No], [Marca temporal de creación automática (`now()`).]
)

=== Tabla: `Usuario`
Representa la cuenta de acceso administrativo (1:1 con `Restaurante`).
#table(
  columns: (1.5fr, 1.2fr, 1fr, 3fr),
  table.header([*Campo*], [*Tipo*], [*Nulo*], [*Descripción y Restricciones*]),
  [`id`], [`String (cuid)`], [No], [Clave primaria única CUID.],
  [`restauranteId`], [`String`], [No], [Clave foránea única referenciando a `Restaurante(id)` con `onDelete: Cascade`.],
  [`nombre`], [`String`], [No], [Nombre completo del responsable de la cuenta.],
  [`email`], [`String`], [No], [Correo electrónico de acceso (índice único global).],
  [`passwordHash`], [`String`], [No], [Hash criptográfico de la contraseña (SHA-256 con salt).],
  [`resetToken`], [`String`], [Sí], [Token único temporal para restablecimiento de clave.],
  [`resetTokenExpiresAt`], [`DateTime`], [Sí], [Fecha límite de expiración del token de recuperación.],
  [`createdAt`], [`DateTime`], [No], [Fecha de alta del usuario en el sistema.]
)

=== Tabla: `Colaborador`
Personal operativo de cocina, salón o almacén (sin credenciales de inicio de sesión), utilizado para atribuir los registros de turno.
#table(
  columns: (1.5fr, 1.2fr, 1fr, 3fr),
  table.header([*Campo*], [*Tipo*], [*Nulo*], [*Descripción y Restricciones*]),
  [`id`], [`String (cuid)`], [No], [Clave primaria CUID.],
  [`restauranteId`], [`String`], [No], [Clave foránea referenciando a `Restaurante(id)`.],
  [`nombre`], [`String`], [No], [Nombre o seudónimo del colaborador.],
  [`rol`], [`RolColaborador`], [No], [Enumeración: ADMINISTRADOR, JEFE_COCINA, COCINERO, ALMACEN, LIMPIEZA, SOSTENIBILIDAD, TURNO.],
  [`capacitado`], [`Boolean`], [No], [Indicador de si el personal ha recibido inducción en separación de residuos (por defecto false).],
  [`createdAt`], [`DateTime`], [No], [Marca temporal de registro.]
)

=== Tabla: `Producto`
Insumos, preparaciones o platos terminados con su respectivo costo de adquisición o elaboración.
#table(
  columns: (1.5fr, 1.2fr, 1fr, 3fr),
  table.header([*Campo*], [*Tipo*], [*Nulo*], [*Descripción y Restricciones*]),
  [`id`], [`String (cuid)`], [No], [Clave primaria CUID.],
  [`restauranteId`], [`String`], [No], [Clave foránea referenciando a `Restaurante(id)`.],
  [`nombre`], [`String`], [No], [Nombre descriptivo del producto o plato.],
  [`costoUnitario`], [`Float`], [No], [Costo unitario en Soles (PEN) por kilogramo o porción.],
  [`activo`], [`Boolean`], [No], [Control de baja lógica introducido por la Solicitud de Cambio CC-01 (por defecto true).],
  [`createdAt`], [`DateTime`], [No], [Marca temporal de registro.]
)

=== Tabla: `RegistroOperacion`
Encabezado transaccional diario de un turno de trabajo. Agrupa ventas, preparaciones y residuos generados.
#table(
  columns: (1.5fr, 1.2fr, 1fr, 3fr),
  table.header([*Campo*], [*Tipo*], [*Nulo*], [*Descripción y Restricciones*]),
  [`id`], [`String (cuid)`], [No], [Clave primaria CUID.],
  [`restauranteId`], [`String`], [No], [Clave foránea referenciando a `Restaurante(id)`.],
  [`colaboradorId`], [`String`], [Sí], [Clave foránea opcional referenciando a `Colaborador(id)`.],
  [`fecha`], [`DateTime`], [No], [Fecha calendario de la operación (normalizada a medianoche UTC).],
  [`turno`], [`Turno`], [No], [Enumeración: MANANA, TARDE, NOCHE.],
  [`observaciones`], [`String`], [Sí], [Notas o incidencias operativas del turno.],
  [`createdAt`], [`DateTime`], [No], [Marca temporal de alta.],
  [`updatedAt`], [`DateTime`], [No], [Marca temporal de última modificación.]
)
*Restricción de Unicidad:* `@@unique([restauranteId, fecha, turno])`. Evita la duplicación accidental de turnos en el mismo día para un restaurante.

=== Tabla: `Residuo`
Registro granular de merma o desecho de cocina/salón.
#table(
  columns: (1.5fr, 1.2fr, 1fr, 3fr),
  table.header([*Campo*], [*Tipo*], [*Nulo*], [*Descripción y Restricciones*]),
  [`id`], [`String (cuid)`], [No], [Clave primaria CUID.],
  [`restauranteId`], [`String`], [No], [Clave foránea referenciando a `Restaurante(id)`.],
  [`registroOperacionId`], [`String`], [Sí], [Clave foránea hacia `RegistroOperacion(id)` con `onDelete: Cascade`.],
  [`categoria`], [`CategoriaResiduo`], [No], [Categoría estandarizada del desperdicio alimentario o reciclable.],
  [`cantidadKg`], [`Float`], [No], [Masa física registrada en kilogramos ($> 0$).],
  [`area`], [`AreaProceso`], [No], [Área física de origen: COCINA, ALMACEN, SALON, BARRA, LIMPIEZA, OTRO.],
  [`productoAsociado`], [`String`], [No], [Nombre textual del producto o preparación descartada.],
  [`productoId`], [`String`], [Sí], [Clave foránea opcional hacia `Producto(id)` para vinculación de catálogo.],
  [`motivo`], [`MotivoGeneracion`], [No], [Causa raíz: SOBREPRODUCCION, ERROR_PREPARACION, PRODUCTO_VENCIDO, etc.],
  [`fecha`], [`DateTime`], [No], [Fecha del suceso.],
  [`turno`], [`Turno`], [No], [Turno en que se produjo el residuo.],
  [`destinoPrevisto`], [`DestinoPrevisto`], [No], [Destino proyectado: RELLENO_SANITARIO, COMPOSTAJE, DONACION, etc.],
  [`costoTotal`], [`Float`], [Sí], [Pérdida monetaria calculada ($"costoUnitario" times "cantidadKg"$).]
)

=== Tabla: `Entrega`
Registro de entrega de materiales valorizables a recicladores autorizados (trazabilidad y evidencia).
#table(
  columns: (1.5fr, 1.2fr, 1fr, 3fr),
  table.header([*Campo*], [*Tipo*], [*Nulo*], [*Descripción y Restricciones*]),
  [`id`], [`String (cuid)`], [No], [Clave primaria CUID.],
  [`restauranteId`], [`String`], [No], [Clave foránea referenciando a `Restaurante(id)`.],
  [`categoria`], [`CategoriaResiduo`], [No], [Tipo de material entregado (CARTON, VIDRIO, ACEITE_USADO, etc.).],
  [`pesoKg`], [`Float`], [No], [Peso certificado entregado en kilogramos.],
  [`fecha`], [`DateTime`], [No], [Fecha y hora del despacho.],
  [`receptor`], [`String`], [No], [Nombre de la asociación de recicladores, empresa o gestor ambiental.],
  [`fotografiaUrl`], [`String`], [Sí], [Enlace o referencia a la evidencia visual de la entrega.],
  [`constanciaUrl`], [`String`], [Sí], [Código de comprobante, manifiesto o guía física firmada.]
)

== Enumeraciones y Dominios de Valores

Las enumeraciones tipadas en Prisma restringen los valores a dominios semánticos precisos:

- `CategoriaResiduo`: `MERMA_PREPARACION`, `PRODUCTO_DETERIORADO`, `SOBREPRODUCCION`, `ALIMENTO_NO_VENDIDO`, `RESTOS_CLIENTE`, `CARTON`, `VIDRIO`, `PLASTICO`, `ACEITE_USADO`, `NO_APROVECHABLE`.
- `AreaProceso`: `COCINA`, `ALMACEN`, `SALON`, `BARRA`, `LIMPIEZA`, `OTRO`.
- `MotivoGeneracion`: `SOBREPRODUCCION`, `ERROR_PREPARACION`, `PRODUCTO_VENCIDO`, `EXCESO_COMPRA`, `DEVOLUCION_CLIENTE`, `MAL_ALMACENAMIENTO`, `ERROR_PORCION`, `OTRO`.
- `Turno`: `MANANA`, `TARDE`, `NOCHE`.
- `DestinoPrevisto`: `RELLENO_SANITARIO`, `COMPOSTAJE`, `DONACION`, `VALORIZACION_RECICLADOR`, `REUTILIZACION_INTERNA`, `VENTA_SUBPRODUCTO`, `PENDIENTE_DEFINIR`.
- `RolColaborador`: `ADMINISTRADOR`, `JEFE_COCINA`, `COCINERO`, `ALMACEN`, `LIMPIEZA`, `SOSTENIBILIDAD`, `TURNO`.

== Reglas de Integridad y Control de Bajas Lógicas (Cambio CC-01)

Durante la fase de gestión de cambios (Guía G02), se identificó que la eliminación física de un `Producto` (`DELETE FROM Producto`) rompía la integridad histórica de los registros previos de mermas y ventas, o causaba fallos en los reportes anuales por orfandad de claves foráneas.

En atención a la *Solicitud de Cambio CC-01 (FRQ-0005)*, se añadió la columna `activo: Boolean @default(true)` en el modelo `Producto`. A nivel de la API REST, la acción de borrado se convirtió en una baja lógica:

```ts
// Extracto de src/app/api/restaurantes/[id]/productos/[productoId]/route.ts
// Implementación del cambio CC-01: Inactivación lógica en lugar de borrado físico
await prisma.producto.update({
  where: { id: productoId },
  data: { activo: false },
});
```

#figure(
  image("../imagenes/CC01_2_producto_inactivado.png", width: 85%),
  caption: [Evidencia del cambio CC-01: producto inactivado conservando su trazabilidad histórica.]
)

Esta modificación garantiza que los registros históricos de desperdicios conserven intacto su costo unitario asociado sin alterar los cálculos de reportes consolidados pasados.
