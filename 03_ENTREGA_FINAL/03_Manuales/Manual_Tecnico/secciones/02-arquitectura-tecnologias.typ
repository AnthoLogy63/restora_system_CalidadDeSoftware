= Arquitectura del Sistema y Tecnologías

La arquitectura de RESTORA adopta el patrón de *monorepo desacoplado* con separación estricta de responsabilidades entre la capa de presentación de usuario, el servidor de servicios API RESTful, el motor de persistencia relacional y el subsistema analítico de inteligencia artificial.

== Vista Arquitectónica Global

La solución se compone de cuatro subsistemas funcionales principales:

+ *Subsistema Frontend (Cliente Web SPA / SSR):* Construido con el framework *TanStack Start* sobre *React 19* y empaquetado mediante *Vite*. Se ejecuta en el puerto TCP `8080`. Provee una interfaz reactiva optimizada con navegación instantánea, estados de carga asíncronos mediante *TanStack Query* y un proxy reverso transparente que enruta las peticiones dirigidas a `/api/*` hacia el servidor backend.
+ *Subsistema Backend (API REST de Dominio):* Implementado sobre *Next.js 16* (utilizando la infraestructura de Route Handlers del App Router) en lenguaje *TypeScript*. Escucha peticiones HTTP en el puerto TCP `3000`. Centraliza la lógica de negocio, las validaciones de datos con *Zod*, el cálculo de costes económicos, las recomendaciones analíticas y la emisión/verificación de credenciales de sesión en tokens JWT.
+ *Capa de Persistencia Relacional:* Basada en *Prisma ORM 7* configurado con el adaptador nativo `better-sqlite3`, interactuando directamente sobre el motor transaccional embebido *SQLite* (`dev.db`). Este esquema garantiza portabilidad total y persistencia ACID sin demandar la instalación ni el mantenimiento de servidores de bases de datos pesados como MySQL o PostgreSQL.
+ *Subsistema de Machine Learning (Predictor Analítico):* Implementado como un proceso secundario independiente en *Python 3*. Utiliza las bibliotecas *scikit-learn* y *joblib* para entrenar modelos predictivos `RandomForestRegressor` optimizados con validación cruzada y búsqueda de hiperparámetros (`GridSearchCV`).

#figure(
  image("../imagenes/G03_arquitectura.png", width: 92%),
  caption: [Diagrama de Arquitectura de RESTORA: capas, protocolos y subsistemas.]
)

== Stack Tecnológico y Justificación Técnica

La selección de tecnologías responde a rigurosos criterios de rendimiento, mantenibilidad, portabilidad y aislamiento:

#table(
  columns: (1.5fr, 2fr, 3fr),
  align: (left + horizon, left + horizon, left),
  table.header([*Componente*], [*Tecnología Elegida*], [*Justificación Técnica y Operativa*]),
  [Capa Cliente], [React 19 + TanStack Start + Tailwind CSS 4], [Renderizado optimizado, gestión de formularios tipados, caché reactiva de peticiones con React Query y diseño responsivo sin sobrecarga en tiempo de ejecución.],
  [Servidor API], [Next.js 16 App Router + TypeScript], [Rutas REST altamente estructuradas, tipado estático de extremo a extremo, excelente soporte de asincronía en Node.js y compatibilidad directa con herramientas de prueba.],
  [Validación], [Zod 4], [Validación declarativa y estricta en el servidor de todos los esquemas de entrada (cuerpo JSON, cabeceras y parámetros de URL), mitigando inyecciones de datos maliciosos.],
  [Persistencia], [Prisma 7 + better-sqlite3], [Abstracción ORM con autogeneración de tipos TypeScript, control de migraciones DDL versionadas y acceso síncrono ultra veloz a ficheros SQLite sin latencia de red.],
  [Seguridad / Auth], [Jose (JWT) + httpOnly Cookies], [Tokens firmados mediante HMAC SHA-256 en cookies protegidas contra ataques Cross-Site Scripting (XSS), eliminando almacenamiento en localStorage.],
  [Machine Learning], [Python 3 + scikit-learn], [Algoritmo Random Forest idóneo para series temporales cortas y datos de demanda tabular en gastronomía; invocación desacoplada vía IPC sin exponer servicios HTTP adicionales.],
  [Pruebas Unitarias], [Vitest + V8 Coverage], [Ejecución rápida paralela compatible con módulos ESM y reporte riguroso de cobertura de líneas, sentencias y ramas superior al 80 % en la lógica de negocio.],
  [Pruebas Rendimiento], [Apache JMeter 5.x], [Inyección de perfiles de carga no gráfica, medición milimétrica de latencias percentil $p_{95}$, cálculo de índice Apdex y rendimiento de transacciones por segundo.],
  [Pruebas E2E], [Selenium WebDriver 4 + Python], [Automatización integral de pruebas funcionales sobre navegadores reales (Chrome, Firefox, Brave), validando sincronización dinámica con esperas explícitas.]
)

