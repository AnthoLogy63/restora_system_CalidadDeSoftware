#!/usr/bin/env python3
"""
EJERCICIO 4: Búsqueda y manipulación de elementos web mediante XPath en RESTORA.
Laboratorio 09 - Calidad de Software (UNSA)

Objetivo:
- Localizar elementos mediante XPaths relativos y expresiones con predicados.
- Interactuar con botones y campos mediante By.XPATH.
- Validar selectores jerárquicos y basados en texto y atributos.
"""

import sys
import time
from selenium.webdriver.common.by import By
from conftest import obtener_driver, guardar_evidencia, RESTORA_PORTAL_URL

def test_ejercicio_4():
    print("==================================================")
    print("EJERCICIO 4: Localización de Elementos por XPath")
    print("==================================================")

    driver = obtener_driver()
    try:
        print(f"[*] Navegando al portal RESTORA: {RESTORA_PORTAL_URL}")
        driver.get(RESTORA_PORTAL_URL)
        time.sleep(1.5)

        # 1. XPath relativo por atributo @id y @name
        xpath_busqueda = "//input[@id='busqueda-restora' and @name='q']"
        print(f"[*] Localizando campo con XPath: {xpath_busqueda}")
        input_busqueda = driver.find_element(By.XPATH, xpath_busqueda)
        input_busqueda.clear()
        input_busqueda.send_keys("Lomo Saltado - Merma Cocina")

        # 2. XPath con función contains() para textos de navegación
        xpath_enlace_salud = "//a[contains(text(), 'Estado API')]"
        print(f"[*] Verificando enlace con XPath contains(): {xpath_enlace_salud}")
        enlace_salud = driver.find_element(By.XPATH, xpath_enlace_salud)
        assert enlace_salud.is_displayed()

        # 3. XPath para botón de acción
        xpath_boton_guardar = "//button[@id='btn-guardar-registro']"
        print(f"[*] Verificando botón de registro con XPath: {xpath_boton_guardar}")
        btn_guardar = driver.find_element(By.XPATH, xpath_boton_guardar)
        assert btn_guardar.is_displayed()

        # 4. XPath con navegación jerárquica
        xpath_badge = "//section//div[contains(@class, 'bg-white')]//span[contains(@id, 'badge-api-status')]"
        badge_elem = driver.find_element(By.XPATH, xpath_badge)
        print(f"[+] Estado del badge por XPath jerárquico: '{badge_elem.text}'")

        guardar_evidencia(driver, "03_ej4_xpath_restora.png")
        print("[✓] EJERCICIO 4 completado exitosamente.\n")
    except Exception as e:
        print(f"[✗] Error en Ejercicio 4: {e}")
        sys.exit(1)
    finally:
        driver.quit()

if __name__ == "__main__":
    test_ejercicio_4()
