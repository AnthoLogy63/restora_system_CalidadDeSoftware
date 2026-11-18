#!/usr/bin/env bash
# Ejecuta la suite completa del Laboratorio 08 sobre RESTORA.
#
# Requisitos:
#   1. La aplicacion debe estar compilada y corriendo en modo produccion:
#        cd 01_APLICACION && npm run build && PYTHON_BIN=... npm start
#   2. Apache JMeter 5.6.x y Java 17+ disponibles en el PATH.
#
# Uso:
#   ./run_all.sh
set -euo pipefail
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$BASE_DIR/run_profile.sh" smoke
"$BASE_DIR/run_profile.sh" carga
STRESS_THREADS=10 STRESS_DURATION=45 "$BASE_DIR/run_profile.sh" estres
STRESS_THREADS=30 STRESS_DURATION=45 "$BASE_DIR/run_profile.sh" estres
STRESS_THREADS=50 STRESS_DURATION=45 "$BASE_DIR/run_profile.sh" estres
"$BASE_DIR/run_profile.sh" picos
"$BASE_DIR/run_profile.sh" estabilidad

# Solo se analizan los .jtl de esta suite: RESULTADOS/ puede contener archivos
# de otros planes JMeter ajenos a este laboratorio.
python3 "$BASE_DIR/PLANES_JMETER/analizar_jtl.py" \
  "$BASE_DIR"/RESULTADOS/smoke.jtl \
  "$BASE_DIR"/RESULTADOS/carga.jtl \
  "$BASE_DIR"/RESULTADOS/estres_10u.jtl \
  "$BASE_DIR"/RESULTADOS/estres_30u.jtl \
  "$BASE_DIR"/RESULTADOS/estres_50u.jtl \
  "$BASE_DIR"/RESULTADOS/picos.jtl \
  "$BASE_DIR"/RESULTADOS/estabilidad.jtl \
  > "$BASE_DIR/RESULTADOS/analisis_jtl.txt"

echo "==> Suite completa. Revisar RESULTADOS/ y RESULTADOS/dashboard_*/index.html"
