#!/usr/bin/env python3
"""
EJERCICIO 10: Configuración y uso de Implicit Waits en RESTORA.
Laboratorio 09 - Calidad de Software (UNSA)

Objetivo:
- Configurar driver.implicitly_wait(segundos) a nivel de sesión del WebDriver.
- Demostrar cómo Selenium sondea periódicamente el DOM antes de lanzar NoSuchElementException.
- Probar la resolución resiliente de elementos en una Single Page Application (SPA).
"""

import sys
import time
from selenium.webdriver.common.by import By
from conftest import obtener_driver, guardar_evidencia, RESTORA_PORTAL_URL

def test_ejercicio_10():
    print("==================================================")
    print("EJERCICIO 10: Configuración de Implicit Wait")
    print("==================================================")

    driver = obtener_driver()
    try:
        # Configuración de Implicit Wait global de 8 segundos
        tiempo_espera = 8
        print(f"[*] Configurando driver.implicitly_wait({tiempo_espera}) segundos a nivel de sesión...")
        driver.implicitly_wait(tiempo_espera)

        inicio = time.time()
        print(f"[*] Navegando a RESTORA: {RESTORA_PORTAL_URL}")
        driver.get(RESTORA_PORTAL_URL)

        # Buscar elementos que pueden demorar en hidratarse
        print("[*] Buscando elemento #busqueda-restora con implicit wait activo...")
        elem_busqueda = driver.find_element(By.ID, "busqueda-restora")
        duracion = time.time() - inicio
        print(f"[+] Elemento encontrado en {duracion:.2f} segundos: {elem_busqueda.tag_name}")

        print("[*] Buscando múltiples elementos con find_elements()...")
        badges = driver.find_elements(By.XPATH, "//span[contains(@id, 'badge-')]")
        print(f"[+] Badges de estado del sistema detectados ({len(badges)}):")
        for b in badges:
            print(f"    - ID: {b.get_attribute('id')} | Texto: {b.text}")

        assert len(badges) >= 3, "No se encontraron los badges esperados"

        guardar_evidencia(driver, "09_ej10_implicit_wait_restora.png")
        print("[✓] EJERCICIO 10 completado exitosamente.\n")
    except Exception as e:
        print(f"[✗] Error en Ejercicio 10: {e}")
        sys.exit(1)
    finally:
        driver.quit()

if __name__ == "__main__":
    test_ejercicio_10()
