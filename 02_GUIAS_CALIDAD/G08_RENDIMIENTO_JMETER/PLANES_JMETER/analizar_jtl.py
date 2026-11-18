#!/usr/bin/env python3
"""Analiza los archivos .jtl (CSV) generados por Apache JMeter y produce un resumen
estadistico por peticion y por escenario, en formato Markdown y JSON.

Uso:
    python3 analizar_jtl.py RESULTADOS/*.jtl
"""

from __future__ import annotations

import csv
import glob
import json
import os
import sys
from collections import defaultdict
from statistics import median


def percentil(valores: list[float], p: float) -> float:
    """Percentil con interpolacion lineal (mismo criterio que el dashboard de JMeter)."""
    if not valores:
        return 0.0
    ordenados = sorted(valores)
    if len(ordenados) == 1:
        return ordenados[0]
    k = (len(ordenados) - 1) * (p / 100.0)
    f = int(k)
    c = min(f + 1, len(ordenados) - 1)
    if f == c:
        return ordenados[f]
    return ordenados[f] + (ordenados[c] - ordenados[f]) * (k - f)


def leer_jtl(ruta: str) -> list[dict]:
    filas: list[dict] = []
    with open(ruta, newline="", encoding="utf-8", errors="replace") as fh:
        for fila in csv.DictReader(fh):
            try:
                fila["elapsed"] = float(fila["elapsed"])
                fila["timeStamp"] = float(fila["timeStamp"])
                fila["bytes"] = float(fila.get("bytes") or 0)
            except (KeyError, ValueError):
                continue
            filas.append(fila)
    return filas


def resumir(filas: list[dict]) -> dict:
    tiempos = [f["elapsed"] for f in filas]
    codigos: dict[str, int] = defaultdict(int)
    errores = 0
    for f in filas:
        codigos[f["responseCode"]] += 1
        if f["success"].lower() != "true":
            errores += 1

    inicio = min(f["timeStamp"] for f in filas)
    fin = max(f["timeStamp"] + f["elapsed"] for f in filas)
    duracion_s = max((fin - inicio) / 1000.0, 0.001)

    # APDEX con umbrales T = 500 ms y F = 1500 ms (valores por defecto de JMeter).
    t_umbral, f_umbral = 500.0, 1500.0
    satisfechos = sum(1 for t in tiempos if t <= t_umbral)
    tolerantes = sum(1 for t in tiempos if t_umbral < t <= f_umbral)
    apdex = (satisfechos + tolerantes / 2.0) / len(tiempos) if tiempos else 0.0

    return {
        "apdex": round(apdex, 2),
        "muestras": len(filas),
        "errores": errores,
        "error_pct": round(errores * 100.0 / len(filas), 2) if filas else 0.0,
        "promedio_ms": round(sum(tiempos) / len(tiempos), 2) if tiempos else 0.0,
        "mediana_ms": round(median(tiempos), 2) if tiempos else 0.0,
        "p90_ms": round(percentil(tiempos, 90), 2),
        "p95_ms": round(percentil(tiempos, 95), 2),
        "p99_ms": round(percentil(tiempos, 99), 2),
        "min_ms": round(min(tiempos), 2) if tiempos else 0.0,
        "max_ms": round(max(tiempos), 2) if tiempos else 0.0,
        "throughput_rps": round(len(filas) / duracion_s, 2),
        "bytes_promedio": round(sum(f["bytes"] for f in filas) / len(filas), 0) if filas else 0,
        "codigos": dict(sorted(codigos.items())),
        "duracion_s": round(duracion_s, 1),
    }


def main() -> None:
    rutas = sys.argv[1:] or sorted(glob.glob(os.path.join("RESULTADOS", "*.jtl")))
    salida: dict[str, dict] = {}

    for ruta in rutas:
        filas = leer_jtl(ruta)
        if not filas:
            continue
        por_label: dict[str, list[dict]] = defaultdict(list)
        for f in filas:
            por_label[f["label"]].append(f)
        salida[os.path.basename(ruta)] = {
            "global": resumir(filas),
            "por_peticion": {label: resumir(fl) for label, fl in sorted(por_label.items())},
        }

    print(json.dumps(salida, indent=2, ensure_ascii=False))

    print("\n## Resumen por archivo\n")
    print("| Archivo | Muestras | Errores % | Promedio | p90 | p95 | p99 | Throughput | APDEX |")
    print("|---|---:|---:|---:|---:|---:|---:|---:|---:|")
    for archivo, datos in salida.items():
        g = datos["global"]
        print(
            f"| {archivo} | {g['muestras']} | {g['error_pct']} | {g['promedio_ms']} | "
            f"{g['p90_ms']} | {g['p95_ms']} | {g['p99_ms']} | {g['throughput_rps']} | {g['apdex']} |"
        )

    print("\n## Detalle por peticion\n")
    for archivo, datos in salida.items():
        print(f"\n### {archivo}\n")
        print("| Peticion | Muestras | Error % | Promedio | p90 | p95 | p99 | Max | Throughput | APDEX |")
        print("|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|")
        for label, g in datos["por_peticion"].items():
            print(
                f"| {label} | {g['muestras']} | {g['error_pct']} | {g['promedio_ms']} | "
                f"{g['p90_ms']} | {g['p95_ms']} | {g['p99_ms']} | {g['max_ms']} | {g['throughput_rps']} | {g['apdex']} |"
            )


if __name__ == "__main__":
    main()
