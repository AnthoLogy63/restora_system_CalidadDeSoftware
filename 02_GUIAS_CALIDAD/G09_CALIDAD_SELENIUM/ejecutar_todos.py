#!/usr/bin/env python3
"""
Master Test Runner: Ejecución consolidada de los 10 ejercicios Selenium en RESTORA.
Laboratorio 09 - Calidad de Software (UNSA)
"""

import os
import sys
import time
import subprocess

EJERCICIOS = [
    ("ej_1.py", "EJ 1: Prueba de funcionamiento básico de Selenium"),
    ("ej3.py", "EJ 3: Pruebas unitarias estructuradas con Unittest"),
    ("ej4.py", "EJ 4: Localización de elementos mediante XPath"),
    ("ej5.py", "EJ 5: Interacción con controles Toggle Switch"),
    ("ej6.py", "EJ 6: Manipulación de menús desplegables con Select"),
    ("ej7.py", "EJ 7: Gestión y alternancia de pestañas y ventanas"),
    ("ej8.py", "EJ 8: Navegación de historial del navegador (Back/Forward)"),
    ("ej9.py", "EJ 9: Sincronización asíncrona con Explicit Waits"),
    ("ej10.py", "EJ 10: Configuración global de Implicit Waits"),
    ("ej27.py", "EJ 27: Análisis de compatibilidad IE y Cross-Browser Testing"),
]

DIRECTORIO_ACTUAL = os.path.dirname(os.path.abspath(__file__))
PYTHON_EXEC = sys.executable

def main():
    print("=" * 70)
    print(" SUITE COMPLETA DE PRUEBAS AUTOMATIZADAS CON SELENIUM — RESTORA")
    print(" Laboratorio 09: Calidad de Software - Semestre VIII (UNSA)")
    print("=" * 70)

    total_inicio = time.time()
    resultados = []

    for archivo, descripcion in EJERCICIOS:
        ruta_script = os.path.join(DIRECTORIO_ACTUAL, archivo)
        print(f"\n>>> Ejecutando: {archivo} ({descripcion})...")
        t0 = time.time()
        
        proc = subprocess.run(
            [PYTHON_EXEC, ruta_script],
            cwd=DIRECTORIO_ACTUAL,
            capture_output=True,
            text=True
        )
        duracion = time.time() - t0
        
        print(proc.stdout)
        if proc.stderr:
            print("[STDERR]", proc.stderr)
            
        estado = "PASÓ (OK)" if proc.returncode == 0 else f"FALLÓ (Code {proc.returncode})"
        resultados.append((archivo, descripcion, estado, f"{duracion:.2f}s"))

    tiempo_total = time.time() - total_inicio

    print("\n" + "=" * 80)
    print(f" RESUMEN FINAL DE EJECUCIÓN (Tiempo Total: {tiempo_total:.2f} s)")
    print("=" * 80)
    print(f"{'Archivo':<12} | {'Descripción':<46} | {'Estado':<12} | {'Tiempo':<8}")
    print("-" * 80)
    for arch, desc, est, dur in resultados:
        print(f"{arch:<12} | {desc:<46} | {est:<12} | {dur:<8}")
    print("=" * 80)

    # Verificar evidencias generadas
    carpeta_evidencias = os.path.join(DIRECTORIO_ACTUAL, "EVIDENCIAS")
    archivos_evidencias = os.listdir(carpeta_evidencias)
    print(f"\n[+] Total de capturas de evidencia generadas en EVIDENCIAS/: {len(archivos_evidencias)}")
    for ev in sorted(archivos_evidencias):
        print(f"    - {ev}")

if __name__ == "__main__":
    main()
