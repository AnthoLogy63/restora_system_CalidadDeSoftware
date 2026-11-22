= Especificación de la API REST y Servicios

El backend de RESTORA expone una interfaz de programación de aplicaciones basada en el protocolo HTTP/1.1 y principios de arquitectura RESTful. Todas las peticiones y respuestas utilizan codificación `application/json; charset=utf-8` (a excepción de la descarga de reportes que emite `text/csv`).

== Convenciones de Diseño y Códigos de Estado HTTP

La API se apega a la semántica estándar de códigos de respuesta HTTP:
- `200 OK`: La solicitud se procesó con éxito y se retorna el recurso solicitado o una confirmación de actualización.
- `201 Created`: Se creó con éxito una nueva entidad (registro de turno, producto, entrega o reporte).
- `400 Bad Request`: El payload de entrada violó las restricciones de esquema definidas en Zod (campos faltantes, valores negativos, tipos incompatibles).
- `401 Unauthorized`: No se adjuntó la cookie de sesión o el token JWT expiró o contiene una firma inválida.
- `403 Forbidden`: El usuario autenticado no cuenta con permisos sobre el `restauranteId` especificado en la URI.
- `404 Not Found`: El recurso solicitado (producto, residuo u operación) no existe en el establecimiento.
- `500 Internal Server Error`: Ocurrió una anomalía imprevista en el servidor o en la ejecución del subproceso Python.

== Flujo de Interacción: Registro Multi-Ítem de Operación

Uno de los flujos críticos del sistema es el registro atómico de un turno diario, el cual captura en una única transacción de base de datos las ventas, los lotes de producción y los desperdicios generados:

#figure(
  image("../imagenes/G03_secuencia_registrar_turno.png", width: 92%),
  caption: [Diagrama de Secuencia: Registro multi-ítem de turno y cálculo automático de mermas.]
)

El usuario interactúa mediante el formulario de registro y visualiza inmediatamente los indicadores resultantes en el panel general:

#grid(
  columns: (1fr, 1fr),
  gutter: 1em,
  figure(
    image("../imagenes/register.png", width: 100%),
    caption: [Pantalla de Registro multi-ítem de operaciones y residuos.]
  ),
  figure(
    image("../imagenes/dashboard.png", width: 100%),
    caption: [Dashboard ejecutivo con KPIs diarios e indicadores de pérdida.]
  )
)

== Validación de Esquemas con Zod

Antes de alcanzar la capa de acceso a datos, toda petición entrante es parseada mediante esquemas de validación declarativos en TypeScript:

```ts
// Extracto de src/lib/validation/registroOperacion.ts
export const RegistroOperacionInputSchema = z.object({
  fecha: z.coerce.date(),
  turno: z.enum(["MANANA", "TARDE", "NOCHE"]),
  colaboradorId: z.string().cuid().optional(),
  observaciones: z.string().max(500).optional(),
  ventas: z.array(z.object({
    concepto: z.string().min(1, "El concepto es obligatorio"),
    cantidad: z.number().positive("La cantidad debe ser mayor a 0"),
    montoTotal: z.number().nonnegative("El monto total no puede ser negativo"),
  })).default([]),
  producciones: z.array(z.object({
    productoAsociado: z.string().min(1),
    cantidadProducida: z.number().positive(),
    unidad: z.string().default("kg"),
  })).default([]),
  residuos: z.array(z.object({
    categoria: z.nativeEnum(CategoriaResiduo),
    cantidadKg: z.number().positive("El peso debe ser mayor a 0"),
    area: z.nativeEnum(AreaProceso),
    productoAsociado: z.string().min(1),
    productoId: z.string().cuid().optional(),
    motivo: z.nativeEnum(MotivoGeneracion),
    destinoPrevisto: z.nativeEnum(DestinoPrevisto),
  })).default([]),
});
```

== Catálogo Detallado de Endpoints

=== 1. Autenticación y Cuentas (`/api/auth/*`)

==== `POST /api/auth/register`
- *Descripción:* Registra un nuevo restaurante junto a su usuario administrador y genera su sesión JWT.
- *Cuerpo de la Petición:*
```json
{
  "nombreRestaurante": "Tradición Arequipeña",
  "nombreUsuario": "Carlos Gómez",
  "email": "admin@tradicion.pe",
  "password": "Password123!"
}
```
- *Respuesta exitosa (`201 Created`):*
```json
{
  "ok": true,
  "restauranteId": "cm3r1a2b3c4d5e6f7g8h9",
  "usuario": { "id": "cm3u1a2b3c4d5e", "email": "admin@tradicion.pe", "nombre": "Carlos Gómez" }
}
```

