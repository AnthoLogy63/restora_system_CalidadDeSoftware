# README — G08 Pruebas de Rendimiento con Apache JMeter

Guía de reproducción del Laboratorio 08 (Calidad de Software, UNSA 2026-B) sobre
**RESTORA / CircularAQP**.

## 1. Requisitos

| Herramienta | Versión usada | Verificación |
|---|---|---|
| Node.js | v26.9.0 | `node -v` |
| npm | 11.19.1 | `npm -v` |
| Java (OpenJDK) | 21.0.12.1 | `java -version` |
| Apache JMeter | 5.6.3 | `jmeter --version` |
| Python | 3.14 (venv del predictor) | `predictor/.venv/bin/python -V` |

> JMeter se instala con `brew install jmeter` (macOS). El ejecutable queda en
> `/opt/homebrew/bin/jmeter`.

## 2. Preparar la aplicación (modo producción)

```bash
cd 01_APLICACION
npm install
npx prisma db push
npx prisma db seed          # crea demo@circularaqp.pe / demo1234

# Dependencias del motor de predicción (una sola vez)
python3.14 -m venv predictor/.venv
predictor/.venv/bin/pip install -r predictor/requirements.txt

npm run build
PYTHON_BIN="$PWD/predictor/.venv/bin/python" PORT=3000 npm start
```

> **Importante:** en modo producción la cookie de sesión se emite con el flag
> `Secure`. El plan JMeter la obtiene del encabezado `Set-Cookie` y la reenvía
> manualmente en la cabecera `Cookie`, por lo que las pruebas funcionan sobre
> HTTP local sin necesidad de TLS.

Verificación rápida en otra terminal:

```bash
curl -s http://localhost:3000/api/health          # {"status":"ok"}
```

## 3. Ejecutar la suite completa

```bash
cd 02_GUIAS_CALIDAD/G08_RENDIMIENTO_JMETER
./run_all.sh
```

O un perfil concreto:

```bash
./run_profile.sh smoke
./run_profile.sh carga
./run_profile.sh picos
./run_profile.sh estabilidad
STRESS_THREADS=30 STRESS_DURATION=45 ./run_profile.sh estres
```

Cada ejecución deja:

- `RESULTADOS/<perfil>.jtl` — muestras crudas (CSV de JMeter).
- `RESULTADOS/dashboard_<perfil>/index.html` — dashboard HTML oficial.
- `RESULTADOS/analisis_jtl.txt` — resumen estadístico (script `analizar_jtl.py`).

## 4. Perfiles configurados

| Perfil | Hilos web | Ramp-up | Duración | Hilos ML | Pausa ML |
|---|---:|---:|---:|---:|---:|
| `smoke` | 1 | 1 s | 15 s | 1 | 1000 ms |
| `carga` | 20 | 20 s | 120 s | 2 | 500 ms |
| `estres` | 10 / 30 / 50 | 10 s | 45 s c/u | 2 | 500 ms |
| `picos` | 60 | 1 s | 30 s | 4 | 250 ms |
| `estabilidad` | 10 | 10 s | 300 s | 2 | 500 ms |

Todos los parámetros se pueden sobrescribir por CLI, por ejemplo:

```bash
jmeter -n -t PLANES_JMETER/RESTORA_Performance_Plan.jmx \
  -Jweb.threads=15 -Jweb.duration=60 -Jml.threads=1 -Jml.pause=1000 \
  -l RESULTADOS/prueba.jtl -e -o RESULTADOS/dashboard_prueba
```

## 5. Estructura de archivos

```
G08_RENDIMIENTO_JMETER/
├── PLANES_JMETER/
│   ├── RESTORA_Performance_Plan.jmx   # plan parametrizado (2 Thread Groups)
│   └── analizar_jtl.py                # cálculo de percentiles y throughput
├── RESULTADOS/                        # .jtl + dashboards HTML
├── EVIDENCIAS/                        # capturas para el informe
├── run_profile.sh                     # ejecuta un perfil
├── run_all.sh                         # ejecuta toda la suite
└── GUIA_LAB08_RENDIMIENTO.md          # contenido para el informe
```

## 6. Solución de problemas

| Síntoma | Causa | Solución |
|---|---|---|
| Todos los endpoints protegidos devuelven `401` | La cookie `Secure` no se envía por HTTP | El plan ya extrae `Set-Cookie` y envía la cabecera `Cookie`; verificar que el Regex Extractor esté habilitado |
| `POST /predicciones` devuelve `201` con `resultado: null` | El subproceso Python falló | Verificar `PYTHON_BIN` y `predictor/.venv` |
| Primer `POST /predicciones` tarda > 3 s | Entrenamiento en frío del modelo | Ejecutar `smoke` antes de medir; el modelo queda cacheado en `predictor/models/` |
| `403 No autorizado para este restaurante` | Se usó un `restauranteId` distinto al de la sesión | El plan extrae el id real desde el login; no hardcodear |
