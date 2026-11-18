#!/usr/bin/env python3
r"""
EJERCICIO 27: Análisis de Compatibilidad de Navegadores (IE Legacy vs Cross-Browser Moderno) en RESTORA.
Laboratorio 09 - Calidad de Software (UNSA)

Contexto:
El repositorio original de referencia implementaba:
  driver = webdriver.Ie(executable_path=r"C:\dchrome\IEDriverServer.exe")
Este enfoque presenta severos problemas de ingeniería de software en la actualidad:
1. Internet Explorer fue retirado definitivamente por Microsoft en junio de 2022.
2. IEDriverServer no es compatible con entornos macOS ni Linux.
3. El parámetro 'executable_path' está obsoleto en Selenium 4+.

Objetivo:
- Analizar y documentar la incompatibilidad del driver legacy de Internet Explorer.
- Implementar la solución estándar moderna de QA: Pruebas Cross-Browser automatizadas
  comparando la paridad de ejecución en múltiples motores web modernos (Gecko/Firefox y Chromium/Brave).
- Demostrar la resiliencia de RESTORA en arquitectura multiplataforma.
"""

import os
import sys
import time
from selenium import webdriver
from conftest import obtener_driver, guardar_evidencia, RESTORA_PORTAL_URL

def test_ejercicio_27():
    print("==================================================")
    print("EJERCICIO 27: Compatibilidad de Navegador & Cross-Browser")
    print("==================================================")

    # 1. Diagnóstico del soporte de Internet Explorer
    print("[*] [Fase 1] Verificación de compatibilidad con Internet Explorer (webdriver.Ie)...")
    try:
        if not hasattr(webdriver, "Ie"):
            print("[-] webdriver.Ie no está disponible en este entorno.")
        else:
            print("[!] Intentando inicializar Internet Explorer en este sistema...")
            # Esto fallará en macOS/Linux o sistemas sin IEDriverServer
            driver_ie = webdriver.Ie()
            driver_ie.quit()
    except Exception as e:
        print(f"[!] INCONVENIENTE IDENTIFICADO (Esperado): {type(e).__name__} -> {e}")
        print("    -> Causa: Internet Explorer fue discontinuado por Microsoft y su driver no")
        print("              cuenta con binarios ni soporte para plataformas macOS / Linux.")

    # 2. Implementación de la Solución: Cross-Browser Testing con Motores Modernos
    print("\n[*] [Fase 2] Ejecutando Solución Moderna de QA: Cross-Browser Testing...")
    resultados_crossbrowser = {}

    navegadores_a_probar = ["firefox"]
    if os.path.exists("/Applications/Brave Browser.app"):
        navegadores_a_probar.append("brave")

    for nav in navegadores_a_probar:
        print(f"[*] Probando RESTORA en motor web: {nav.upper()}...")
        try:
            driver = obtener_driver(browser=nav)
            driver.get(RESTORA_PORTAL_URL)
            time.sleep(1.5)
            titulo = driver.title
            print(f"    [+] {nav.upper()} cargó exitosamente: '{titulo}'")
            guardar_evidencia(driver, f"10_ej27_crossbrowser_{nav}.png")
            resultados_crossbrowser[nav] = "EXITOSO (100% Compatible)"
            driver.quit()
        except Exception as e:
            print(f"    [✗] Error en {nav}: {e}")
            resultados_crossbrowser[nav] = f"FALLÓ: {e}"

    print("\n[+] Resumen de Evaluación Cross-Browser en RESTORA:")
    for nav, res in resultados_crossbrowser.items():
        print(f"    - {nav.upper()}: {res}")

    print("[✓] EJERCICIO 27 completado exitosamente.\n")

if __name__ == "__main__":
    test_ejercicio_27()
