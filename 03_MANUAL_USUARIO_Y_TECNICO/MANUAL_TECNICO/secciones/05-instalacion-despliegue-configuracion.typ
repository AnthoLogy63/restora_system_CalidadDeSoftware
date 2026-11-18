= Instalación, Configuración y Despliegue

Esta sección proporciona las instrucciones técnicas paso a paso para el aprovisionamiento, compilación, despliegue y puesta en marcha de RESTORA en entornos de desarrollo, pruebas y producción controlada.

== Requisitos del Sistema

=== Requisitos de Hardware
- *Procesador (CPU):* 2 núcleos físicos de 64 bits (recomendado 4 núcleos para soporte de inferencia y pruebas concurrentes de carga).
- *Memoria RAM:* Mínimo 4 GB (recomendado 8 GB para ejecución simultánea del backend Next.js, proxy Vite, suite Vitest y navegador Selenium).
- *Almacenamiento en Disco:* Mínimo 2 GB de espacio libre (incluyendo dependencias de Node.js, librerías de Python y logs de prueba).
- *Red:* Conectividad TCP/IP local con puertos libres `3000` (Backend API) y `8080` (Frontend Web).

=== Requisitos de Software
- *Sistema Operativo:* Windows 10/11 (PowerShell 7+), macOS 12+ o Linux (Ubuntu 22.04 LTS o superior).
- *Node.js:* Versión 20.x o superior (se recomienda *Node.js 22 LTS*).
- *Gestor de Paquetes:* npm versión 10.x o superior.
- *Python:* Versión 3.10 o superior (indispensable para el módulo de predicción y las pruebas de Selenium).
- *Git / Subversion:* Clientes de control de versiones para clonación e inspección de etiquetas de versión.

== Configuración del Entorno (`.env`)

En la raíz del proyecto backend (`01_APLICACION`), cree el archivo `.env` tomando como base `.env.example`:

```bash
# Copiar plantilla en Linux / macOS
cp .env.example .env

# En Windows (PowerShell)
Copy-Item .env.example .env
```

El archivo `.env` debe configurarse con los siguientes parámetros:

```env
# URL de conexión a la base de datos relacional SQLite
DATABASE_URL="file:./dev.db"

# Clave secreta para firma criptográfica de tokens JWT (reemplazar en producción)
AUTH_SECRET="restora-super-secret-key-calidad-software-2026-unsa"

# Ruta absoluta o relativa al ejecutable de Python del entorno virtual
# En Linux / macOS:
PYTHON_BIN="predictor/.venv/bin/python"
# En Windows (PowerShell):
# PYTHON_BIN="predictor/.venv/Scripts/python.exe"

# Proveedores de IA conversacional (opcionales; si están vacíos opera el modo determinista)
GEMINI_API_KEY=""
GROQ_API_KEY=""
```

== Procedimiento de Instalación Paso a Paso

=== 1. Instalación de Dependencias de Node.js
Abra una terminal en la carpeta `01_APLICACION` y ejecute:

```bash
# 1.1 Instalar dependencias del Backend API
npm ci

# 1.2 Instalar dependencias del Frontend Web
cd frontend
npm ci
cd ..
```

=== 2. Inicialización de la Base de Datos Relacional (Prisma)
Genere los clientes tipados y aplique las migraciones estructurales sobre SQLite:

```bash
# 2.1 Generar el cliente de acceso de Prisma
npx prisma generate

# 2.2 Aplicar el historial de migraciones DDL a la base dev.db
npx prisma migrate deploy

# 2.3 Poblar con datos de prueba, catálogos y usuario de demostración
npx prisma db seed
```

> *Credenciales de Demostración Cargadas por el Seed:*
> - *Correo electrónico:* `demo@circularaqp.pe`
> - *Contraseña:* `demo1234`
> - *Establecimiento:* El Buen Sabor AQP

=== 3. Preparación del Entorno Virtual de Machine Learning
Para habilitar el predictor de demanda en Python:

```bash
# En Linux / macOS:
python3 -m venv predictor/.venv
./predictor/.venv/bin/pip install -r predictor/requirements.txt

# En Windows (PowerShell):
python -m venv predictor\.venv
.\predictor\.venv\Scripts\python.exe -m pip install -r predictor\requirements.txt
```

== Ejecución en Modo Desarrollo

Para operar el sistema localmente se requiere mantener dos terminales en ejecución paralela:

- *Terminal 1 (Backend API REST):*
  ```bash
  cd 01_APLICACION
  npm run dev
  ```
  El backend iniciará en `http://localhost:3000`.

- *Terminal 2 (Frontend React):*
  ```bash
  cd 01_APLICACION/frontend
  npm run dev -- --port 8080
  ```
  La interfaz web estará accesible en `http://localhost:8080`.

Compruebe la disponibilidad de la API visitando `http://localhost:3000/api/health`, el cual responderá:
```json
{ "status": "ok", "timestamp": "2026-11-18T14:00:00.000Z" }
```

== Compilación y Preparación para Producción

Para generar los binarios optimizados y distribuciones de producción:

```bash
# Compilar backend Next.js
npm run build

# Compilar frontend TanStack / Vite
cd frontend && npm run build && cd ..
```

== Diagnóstico y Resolución de Problemas Frecuentes

#table(
  columns: (1.8fr, 2fr, 2.5fr),
  table.header([*Síntoma / Error*], [*Causa Raíz Probable*], [*Acción Correctiva de Ingeniería*]),
  [`Cannot find module '@prisma/client'`], [El cliente Prisma no ha sido generado tras instalar dependencias.], [Ejecutar `npx prisma generate` desde `01_APLICACION`.],
  [`SQLite: no such table`], [No se han aplicado las migraciones DDL en `dev.db`.], [Ejecutar `npx prisma migrate deploy`.],
  [`Port 3000 is already in use`], [Existe una instancia previa del backend o de otro proceso ocupando el puerto.], [Detener el proceso con `kill -9 $(lsof -t -i:3000)` en Unix o `Stop-Process` en PowerShell.],
  [`Predictor falló con código 127`], [El backend no encuentra el intérprete de Python configurado en `PYTHON_BIN`.], [Verificar que `predictor/.venv` existe y la ruta en `.env` coincide exactamente con el ejecutable.],
  [`401 Unauthorized recurrente`], [La cookie de sesión no viaja entre frontend y backend.], [Asegurarse de que el frontend se ejecuta en el puerto 8080 usando el proxy Vite hacia localhost:3000.]
)
