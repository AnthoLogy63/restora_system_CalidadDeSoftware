#!/usr/bin/env bash
# Ejecuta un perfil de prueba de carga de RESTORA con Apache JMeter (modo Non-GUI).
#
# Uso:
#   ./run_profile.sh smoke|carga|estres|picos|estabilidad
#
# Requiere que RESTORA esté escuchando en http://localhost:3000 (npm start).
set -euo pipefail

PERFIL="${1:-smoke}"
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JMX="$BASE_DIR/PLANES_JMETER/RESTORA_Performance_Plan.jmx"
OUT_DIR="$BASE_DIR/RESULTADOS"
JTL="$OUT_DIR/${PERFIL}.jtl"
HTML="$OUT_DIR/dashboard_${PERFIL}"

# Valores por defecto (perfil smoke)
WEB_THREADS=1;   WEB_RAMPUP=1;   WEB_DURATION=15
ML_THREADS=1;    ML_RAMPUP=1;    ML_DURATION=15;  ML_PAUSE=1000

case "$PERFIL" in
  smoke)
    ;;
  carga)
    WEB_THREADS=20; WEB_RAMPUP=20; WEB_DURATION=120
    ML_THREADS=2;   ML_RAMPUP=5;   ML_DURATION=120; ML_PAUSE=500
    ;;
  estres)
    # Escalera de estres: 10 -> 30 -> 50 usuarios (ver run_all.sh)
    WEB_THREADS="${STRESS_THREADS:-10}"; WEB_RAMPUP=10; WEB_DURATION="${STRESS_DURATION:-45}"
    ML_THREADS=2; ML_RAMPUP=5; ML_DURATION="${STRESS_DURATION:-45}"; ML_PAUSE=500
    ;;
  picos)
    WEB_THREADS=60; WEB_RAMPUP=1;  WEB_DURATION=30
    ML_THREADS=4;   ML_RAMPUP=1;   ML_DURATION=30; ML_PAUSE=250
    ;;
  estabilidad)
    WEB_THREADS=10; WEB_RAMPUP=10; WEB_DURATION=300
    ML_THREADS=2;   ML_RAMPUP=5;   ML_DURATION=300; ML_PAUSE=500
    ;;
  *)
    echo "Perfil desconocido: $PERFIL" >&2
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

echo "==> Perfil: $PERFIL (web=${WEB_THREADS} hilos / ml=${ML_THREADS} hilos)${PROFILE_SUFFIX}"

jmeter -n \
  -t "$JMX" \
  -Jweb.threads="$WEB_THREADS" -Jweb.rampup="$WEB_RAMPUP" -Jweb.duration="$WEB_DURATION" \
  -Jml.threads="$ML_THREADS" -Jml.rampup="$ML_RAMPUP" -Jml.duration="$ML_DURATION" -Jml.pause="$ML_PAUSE" \
  -l "$JTL" \
  -e -o "$HTML"

echo "==> Resultados: $JTL"
echo "==> Dashboard:  $HTML/index.html"
