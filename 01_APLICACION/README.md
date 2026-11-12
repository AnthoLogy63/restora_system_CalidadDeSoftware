<p align="center">
  <strong style="font-size:2rem">🍽️ restora</strong><br/>
  <em>Gestión inteligente de residuos para restaurantes turísticos de Arequipa</em>
</p>

## Cómo ejecutar RESTORA en Windows

Esta carpeta (`01_APLICACION`) contiene el backend. La interfaz está en `frontend/`. Para trabajar localmente se ejecutan ambos procesos en terminales separadas.

La aplicación ya incluye la conexión a **SQLite mediante Prisma**. No se necesita instalar un servidor MySQL o PostgreSQL: las migraciones crean la base de datos local. El archivo `.env` se crea a partir del ejemplo; no se descarga.

### 1. Instalar las dependencias

Necesitas Node.js y npm. Se recomienda Node.js 22 LTS actualizado o una versión compatible más reciente. Abre PowerShell desde esta carpeta; si estás en la raíz `LAB`, entra con:

```powershell
cd .\proyecto-Calidad\01_APLICACION
```

Comprueba las herramientas e instala las dependencias del backend y del frontend:

```powershell
node --version
npm --version
npm ci
cd frontend
npm ci
cd ..
```

La instalación puede tardar varios minutos. Se realiza la primera vez y cuando cambian las dependencias del proyecto.

### 2. Crear la configuración local

Desde `01_APLICACION`, copia el ejemplo **solo si todavía no tienes un `.env`**:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

Para las pruebas locales puedes conservar estos valores del ejemplo:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="change-me-to-a-long-random-string"
```

`AUTH_SECRET` es necesario para firmar las sesiones. El valor de ejemplo permite probar localmente sin generar otra clave; antes de publicar la aplicación debe reemplazarse por un secreto aleatorio propio. No es la contraseña del usuario de demostración.

Las claves `GEMINI_API_KEY` y `GROQ_API_KEY` pueden quedar vacías. El asistente dispone de un modo guiado sin proveedores externos. El archivo `.env` contiene configuración privada y está excluido de Git.

### 3. Crear la base de datos y cargar la demostración

Ejecuta desde `01_APLICACION`:

```powershell
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

- `generate` crea el cliente Prisma que utiliza el backend.
- `migrate deploy` aplica las migraciones existentes y crea las tablas locales.
- `db seed` carga el restaurante, el usuario y los registros de demostración.

Estos comandos preparan la copia local; no se ejecutan cada vez que abres la aplicación. **No repitas el seed para iniciar el sistema:** si ya existe el restaurante de demostración, el script elimina sus datos y los vuelve a crear.

El seed también intenta entrenar un modelo predictivo. Si faltan Python o sus paquetes, puede advertir que no pudo entrenarlo y aun así terminar la carga principal. La preparación opcional del predictor se explica más abajo.

### 4. Iniciar la aplicación

**Terminal 1 — backend**, ubicada en `01_APLICACION`:

```powershell
npm run dev
```

**Terminal 2 — frontend**, también partiendo de `01_APLICACION`:

```powershell
cd frontend
npm run dev -- --port 8080
```

