#!/usr/bin/env bash
# Ejecuta la suite completa del Laboratorio 08 sobre RESTORA.
#
# Requisitos:
#   1. La aplicacion debe estar compilada y corriendo en modo produccion:
#        cd 01_APLICACION && npm run build && PYTHON_BIN=... npm start
#   2. Apache JMeter 5.6.x y Java 17+ disponibles en el PATH.
#
# Uso:
#   ./run_all.sh                 # Perfiles estandar optimizados
#   ACADEMIC=1 ./run_all.sh      # Perfiles academicos largos segun guia
set -euo pipefail
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ACADEMIC="${ACADEMIC:-0}"

echo "=========================================================="
echo " Ejecutando Suite JMeter - RESTORA G08 (ACADEMIC=${ACADEMIC})"
echo "=========================================================="

"$BASE_DIR/run_profile.sh" smoke
"$BASE_DIR/run_profile.sh" carga

if [[ "$ACADEMIC" == "1" ]]; then
  STRESS_THREADS=10 STRESS_DURATION=180 "$BASE_DIR/run_profile.sh" estres
  STRESS_THREADS=25 STRESS_DURATION=180 "$BASE_DIR/run_profile.sh" estres
  STRESS_THREADS=50 STRESS_DURATION=180 "$BASE_DIR/run_profile.sh" estres
else
  STRESS_THREADS=10 STRESS_DURATION=45 "$BASE_DIR/run_profile.sh" estres
  STRESS_THREADS=30 STRESS_DURATION=45 "$BASE_DIR/run_profile.sh" estres
  STRESS_THREADS=50 STRESS_DURATION=45 "$BASE_DIR/run_profile.sh" estres
fi

"$BASE_DIR/run_profile.sh" picos
"$BASE_DIR/run_profile.sh" estabilidad

# Consolidar metricas estadisticas
echo "==> Generando resumen consolidado con analizar_jtl.py..."
python3 "$BASE_DIR/PLANES_JMETER/analizar_jtl.py" \
  "$BASE_DIR"/RESULTADOS/smoke.jtl \
  "$BASE_DIR"/RESULTADOS/carga.jtl \
  "$BASE_DIR"/RESULTADOS/estres_*.jtl \
  "$BASE_DIR"/RESULTADOS/picos.jtl \
  "$BASE_DIR"/RESULTADOS/estabilidad.jtl \
  > "$BASE_DIR/RESULTADOS/analisis_jtl.txt"

echo "==> Suite completa. Revisar RESULTADOS/ y RESULTADOS/dashboard_*/index.html"