==== `POST /api/auth/login`
- *Descripción:* Valida credenciales e inyecta la cookie de sesión `httpOnly`.
- *Cuerpo de la Petición:*
```json
{
  "email": "demo@circularaqp.pe",
  "password": "demo1234"
}
```
- *Respuesta exitosa (`200 OK`):* Establece la cabecera `Set-Cookie: session=...; HttpOnly; SameSite=Lax`.

==== `GET /api/auth/me`
- *Descripción:* Retorna el perfil y estado de sesión del usuario autenticado actual.
- *Respuesta exitosa (`200 OK`):*
```json
{
  "usuarioId": "cm3u01demo",
  "restauranteId": "cm3r01demo",
  "email": "demo@circularaqp.pe",
  "nombre": "Administrador Demo",
  "restauranteNombre": "El Buen Sabor AQP"
}
```

=== 2. Catálogo de Productos y Personal

==== `GET /api/restaurantes/[id]/productos`
- *Descripción:* Consulta el catálogo activo de productos y preparaciones. Soporta el parámetro `?incluirInactivos=true` para auditoría administrativa.
- *Respuesta exitosa (`200 OK`):*
```json
[
  { "id": "cm3p01", "nombre": "Rocoto Relleno", "costoUnitario": 12.50, "activo": true },
  { "id": "cm3p02", "nombre": "Pastel de Papa", "costoUnitario": 8.00, "activo": true }
]
```

==== `PATCH /api/restaurantes/[id]/productos/[productoId]`
- *Descripción:* Modifica datos o aplica baja lógica (Cambio CC-01) inactivando el producto para evitar su selección en nuevos registros sin alterar mermas pasadas.
- *Cuerpo de la Petición:* `{ "activo": false }`.

=== 3. Registro Multi-Ítem de Operaciones

==== `POST /api/restaurantes/[id]/operaciones`
- *Descripción:* Guarda atómicamente el turno, las ventas, la producción y los residuos del servicio.
- *Cuerpo de la Petición:*
```json
{
  "fecha": "2026-11-18T00:00:00.000Z",
  "turno": "TARDE",
  "colaboradorId": "cm3c01cocinero",
  "observaciones": "Servicio de alta afluencia por feriado regional.",
  "ventas": [
    { "concepto": "Rocoto Relleno con Pastel", "cantidad": 45, "montoTotal": 1575.00 }
  ],
  "producciones": [
    { "productoAsociado": "Rocoto Relleno", "cantidadProducida": 50, "unidad": "porciones" }
  ],
  "residuos": [
    {
      "categoria": "MERMA_PREPARACION",
      "cantidadKg": 3.2,
      "area": "COCINA",
      "productoAsociado": "Rocoto Relleno",
      "productoId": "cm3p01",
      "motivo": "ERROR_PORCION",
      "destinoPrevisto": "COMPOSTAJE"
    }
  ]
}
```
- *Respuesta exitosa (`201 Created`):* Retorna la entidad `RegistroOperacion` creada con los identificadores foráneos asignados y los costos unitarios calculados ($3.2 times 12.50 = 40.00$ PEN).

=== 4. Trazabilidad de Entregas a Recicladores

==== `POST /api/restaurantes/[id]/entregas`
- *Descripción:* Registra un despacho de residuos valorizables a gestores autorizados.
- *Cuerpo de la Petición:*
```json
{
  "categoria": "CARTON",
  "pesoKg": 48.5,
  "fecha": "2026-11-18T16:30:00.000Z",
  "receptor": "Asociación de Recicladores Yanahuara",
  "constanciaUrl": "CONST-2026-0894",
  "fotografiaUrl": "/uploads/evidencia_carton_0894.jpg",
  "observaciones": "Entrega conforme en fardos compactados."
}
```

=== 5. Analítica, Asistente Inteligente y Reportes

==== `GET /api/restaurantes/[id]/dashboard`
- *Descripción:* Agrega indicadores consolidados para el panel de control: total kg desperdiciados en la semana, pérdida monetaria acumulada, porcentaje de residuos desviados de vertederos y distribución por área.

==== `POST /api/restaurantes/[id]/asistente`
- *Descripción:* Procesa lenguaje natural mediante la cascada inteligente: primero invoca a *Gemini 2.5 Flash*, si falla o agota cuota conmuta hacia *Groq LLaMA 3.3 70B*, y si no hay conectividad externa activa el *motor determinista local*, extrayendo entidades (kilos, plato, turno) para prellenar el formulario de registro en menos de un minuto.

==== `POST /api/restaurantes/[id]/predicciones`
- *Descripción:* Dispara el subproceso Python `predictor/predict.py` para calcular la demanda estimada de platos en los próximos 7 días con base en el histórico de ventas y factores climáticos/estacionales.

==== `GET /api/restaurantes/[id]/reportes/[reporteId]/export`
- *Descripción:* Descarga un informe consolidado en formato CSV estándar delimitado por comas con cabeceras `Fecha,Turno,Categoria,Producto,CantidadKg,CostoPEN,Area,Destino`.
