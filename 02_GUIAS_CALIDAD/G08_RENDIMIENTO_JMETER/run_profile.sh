#!/usr/bin/env bash
# Ejecuta un perfil de prueba de carga de RESTORA con Apache JMeter (modo Non-GUI).
#
# Uso:
#   ./run_profile.sh smoke|carga|estres|picos|estabilidad|antes|despues
#
# Si ACADEMIC=1, usa las duraciones exactas de la guia academica:
#   - carga: 10 usuarios x 300 s (5 min), rampa 30 s
#   - estres: 10, 25 y 50 usuarios x 180 s (3 min c/u)
#   - picos: 10 a 50 usuarios y retorno a 10 con transicion documentada
#   - estabilidad: 10 usuarios x 900 s (15 min)
#
# Requiere que RESTORA esté escuchando en http://localhost:3000 (npm start).
set -euo pipefail

PERFIL="${1:-smoke}"
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JMX="$BASE_DIR/PLANES_JMETER/RESTORA_Performance_Plan.jmx"
OUT_DIR="$BASE_DIR/RESULTADOS"
JTL="$OUT_DIR/${PERFIL}.jtl"
HTML="$OUT_DIR/dashboard_${PERFIL}"
ACADEMIC="${ACADEMIC:-0}"

# Valores por defecto (perfil smoke)
WEB_THREADS=1;   WEB_RAMPUP=1;   WEB_DURATION=15
ML_THREADS=1;    ML_RAMPUP=1;    ML_DURATION=15;  ML_PAUSE=1000

case "$PERFIL" in
  smoke)
    WEB_THREADS=1; WEB_RAMPUP=1; WEB_DURATION=15
    ML_THREADS=1;  ML_RAMPUP=1;  ML_DURATION=15; ML_PAUSE=1000
    ;;
  carga)
    if [[ "$ACADEMIC" == "1" ]]; then
      WEB_THREADS=10; WEB_RAMPUP=30; WEB_DURATION=300
      ML_THREADS=2;   ML_RAMPUP=10;  ML_DURATION=300; ML_PAUSE=500
    else
      WEB_THREADS="${LOAD_THREADS:-20}"; WEB_RAMPUP="${LOAD_RAMPUP:-20}"; WEB_DURATION="${LOAD_DURATION:-120}"
      ML_THREADS=2;   ML_RAMPUP=5;   ML_DURATION="${LOAD_DURATION:-120}"; ML_PAUSE=500
    fi
    ;;
  estres)
    if [[ "$ACADEMIC" == "1" ]]; then
      WEB_THREADS="${STRESS_THREADS:-10}"; WEB_RAMPUP=15; WEB_DURATION="${STRESS_DURATION:-180}"
      ML_THREADS=2; ML_RAMPUP=5; ML_DURATION="${STRESS_DURATION:-180}"; ML_PAUSE=500
    else
      WEB_THREADS="${STRESS_THREADS:-10}"; WEB_RAMPUP=10; WEB_DURATION="${STRESS_DURATION:-45}"
      ML_THREADS=2; ML_RAMPUP=5; ML_DURATION="${STRESS_DURATION:-45}"; ML_PAUSE=500
    fi
    ;;
  picos)
    if [[ "$ACADEMIC" == "1" ]]; then
      # Pico academico: rampa progresiva de 10 a 50 y retorno a 10
      WEB_THREADS=50; WEB_RAMPUP=30; WEB_DURATION=180
      ML_THREADS=3;   ML_RAMPUP=10;  ML_DURATION=180; ML_PAUSE=300
    else
      WEB_THREADS=60; WEB_RAMPUP=1;  WEB_DURATION=30
      ML_THREADS=4;   ML_RAMPUP=1;   ML_DURATION=30; ML_PAUSE=250
    fi
    ;;
  estabilidad)
    if [[ "$ACADEMIC" == "1" ]]; then
      WEB_THREADS=10; WEB_RAMPUP=30; WEB_DURATION=900
      ML_THREADS=2;   ML_RAMPUP=10;  ML_DURATION=900; ML_PAUSE=500
    else
      WEB_THREADS=10; WEB_RAMPUP=10; WEB_DURATION=300
      ML_THREADS=2;   ML_RAMPUP=5;   ML_DURATION=300; ML_PAUSE=500
    fi
    ;;
  antes|despues)
    # Perfil comparativo para la evaluacion del cuello de botella (ML / predicciones)
    WEB_THREADS=10; WEB_RAMPUP=5;  WEB_DURATION=45
    ML_THREADS=5;   ML_RAMPUP=5;   ML_DURATION=45; ML_PAUSE=200
    ;;
  *)
    echo "Perfil desconocido: $PERFIL" >&2
    echo "Uso: $0 smoke|carga|estres|picos|estabilidad|antes|despues" >&2
    exit 1
    ;;
esac

PROFILE_SUFFIX=""
if [[ "$PERFIL" == "estres" ]]; then
  PROFILE_SUFFIX="_${WEB_THREADS}u"
  JTL="$OUT_DIR/estres_${WEB_THREADS}u.jtl"
  HTML="$OUT_DIR/dashboard_estres_${WEB_THREADS}u"
fi

mkdir -p "$OUT_DIR"
rm -rf "$HTML" "$JTL"

echo "==> Perfil: $PERFIL (web=${WEB_THREADS} hilos, rampa=${WEB_RAMPUP}s, duracion=${WEB_DURATION}s | ml=${ML_THREADS} hilos)${PROFILE_SUFFIX}"

jmeter -n \
  -t "$JMX" \
  -Jweb.threads="$WEB_THREADS" -Jweb.rampup="$WEB_RAMPUP" -Jweb.duration="$WEB_DURATION" \
  -Jml.threads="$ML_THREADS" -Jml.rampup="$ML_RAMPUP" -Jml.duration="$ML_DURATION" -Jml.pause="$ML_PAUSE" \
  -l "$JTL" \
  -e -o "$HTML"

echo "==> Resultados guardados en: $JTL"
echo "==> Dashboard HTML generado: $HTML/index.html"
