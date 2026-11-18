#!/usr/bin/env python3
"""
EJERCICIO 9: Sincronización asíncrona mediante Explicit Waits en RESTORA.
Laboratorio 09 - Calidad de Software (UNSA)

Objetivo:
- Utilizar WebDriverWait y Expected Conditions (EC).
- Esperar condiciones dinámicas: visibility_of_element_located, element_to_be_clickable.
- Manejar renderizado asíncrono y respuestas de red sin pausas estáticas arbitrarias.
"""

import sys
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from conftest import obtener_driver, guardar_evidencia, RESTORA_FRONTEND_URL

def test_ejercicio_9():
    print("==================================================")
    print("EJERCICIO 9: Uso de Explicit Waits (WebDriverWait)")
    print("==================================================")

    driver = obtener_driver()
    try:
        url_auth = f"{RESTORA_FRONTEND_URL}/auth"
        print(f"[*] Navegando a: {url_auth}")
        driver.get(url_auth)

        # 1. Espera explícita para la visibilidad del campo de email
        print("[*] Esperando explícitamente a que el input #login-email sea visible (máx 10s)...")
        wait = WebDriverWait(driver, 10, poll_frequency=0.5)
        campo_email = wait.until(
            EC.visibility_of_element_located((By.ID, "login-email")),
            message="El campo email no estuvo visible dentro del tiempo límite"
        )
        print(f"[+] Elemento localizado con éxito: {campo_email.tag_name}#{campo_email.get_attribute('id')}")

        # 2. Espera explícita a que el botón de inicio de sesión sea clickeable
        print("[*] Esperando explícitamente a que el botón submit sea clickeable...")
        boton_submit = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']")),
            message="El botón submit no se volvió clickeable"
        )
        print(f"[+] Botón submit listo para interacción: '{boton_submit.text}'")

        # 3. Espera explícita por la presencia del botón de demo
        print("[*] Esperando presencia del botón de acceso demo...")
        btn_demo = wait.until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(., 'Zap') or contains(., 'demo') or @type='button']"))
        )
        assert btn_demo is not None

        guardar_evidencia(driver, "08_ej9_explicit_wait_restora.png")
        print("[✓] EJERCICIO 9 completado exitosamente.\n")
    except Exception as e:
        print(f"[✗] Error en Ejercicio 9: {e}")
        sys.exit(1)
    finally:
        driver.quit()

if __name__ == "__main__":
    test_ejercicio_9()
