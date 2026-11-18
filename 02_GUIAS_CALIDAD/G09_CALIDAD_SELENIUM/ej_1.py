#!/usr/bin/env python3
"""
EJERCICIO 1: Prueba de funcionamiento básico de Selenium en RESTORA.
Laboratorio 09 - Calidad de Software (UNSA)

Objetivo:
- Inicializar el WebDriver.
- Conectarse al sistema RESTORA.
- Validar título y estado de carga de la aplicación.
- Capturar evidencia fotográfica.
"""

import sys
import time
from conftest import obtener_driver, guardar_evidencia, RESTORA_PORTAL_URL

def test_ejercicio_1():
    print("==================================================")
    print("EJERCICIO 1: Prueba de Funcionamiento Selenium")
    print("==================================================")

    driver = obtener_driver()
    try:
        print(f"[*] Navegando a la aplicación RESTORA: {RESTORA_PORTAL_URL}")
        driver.get(RESTORA_PORTAL_URL)
        time.sleep(2)

        titulo = driver.title
        print(f"[+] Título de página obtenido: '{titulo}'")
        assert "restora" in titulo.lower(), f"Título inesperado: {titulo}"

        guardar_evidencia(driver, "01_ej1_conexion_restora.png")
        print("[✓] EJERCICIO 1 completado exitosamente.\n")
    except Exception as e:
        print(f"[✗] Error en Ejercicio 1: {e}")
        sys.exit(1)
    finally:
        driver.quit()

if __name__ == "__main__":
    test_ejercicio_1()