Mantén ambas terminales abiertas. Entra a [http://localhost:8080](http://localhost:8080).

| Dato de demostración | Valor |
| --- | --- |
| Correo | `demo@circularaqp.pe` |
| Contraseña | `demo1234` |
| Restaurante | El Buen Sabor AQP |

Para detener los procesos, presiona `Ctrl+C` en cada terminal. En las siguientes sesiones basta con ejecutar los dos comandos de inicio; los datos permanecen guardados en SQLite.

### 5. Comprobaciones rápidas y errores frecuentes

El backend responde en [http://localhost:3000/api/health](http://localhost:3000/api/health). Esta ruta comprueba que la API está levantada; el inicio de sesión permite comprobar además el acceso a los datos.

| Situación | Qué revisar |
| --- | --- |
| Falta el cliente Prisma o aparece un error sobre `generated/prisma` | Ejecuta `npx prisma generate` desde `01_APLICACION`. |
| Aparece `no such table` o no existe la base local | Ejecuta `npx prisma migrate deploy`. |
| No puedes ingresar con el usuario de demostración | Confirma que el seed terminó y usa las credenciales de la tabla anterior. |
| La interfaz abre, pero las peticiones a `/api` fallan | Mantén el backend ejecutándose en el puerto 3000. |
| No abre la página | Revisa que el frontend indique el puerto 8080 y que ambas terminales sigan abiertas. |
| El puerto está ocupado | Detén la instancia anterior antes de iniciar otra; el frontend espera la API en el puerto 3000. |
| `npm ci` muestra un error de permisos | Ejecuta la instalación en tu PowerShell habitual, fuera de un entorno restringido, y revisa el mensaje concreto. |

### Opcional — habilitar las predicciones con Python

El módulo de predicciones necesita Python y los paquetes de `predictor/requirements.txt`. Desde `01_APLICACION`, crea un entorno local e instala sus dependencias:

```powershell
python --version
python -m venv predictor/.venv
./predictor/.venv/Scripts/python.exe -m pip install -r predictor/requirements.txt
```

Configura el ejecutable en `.env`:

```env
PYTHON_BIN="predictor/.venv/Scripts/python.exe"
```

Reinicia el backend después de cambiar esta variable. No necesitas activar el entorno virtual: el backend utiliza directamente el ejecutable indicado. Puedes usar el módulo de predicciones para entrenar con los datos disponibles, sin volver a cargar el seed.

---

## 📌 Descripción

**restora** es una plataforma web que transforma registros simples de residuos en información de costos, recomendaciones operativas y evidencia de valorización para restaurantes turísticos de Arequipa. Incluye un **asistente conversacional con IA** (Gemini / Groq / modo guiado) que permite completar registros en menos de un minuto hablando en lenguaje natural.

Proyecto desarrollado para el reto **TURISTÓN 2026**.

---

## 🧩 Problema

> **5 Whys (Lienzo 5):**
> Los administradores de restaurantes turísticos de Arequipa no saben qué residuo genera la mayor pérdida económica, ni tienen tiempo para registrar datos de desperdicio en medio de la operación diaria.

> **HMW:** ¿Cómo podríamos facilitar que un administrador registre desperdicios, identifique pérdidas y reciba recomendaciones sin necesitar un sistema complejo ni más de un minuto por registro?

---

## 🎯 Objetivos

1. **Registro de ≤1 minuto** — Asistente conversacional que recopila datos hablando con el usuario y prellena los formularios.
2. **Cálculo de pérdida económica real** — Conversión automática kg → S/ usando costos unitarios del catálogo de productos.
3. **Trazabilidad con evidencia** — Registro de entregas a recicladores con receptor, fotografía y constancia.
4. **Recomendaciones automáticas** — Motor de reglas (R1–R10) que identifica oportunidades de mejora.
5. **Predicción de ventas** — Modelo RandomForest que estima la demanda por plato para reducir sobreproducción.

---

## ✨ Funcionalidades

### Implementadas ✅

| Módulo | Descripción |
|--------|-------------|
| **Asistente IA** | Chat conversacional con cascada Gemini → Groq → modo guiado determinista. Nunca se rompe. |
| **Registro de operaciones** | Formulario multi-ítem: varias ventas + varios desperdicios en un solo registro de turno. |
| **Dashboard** | Panel con KPIs del día: pérdida económica, kg generados, prevención, tendencia semanal. |
| **Análisis y recomendaciones** | 6 indicadores del PDF + motor R1–R10 con posibilidad de registrar acciones aplicadas. |
| **Entregas / Trazabilidad** | Alta de entregas a recicladores con receptor, evidencia fotográfica y constancia. |
| **Catálogo** | Gestión de productos con costo unitario + personal con marca de capacitación. |
| **Reportes** | Generación y descarga de reportes en CSV con resumen JSON persistido. |
| **Predicción IA** | Modelo RandomForest (scikit-learn) entrenado con historial de ventas por plato. |
| **Autenticación** | JWT en cookie httpOnly, aislamiento multi-tenant por `restauranteId`. |
| **Historial** | Listado de registros de operación anteriores con detalle de ventas y desperdicios. |
| **Perfil** | Información del restaurante y datos del usuario. |

### Pendientes / Roadmap 🚧

| Funcionalidad | Estado |
|---------------|--------|
| Integración con POS (punto de venta) | Planificado |
| Integración con balanza digital | Planificado |
| Marketplace de subproductos valorizables | Planificado |
| Notificaciones push por umbrales de desperdicio | Planificado |
| Export PDF de reportes | Planificado |

---

## 🏗️ Arquitectura

```
┌──────────────────────────────────────────────────────────┐
│                      NAVEGADOR                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Frontend (Vite + TanStack Start + React)          │  │
│  │  Puerto :8080                                      │  │
│  │  • Rutas: dashboard, register, entregas, analytics │  │
│  │  • Asistente Widget (chat flotante global)         │  │
│  │  • Proxy /api → :3000                              │  │
│  └──────────────┬─────────────────────────────────────┘  │
└─────────────────┼────────────────────────────────────────┘
                  │ fetch /api/*
┌─────────────────▼────────────────────────────────────────┐
│  Backend (Next.js 16 — API only)                         │
│  Puerto :3000                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  src/app/api/                                      │  │
│  │  • auth (login, register, session, logout)         │  │
│  │  • restaurantes/[id]/ (CRUD completo)              │  │
│  │  • restaurantes/[id]/asistente (POST)              │  │
│  └──────────────┬─────────────────────────────────────┘  │
│  ┌──────────────▼─────────────────────────────────────┐  │
│  │  src/lib/                                          │  │
│  │  • ai/: provider, flujos, contexto, prompt,        │  │
│  │         dialogo (fallback determinista)             │  │
│  │  • estadisticas, recomendaciones, costo, reporte   │  │
│  │  • prediccion → pythonBridge → predictor/          │  │
│  │  • validation/ (schemas Zod)                       │  │
│  └──────────────┬─────────────────────────────────────┘  │
│  ┌──────────────▼─────────────────────────────────────┐  │
│  │  Prisma 7 + SQLite (better-sqlite3)                │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                  │ spawn
┌─────────────────▼────────────────────────────────────────┐
│  Predictor (Python / scikit-learn)                        │
│  • train.py — entrena RandomForest con historial         │
│  • predict.py — predice demanda por plato                │
│  ⚠️ Directorio INTOCABLE (requisito del reto)            │
└──────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, TanStack Start/Router/Query, Vite 8, Tailwind CSS 4, Recharts, Material Symbols |
| Backend | Next.js 16 (App Router, API routes), Zod 4, jose (JWT) |
| Base de datos | SQLite vía Prisma 7 + better-sqlite3 |
| IA — Chat | Google Gemini (`gemini-2.5-flash`), Groq (`llama-3.3-70b-versatile`), fallback determinista |
| IA — Predicción | Python 3, scikit-learn (RandomForest), joblib |
| Lenguaje | TypeScript 5 (frontend + backend), Python 3 (predictor) |

---

## 📋 Requisitos previos

- **Node.js** ≥ 20 (recomendado: 22 LTS)
- **npm** ≥ 10
- **Python 3** ≥ 3.10 (solo para el módulo de predicciones)
  - Paquetes: `pip install -r predictor/requirements.txt`

---

## Instalación, configuración y ejecución

Consulta **Cómo ejecutar RESTORA en Windows**, al inicio de este documento. Allí están los pasos vigentes para instalar dependencias, crear `.env`, preparar SQLite, iniciar ambos servicios y acceder con el usuario de demostración.

---

## 📂 Estructura de carpetas

```
turiston-project/
├── src/                          # Backend (Next.js 16)
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/             # Login, register, session, logout
│   │   │   ├── health/           # Health check
│   │   │   └── restaurantes/[id]/
│   │   │       ├── asistente/    # POST — Asistente conversacional IA
│   │   │       ├── acciones/     # CRUD acciones aplicadas
│   │   │       ├── colaboradores/# CRUD personal
│   │   │       ├── dashboard/    # KPIs agregados
│   │   │       ├── entregas/     # CRUD entregas/trazabilidad
│   │   │       ├── indicadores/  # 6 indicadores del PDF
│   │   │       ├── operaciones/  # CRUD registros de operación
│   │   │       ├── predicciones/ # Entrenamiento + predicción (Python)
│   │   │       ├── productos/    # CRUD productos con costo
│   │   │       ├── recomendaciones/ # Motor de reglas R1–R10
│   │   │       ├── reportes/     # Generación y listado
│   │   │       ├── residuos/     # CRUD residuos
│   │   │       └── tendencias/   # Tendencia semanal
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   ├── ai/                   # Capa de IA del asistente
│   │   │   ├── provider.ts       # Cascada Gemini → Groq → null
│   │   │   ├── flujos.ts         # Definición de flujos conversacionales
│   │   │   ├── contexto.ts       # Contexto del tenant para el prompt
│   │   │   ├── prompt.ts         # System prompt en español
│   │   │   └── dialogo.ts        # Motor determinista (fallback)
│   │   ├── validation/           # Schemas Zod compartidos
│   │   ├── estadisticas.ts       # KPIs del PDF
│   │   ├── recomendaciones.ts    # Motor R1–R10
│   │   ├── costo.ts              # Conversión kg → S/
│   │   ├── prediccion.ts         # Bridge al predictor Python
│   │   └── ...
│   └── generated/prisma/         # Cliente Prisma generado
├── frontend/                     # Frontend (Vite + TanStack)
│   ├── src/
│   │   ├── routes/               # Páginas de la app
│   │   │   ├── dashboard.tsx     # Panel principal
│   │   │   ├── register.tsx      # Registro multi-ítem
│   │   │   ├── entregas.tsx      # Trazabilidad
│   │   │   ├── catalogo.tsx      # Productos + personal
│   │   │   ├── analytics.tsx     # Indicadores + recomendaciones
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── asistente/        # Widget del chat IA
│   │   │   └── AppShell.tsx      # Layout con navegación
│   │   ├── hooks/
│   │   │   └── useAsistente.ts   # Estado del chat
│   │   └── lib/
│   │       ├── api.ts            # Cliente HTTP tipado
│   │       ├── asistente.ts      # Tipos + flujos del asistente
│   │       └── etiquetas.ts      # Enums en español
│   └── vite.config.ts
├── prisma/
│   ├── schema.prisma             # Modelo de datos (14 tablas)
│   ├── migrations/               # Migraciones SQLite
│   └── seed.ts                   # Datos de demostración
├── predictor/                    # ⚠️ INTOCABLE — Modelo ML
│   ├── train.py
│   ├── predict.py
│   └── requirements.txt
├── .env.example
└── README.md                     # Este archivo
```

---

## 🔄 Flujo de funcionamiento

### Asistente conversacional

```
Usuario abre el widget → Elige flujo (ej. "Operación del turno")
  → Escribe en lenguaje natural: "ayer en la noche vendimos 40 lomo
     saltado y 25 ceviche, botamos 3 kg de arroz por sobreproducción"
  → Backend:
      1. requireSession() — verifica autenticación
      2. Obtiene contexto del restaurante (productos, platos, colaboradores)
      3. Intenta Gemini → si falla, Groq → si falla, modo guiado
      4. Valida la salida con el schema Zod del flujo
      5. Devuelve borrador + campos faltantes + resumen
  → Widget muestra borrador editable
  → Si faltan campos, el asistente pregunta
  → Cuando está completo: resumen + Confirmar / Editar / Cancelar
  → Al confirmar: llama a POST /api/restaurantes/:id/operaciones (endpoint existente)
  → Redirige al historial
```

### Registro manual (formulario)

```
Usuario abre /register → Selecciona fecha, turno
  → Añade ventas (concepto + cantidad + monto) — multi-ítem con "+"
  → Añade desperdicios (producto, categoría, kg, motivo, área, destino) — multi-ítem
  → Envía → POST /api/restaurantes/:id/operaciones
  → Redirige al historial
```

---

## 📸 Capturas de pantalla

> _Espacio reservado para capturas de la aplicación en funcionamiento._

<!-- TODO: Agregar capturas del dashboard, asistente, analytics, entregas -->

---

## 🗺️ Roadmap

Basado en el cuadrante _How_ del Lienzo 7 (PDF TURISTÓN):

| Fase | Funcionalidad | Impacto |
|------|---------------|---------|
| **Now** | ✅ Registro inteligente + cálculo de costos + recomendaciones | Alto |
| **Next** | Integración con POS para captura automática de ventas | Alto |
| **Next** | Balanza digital para pesaje automático de residuos | Medio |
| **Later** | Marketplace de subproductos valorizables | Medio |
| **Later** | Dashboard comparativo entre restaurantes (benchmarking) | Bajo |

---

## 🔮 Mejoras futuras

- **Streaming del asistente** — respuesta del chat en tiempo real (SSE).
- **Voz a texto** — registro hablado usando Web Speech API.
- **OCR de tickets** — escaneo de comprobantes de compra para calcular costos automáticamente.
- **Alertas por WhatsApp** — notificaciones cuando el desperdicio supera umbrales.
- **Multi-idioma** — soporte para inglés/quechua además de español.
- **PWA** — instalable en móvil con funcionalidad offline.

---

## 👥 Créditos

Proyecto desarrollado para el reto **TURISTÓN 2026** — Arequipa, Perú.

| Rol | Nombre |
|-----|--------|
| Desarrollo | Equipo restora |

---

## 📄 Licencia

Proyecto privado. Todos los derechos reservados.