== Mecanismo de Seguridad, Autenticación y Sesiones

El sistema implementa un modelo de seguridad multi-tenant robusto basado en el aislamiento estricto por `restauranteId`:

=== Generación y Firma de Sesiones
Al registrarse o iniciar sesión exitosamente en `/api/auth/login`, el backend autentica las credenciales comparando el hash de la contraseña (derivado con scrypt y un salt aleatorio individual, y verificado con comparación en tiempo constante). Si la autenticación es conforme, la biblioteca `jose` emite un JSON Web Token (JWT) firmado con el secreto `AUTH_SECRET`:

```ts
// Extracto de src/lib/auth.ts: Emisión de Token de Sesión JWT
export async function createSessionToken(payload: {
  usuarioId: string;
  restauranteId: string;
  email: string;
}): Promise<string> {
  const secretKey = new TextEncoder().encode(process.env.AUTH_SECRET);
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}
```

El token resultante es inyectado en una cookie de respuesta con los atributos esenciales de seguridad:
- `HttpOnly: true` (impide el acceso al token mediante código JavaScript en el navegador).
- `SameSite: "lax"` (mitiga vectores de ataque de falsificación de petición en sitios cruzados - CSRF).
- `Path: "/"` (válido para la totalidad de endpoints de la API).

=== Guardianes de Sesión y Aislamiento de Tenant
En cada petición hacia los endpoints protegidos bajo `/api/restaurantes/[id]/*`, la función `requireSession(request, restauranteId)` intercepta la cabecera `Cookie`, desencripta y verifica la firma del JWT, y compara el identificador del tenant:

```ts
// Validación estricta de aislamiento de restaurante
export async function requireSession(request: Request, restauranteId?: string) {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = extractTokenFromCookie(cookieHeader);
  if (!token) {
    throw new AuthError("Sesión no iniciada o token inexistente", 401);
  }
  const payload = await verifySessionToken(token);
  if (restauranteId && payload.restauranteId !== restauranteId) {
    throw new ForbiddenError("Acceso denegado: el recurso pertenece a otro restaurante", 403);
  }
  return payload;
}
```

Si el `restauranteId` provisto en la ruta no coincide con el registrado en el token del usuario, se interrumpe inmediatamente el ciclo de vida de la petición con un código `403 Forbidden`, impidiendo fugas de datos entre establecimientos.

== Puente de Interoperabilidad Node.js - Python (`pythonBridge.ts`)

Para evitar la complejidad y el consumo de recursos asociado al mantenimiento de un microservicio HTTP persistente en Python (como Flask o FastAPI), el sistema implementa un puente de comunicación interproceso (IPC) ligero basado en el módulo nativo `child_process.spawn` de Node.js:

```ts
// Extracto de src/lib/pythonBridge.ts
import { spawn } from "node:child_process";

export async function runPredictor(scriptName: "train.py" | "predict.py", inputPayload: any) {
  const pythonBin = process.env.PYTHON_BIN || "python3";
  const scriptPath = path.resolve(process.cwd(), "predictor", scriptName);

  return new Promise((resolve, reject) => {
    const process = spawn(pythonBin, [scriptPath]);
    let stdoutData = "";
    let stderrData = "";

    process.stdin.write(JSON.stringify(inputPayload));
    process.stdin.end();

    process.stdout.on("data", (chunk) => { stdoutData += chunk.toString(); });
    process.stderr.on("data", (chunk) => { stderrData += chunk.toString(); });

    process.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Predictor falló con código ${code}: ${stderrData}`));
      }
      try {
        resolve(JSON.parse(stdoutData));
      } catch (e) {
        reject(new Error(`Respuesta JSON corrupta del predictor: ${stdoutData}`));
      }
    });
  });
}
```

Este mecanismo garantiza que el modelo analítico se cargue bajo demanda, procese los vectores de entrada a través de `stdin`, serialice los resultados como JSON estricto hacia `stdout` y libere la memoria RAM del sistema operativo inmediatamente tras completar la inferencia.
