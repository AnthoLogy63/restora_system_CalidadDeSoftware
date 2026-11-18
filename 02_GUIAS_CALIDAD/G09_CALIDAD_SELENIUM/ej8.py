#!/usr/bin/env python3
"""
EJERCICIO 8: Navegación por el historial del navegador (atrás/adelante) en RESTORA.
Laboratorio 09 - Calidad de Software (UNSA)

Objetivo:
- Navegar a través de diferentes rutas y módulos de RESTORA.
- Utilizar driver.back() para retroceder en el historial de navegación.
- Utilizar driver.forward() para avanzar en el historial.
- Emplear driver.refresh() para actualizar la vista activa.
- Validar sincronía de URLs y DOM en cada transición.
"""

import sys
import time
from conftest import obtener_driver, guardar_evidencia, RESTORA_FRONTEND_URL

def test_ejercicio_8():
    print("==================================================")
    print("EJERCICIO 8: Navegación de Historial (Back/Forward)")
    print("==================================================")

    driver = obtener_driver()
    try:
        url_home = f"{RESTORA_FRONTEND_URL}/"
        url_auth = f"{RESTORA_FRONTEND_URL}/auth"

        # 1. Navegar a Home
        print(f"[*] [Paso 1] Navegando a Home: {url_home}")
        driver.get(url_home)
        time.sleep(2)
        print(f"    URL actual: {driver.current_url}")

        # 2. Navegar a Auth
        print(f"[*] [Paso 2] Navegando a Auth: {url_auth}")
        driver.get(url_auth)
        time.sleep(2)
        print(f"    URL actual: {driver.current_url}")
        assert "auth" in driver.current_url

        # 3. Retroceder en el historial (Back)
        print("[*] [Paso 3] Ejecutando driver.back() -> Volviendo a Home...")
        driver.back()
        time.sleep(2)
        print(f"    URL actual tras retroceso: {driver.current_url}")
        assert "auth" not in driver.current_url, "No se retrocedió correctamente"

        # 4. Avanzar en el historial (Forward)
        print("[*] [Paso 4] Ejecutando driver.forward() -> Avanzando a Auth...")
        driver.forward()
        time.sleep(2)
        print(f"    URL actual tras avance: {driver.current_url}")
        assert "auth" in driver.current_url, "No se avanzó correctamente"

        # 5. Refrescar página (Refresh)
        print("[*] [Paso 5] Ejecutando driver.refresh() -> Recargando...")
        driver.refresh()
        time.sleep(1.5)
        print("    Página refrescada exitosamente.")

        guardar_evidencia(driver, "07_ej8_navegacion_historial_restora.png")
        print("[✓] EJERCICIO 8 completado exitosamente.\n")
    except Exception as e:
        print(f"[✗] Error en Ejercicio 8: {e}")
        sys.exit(1)
    finally:
        driver.quit()

if __name__ == "__main__":
    test_ejercicio_8()
