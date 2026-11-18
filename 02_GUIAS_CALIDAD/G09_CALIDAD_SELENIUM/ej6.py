#!/usr/bin/env python3
"""
EJERCICIO 6: Manejo de menús desplegables mediante la clase Select en RESTORA.
Laboratorio 09 - Calidad de Software (UNSA)

Objetivo:
- Emplear la clase Select de Selenium (selenium.webdriver.support.ui.Select).
- Seleccionar opciones por valor (value), por texto visible y por índice.
- Validar las opciones disponibles y la opción seleccionada.
"""

import sys
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from conftest import obtener_driver, guardar_evidencia, RESTORA_PORTAL_URL

def test_ejercicio_6():
    print("==================================================")
    print("EJERCICIO 6: Manejo de Select / Dropdowns en RESTORA")
    print("==================================================")

    driver = obtener_driver()
    try:
        print(f"[*] Navegando a RESTORA: {RESTORA_PORTAL_URL}")
        driver.get(RESTORA_PORTAL_URL)
        time.sleep(1.5)

        select_element = driver.find_element(By.ID, "select-tipo-residuo")
        select_residuo = Select(select_element)

        opciones = [op.text for op in select_residuo.options]
        print(f"[*] Opciones disponibles en el select ({len(opciones)}): {opciones}")

        # 1. Selección por valor
        print("[*] Seleccionando por valor: 'ACEITE_USADO'")
        select_residuo.select_by_value("ACEITE_USADO")
        time.sleep(1)
        seleccionado_1 = select_residuo.first_selected_option.text
        print(f"[+] Opción activa: '{seleccionado_1}'")
        assert "Aceite Vegetal Usado" in seleccionado_1

        # 2. Selección por texto visible
        print("[*] Seleccionando por texto visible: 'Materia Orgánica de Cocina'")
        select_residuo.select_by_visible_text("Materia Orgánica de Cocina")
        time.sleep(1)
        seleccionado_2 = select_residuo.first_selected_option.get_attribute("value")
        print(f"[+] Valor activo: '{seleccionado_2}'")
        assert seleccionado_2 == "ORGANICO_COCINA"

        # 3. Selección por índice
        print("[*] Seleccionando por índice 3 ('Plástico y Embalaje Reciclable')...")
        select_residuo.select_by_index(3)
        time.sleep(1)
        seleccionado_3 = select_residuo.first_selected_option.text
        print(f"[+] Opción activa: '{seleccionado_3}'")

        guardar_evidencia(driver, "05_ej6_select_restora.png")
        print("[✓] EJERCICIO 6 completado exitosamente.\n")
    except Exception as e:
        print(f"[✗] Error en Ejercicio 6: {e}")
        sys.exit(1)
    finally:
        driver.quit()

if __name__ == "__main__":
    test_ejercicio_6()
