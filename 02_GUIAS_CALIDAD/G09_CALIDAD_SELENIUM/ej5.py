#!/usr/bin/env python3
"""
EJERCICIO 5: Interacción con controles Toggle Switch en RESTORA.
Laboratorio 09 - Calidad de Software (UNSA)

Objetivo:
- Localizar componentes switch/toggle interactivos (role='switch').
- Simular clic del usuario para alternar estados activo/inactivo.
- Validar mediante JavaScript y atributos DOM el cambio de estado booleano.
"""

import sys
import time
from selenium.webdriver.common.by import By
from conftest import obtener_driver, guardar_evidencia, RESTORA_PORTAL_URL

def test_ejercicio_5():
    print("==================================================")
    print("EJERCICIO 5: Accionando Toggle Switch en RESTORA")
    print("==================================================")

    driver = obtener_driver()
    try:
        print(f"[*] Navegando a RESTORA: {RESTORA_PORTAL_URL}")
        driver.get(RESTORA_PORTAL_URL)
        time.sleep(1.5)

        # Localizar el switch por ID o rol
        switch_elem = driver.find_element(By.ID, "toggle-alertas-criticas")
        estado_inicial = switch_elem.is_selected()
        print(f"[*] Estado inicial del Toggle: {'ACTIVO (Checked)' if estado_inicial else 'INACTIVO'}")

        # Localizar el contenedor clickeable del switch
        contenedor_switch = driver.find_element(By.XPATH, "//input[@id='toggle-alertas-criticas']/following-sibling::div")
        print("[*] Accionando Toggle Switch (haciendo clic)...")
        contenedor_switch.click()
        time.sleep(1)

        estado_modificado = switch_elem.is_selected()
        print(f"[+] Estado modificado del Toggle: {'ACTIVO (Checked)' if estado_modificado else 'INACTIVO'}")
        assert estado_inicial != estado_modificado, "El estado del toggle switch no cambió"

        # Volver a alternar para demostrar doble acción
        print("[*] Reaccionando Toggle Switch a su estado previo...")
        contenedor_switch.click()
        time.sleep(1)
        estado_final = switch_elem.is_selected()
        print(f"[+] Estado final restablecido: {'ACTIVO (Checked)' if estado_final else 'INACTIVO'}")

        guardar_evidencia(driver, "04_ej5_toggle_switch_restora.png")
        print("[✓] EJERCICIO 5 completado exitosamente.\n")
    except Exception as e:
        print(f"[✗] Error en Ejercicio 5: {e}")
        sys.exit(1)
    finally:
        driver.quit()

if __name__ == "__main__":
    test_ejercicio_5()
