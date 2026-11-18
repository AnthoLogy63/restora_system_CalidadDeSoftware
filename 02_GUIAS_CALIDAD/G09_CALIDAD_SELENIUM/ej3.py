#!/usr/bin/env python3
"""
EJERCICIO 3: Pruebas automatizadas usando el framework Unittest con Selenium en RESTORA.
Laboratorio 09 - Calidad de Software (UNSA)

Objetivo:
- Integrar Selenium con el framework unittest (setUp, tearDown, test methods).
- Emplear aserciones estándar de testing (assertIn, assertTrue, assertEqual).
- Verificar formulario de autenticación y elementos clave de RESTORA.
"""

import unittest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from conftest import obtener_driver, guardar_evidencia, RESTORA_FRONTEND_URL

class TestRestoraUnittest(unittest.TestCase):

    def setUp(self):
        self.driver = obtener_driver()
        self.driver.get(f"{RESTORA_FRONTEND_URL}/auth")
        time.sleep(1.5)

    def test_titulo_y_formulario_login(self):
        driver = self.driver
        print("[*] Validando título y presencia de inputs con unittest...")
        self.assertIn("restora", driver.title.lower(), "El título de la página no contiene 'restora'")

        # Verificar inputs de login
        email_input = driver.find_element(By.ID, "login-email")
        password_input = driver.find_element(By.ID, "login-password")
        self.assertTrue(email_input.is_displayed(), "El campo email no está visible")
        self.assertTrue(password_input.is_displayed(), "El campo contraseña no está visible")

        # Probar tipeo de prueba
        email_input.clear()
        email_input.send_keys("demo@circularaqp.pe")
        password_input.clear()
        password_input.send_keys("demo1234")

        guardar_evidencia(driver, "02_ej3_unittest_restora.png")
        print("[+] Campos validados y completados con éxito.")

    def tearDown(self):
        if self.driver:
            self.driver.quit()

if __name__ == "__main__":
    print("==================================================")
    print("EJERCICIO 3: Automatización con Unittest en RESTORA")
    print("==================================================")
    unittest.main()
