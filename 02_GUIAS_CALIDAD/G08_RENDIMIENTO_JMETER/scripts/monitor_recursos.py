#!/usr/bin/env python3
"""Monitorea el uso de CPU y memoria (RSS) del proceso servidor de RESTORA
(Next.js / Node.js) y guarda las muestras en formato CSV para analisis de rendimiento.

Uso:
    python3 monitor_recursos.py [archivo_salida.csv] [intervalo_segundos]
"""

import sys
import time
import datetime
import subprocess
import os

OUTPUT_CSV = sys.argv[1] if len(sys.argv) > 1 else "RESULTADOS/recursos_servidor.csv"
INTERVAL = float(sys.argv[2]) if len(sys.argv) > 2 else 5.0

def obtener_metricas_node():
    """Busca el proceso de Node.js correspondiente a RESTORA y extrae CPU y RSS."""
    try:
        # En macOS / Linux, ps aux filtra por node
        cmd = ["ps", "-eo", "pid,%cpu,rss,command"]
        res = subprocess.check_output(cmd, text=True)
        total_cpu = 0.0
        total_rss_kb = 0.0
        found = False

        for line in res.splitlines():
            partes = line.strip().split(None, 3)
            if len(partes) < 4:
                continue
            pid, cpu_str, rss_str, comm = partes
            if "node" in comm.lower() and ("start" in comm or "next" in comm or "3000" in comm or "server" in comm):
                found = True
                try:
                    total_cpu += float(cpu_str)
                    total_rss_kb += float(rss_str)
                except ValueError:
                    pass

        if not found:
            # Fallback a cualquier proceso node activo
            for line in res.splitlines():
                partes = line.strip().split(None, 3)
                if len(partes) >= 4 and "node" in partes[3].lower():
                    try:
                        total_cpu += float(partes[1])
                        total_rss_kb += float(partes[2])
                        found = True
                    except ValueError:
                        pass

        rss_mb = round(total_rss_kb / 1024.0, 1)
        return round(total_cpu, 1), rss_mb
    except Exception as e:
        return 0.0, 0.0

def main():
    os.makedirs(os.path.dirname(os.path.abspath(OUTPUT_CSV)), exist_ok=True)
    nuevo_archivo = not os.path.exists(OUTPUT_CSV) or os.path.getsize(OUTPUT_CSV) == 0

    with open(OUTPUT_CSV, "a", encoding="utf-8") as f:
        if nuevo_archivo:
            f.write("timestamp,epoch,cpu_pct,rss_mb\n")
            f.flush()

        print(f"[*] Monitoreando recursos hacia {OUTPUT_CSV} cada {INTERVAL}s (Ctrl+C para detener)...")
        try:
            while True:
                now = datetime.datetime.now()
                ts_str = now.strftime("%H:%M:%S")
                epoch_str = str(int(time.time()))
                cpu, rss = obtener_metricas_node()
                f.write(f"{ts_str},{epoch_str},{cpu},{rss}\n")
                f.flush()
                time.sleep(INTERVAL)
        except KeyboardInterrupt:
            print("\n[*] Monitoreo finalizado.")

if __name__ == "__main__":
    main()
