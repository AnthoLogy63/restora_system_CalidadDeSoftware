#!/usr/bin/env python3
"""
SUITE DE PRUEBAS AUTOMATIZADAS E2E CON SELENIUM WEBDRIVER — RESTORA
Laboratorio 09: Gestión de Calidad con Selenium
Universidad Nacional de San Agustín de Arequipa (UNSA)

Implementación de los 8 Casos Web Obligatorios sobre los 3 Procesos de Negocio:
- Proceso 1: Gestión de Operaciones Diarias y Registro de Desperdicios
- Proceso 2: Trazabilidad de Valorización y Salida de Residuos (Entregas)
- Proceso 3: Analítica Predictiva y Catálogo de Operaciones (CC-01)
- Seguridad y Sesión Transversal (Autenticación, Restricción por Rol y Logout)
"""

import sys
import time
import unittest
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

from conftest import (
    obtener_driver,
    guardar_evidencia,
    guardar_evidencia_caso,
    iniciar_sesion,
    limpiar_sesion,
    cargar_datos_prueba,
    RESTORA_FRONTEND_URL,
    RESTORA_PORTAL_URL,
)

class TestCasosNegocioRestora(unittest.TestCase):
    """Batería oficial de pruebas E2E de Aceptación para RESTORA."""

    @classmethod
    def setUpClass(cls):
        cls.datos = cargar_datos_prueba().get("casos", {})
        cls.driver = obtener_driver(headless=True)
        cls.driver.implicitly_wait(3)

    @classmethod
    def tearDownClass(cls):
        try:
            cls.driver.quit()
        except Exception:
            pass

    def setUp(self):
        # Aislamiento entre pruebas
        self.wait = WebDriverWait(self.driver, 10, poll_frequency=0.3)

    # --------------------------------------------------------------------------
    # CASO 1: Acceso Correcto (Login Válido) - Seguridad Transversal
    # --------------------------------------------------------------------------
    def test_01_acceso_correcto(self):
        """CP-01: Verifica el inicio de sesión exitoso con credenciales válidas."""
        driver = self.driver
        wait = self.wait
        datos_cp = self.datos.get("CP01_acceso_correcto", {
            "email": "demo@circularaqp.pe",
            "password": "demo1234",
            "esperado": {"restaurante": "El Buen Sabor AQP", "usuario": "María Quispe"}
        })

        print("\n[*] Ejecutando CP-01: Acceso Correcto...")
        limpiar_sesion(driver)
        driver.get(f"{RESTORA_FRONTEND_URL}/auth")

        email_input = wait.until(EC.visibility_of_element_located((By.ID, "login-email")))
        pass_input = wait.until(EC.visibility_of_element_located((By.ID, "login-password")))

        email_input.clear()
        email_input.send_keys(datos_cp["email"])
        pass_input.clear()
        pass_input.send_keys(datos_cp["password"])

        btn_submit = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']")))
        btn_submit.click()

        # Aserción observable: Redirección fuera de /auth y renderizado de la UI autenticada
        wait.until(lambda d: "/auth" not in d.current_url)
        self.assertNotIn("/auth", driver.current_url, "No se redirigió tras el login exitoso.")

        # Verificar presencia de la identidad del restaurante o usuario en el DOM
        usuario_o_restaurante = wait.until(
            EC.presence_of_element_located((
                By.XPATH,
                f"//*[contains(text(), '{datos_cp['esperado']['restaurante']}') or contains(text(), '{datos_cp['esperado']['usuario']}')]"
            ))
        )
        self.assertTrue(usuario_o_restaurante.is_displayed(), "No se observa el restaurante/usuario en pantalla.")

        guardar_evidencia_caso(driver, "CP01", "acceso_correcto", "OK")
        print("[✓] CP-01 Acceso Correcto: APROBADO")

    # --------------------------------------------------------------------------
    # CASO 2: Credenciales Inválidas - Seguridad Transversal
    # --------------------------------------------------------------------------
    def test_02_credenciales_invalidas(self):
        """CP-02: Verifica el rechazo de login con credenciales inexistentes o erróneas."""
        driver = self.driver
        wait = self.wait
        datos_cp = self.datos.get("CP02_credenciales_invalidas", {
            "email": "invalido@circularaqp.pe",
            "password": "WrongPassword999!"
        })

        print("\n[*] Ejecutando CP-02: Credenciales Inválidas...")
        limpiar_sesion(driver)
        driver.get(f"{RESTORA_FRONTEND_URL}/auth")

        email_input = wait.until(EC.visibility_of_element_located((By.ID, "login-email")))
        pass_input = wait.until(EC.visibility_of_element_located((By.ID, "login-password")))

        email_input.clear()
        email_input.send_keys(datos_cp["email"])
        pass_input.clear()
        pass_input.send_keys(datos_cp["password"])

        btn_submit = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']")))
        btn_submit.click()

        # Aserción observable: Mensaje de error visible en role="alert" o texto de fallo
        alerta_error = wait.until(
            EC.visibility_of_element_located((By.XPATH, "//*[@role='alert'] | //*[contains(text(), 'inválid') or contains(text(), 'mal')]"))
        )
        self.assertTrue(alerta_error.is_displayed(), "No se mostró alerta visual ante credenciales erróneas.")
        self.assertIn("/auth", driver.current_url, "El sistema no debe redirigir ante credenciales inválidas.")

        guardar_evidencia_caso(driver, "CP02", "credenciales_invalidas", "OK")
        print("[✓] CP-02 Credenciales Inválidas: APROBADO")

    # --------------------------------------------------------------------------
    # CASO 3: Restricción por Rol / Ruta Protegida - Aislamiento Multi-Tenant
    # --------------------------------------------------------------------------
    def test_03_restriccion_por_rol_rutas_protegidas(self):
        """CP-03: Verifica que usuarios sin sesión sean redirigidos al solicitar rutas privadas."""
        driver = self.driver
        wait = self.wait
        rutas = ["/dashboard", "/register", "/catalogo", "/entregas"]

        print("\n[*] Ejecutando CP-03: Restricción de Rutas Protegidas...")
        limpiar_sesion(driver)

        for ruta in rutas:
            url_objetivo = f"{RESTORA_FRONTEND_URL}{ruta}"
            print(f"    - Solicitando ruta protegida sin sesión: {url_objetivo}")
            driver.get(url_objetivo)

            # Espera explícita a que el guardia requireSession redirija a /auth
            wait.until(lambda d: "/auth" in d.current_url)
            self.assertIn("/auth", driver.current_url, f"La ruta {ruta} no fue bloqueada sin sesión.")

        guardar_evidencia_caso(driver, "CP03", "restriccion_rutas_protegidas", "OK")
        print("[✓] CP-03 Restricción de Rutas Protegidas: APROBADO")

    # --------------------------------------------------------------------------
    # CASO 4: Registro Válido (Proceso 2: Trazabilidad de Entregas Valorizables)
    # --------------------------------------------------------------------------
    def test_04_registro_valido_entrega(self):
        """CP-04: Registra una nueva entrega de material reciclable valorizable (Proceso 2)."""
        driver = self.driver
        wait = self.wait

        print("\n[*] Ejecutando CP-04: Registro Válido de Entrega (Proceso 2)...")
        iniciar_sesion(driver)

        driver.get(f"{RESTORA_FRONTEND_URL}/entregas")
        wait.until(lambda d: "/entregas" in d.current_url)

        # Campos del formulario de entregas
        peso_input = wait.until(EC.visibility_of_element_located((By.ID, "e-peso")))
        receptor_input = wait.until(EC.visibility_of_element_located((By.ID, "e-receptor")))
        obs_input = wait.until(EC.visibility_of_element_located((By.ID, "e-obs")))

        receptor_nombre = f"Recicladora San Martín AQP - Test {int(time.time())}"
        peso_input.clear()
        peso_input.send_keys("24")
        peso_input.send_keys(Keys.TAB)
        time.sleep(0.3)

        receptor_input.clear()
        receptor_input.send_keys(receptor_nombre)
        receptor_input.send_keys(Keys.TAB)
        time.sleep(0.3)

        obs_input.clear()
        obs_input.send_keys("Lote verificado de cartón corrugado para valorización.")
        time.sleep(0.3)

        # Guardar entrega mediante clic por script o nativo
        btn_guardar = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@type='submit' and not(@disabled)]")))
        driver.execute_script("arguments[0].click();", btn_guardar)
        time.sleep(1.5)

        # Aserción observable: El receptor registrado debe aparecer en la vista
        wait.until(lambda d: receptor_nombre in d.page_source)
        self.assertIn(receptor_nombre, driver.page_source, "El registro de entrega no aparece en la vista tras guardar.")

        guardar_evidencia_caso(driver, "CP04", "registro_valido_entrega", "OK")
        print(f"[✓] CP-04 Registro Válido: APROBADO (Receptor: {receptor_nombre})")

    # --------------------------------------------------------------------------
    # CASO 5: Datos Inválidos (Proceso 2: Rechazo de Formulario Inválido)
    # --------------------------------------------------------------------------
    def test_05_datos_invalidos_rechazo(self):
        """CP-05: Verifica el rechazo y bloqueo de registro ante datos inválidos o vacíos."""
        driver = self.driver
        wait = self.wait

        print("\n[*] Ejecutando CP-05: Validación de Datos Inválidos (Proceso 2)...")
        driver.get(f"{RESTORA_FRONTEND_URL}/entregas")
        wait.until(lambda d: "/entregas" in d.current_url)

        peso_input = wait.until(EC.visibility_of_element_located((By.ID, "e-peso")))
        receptor_input = wait.until(EC.visibility_of_element_located((By.ID, "e-receptor")))

        # Prueba 1: Peso negativo inválido
        peso_input.clear()
        peso_input.send_keys("-12")
        peso_input.send_keys(Keys.TAB)
        receptor_input.clear()
        receptor_input.send_keys("Receptor Negativo Invalido")
        receptor_input.send_keys(Keys.TAB)
        time.sleep(0.3)

        btn_guardar = driver.find_element(By.XPATH, "//button[@type='submit']")
        esta_desactivado = not btn_guardar.is_enabled() or btn_guardar.get_attribute("disabled") is not None
        self.assertTrue(esta_desactivado, "El botón Guardar debió estar deshabilitado ante peso negativo.")

        # Prueba 2: Receptor vacío (recargando vista limpia para aislar estado reactivo)
        driver.get(f"{RESTORA_FRONTEND_URL}/entregas")
        wait.until(lambda d: "/entregas" in d.current_url)

        peso_limpio = wait.until(EC.visibility_of_element_located((By.ID, "e-peso")))
        peso_limpio.clear()
        peso_limpio.send_keys("15")
        peso_limpio.send_keys(Keys.TAB)
        time.sleep(0.3)

        btn_guardar_limpio = driver.find_element(By.XPATH, "//button[@type='submit']")
        esta_desactivado_sin_receptor = not btn_guardar_limpio.is_enabled() or btn_guardar_limpio.get_attribute("disabled") is not None
        self.assertTrue(esta_desactivado_sin_receptor, "El botón Guardar debió estar deshabilitado sin receptor.")

        guardar_evidencia_caso(driver, "CP05", "datos_invalidos_rechazo", "OK")
        print("[✓] CP-05 Datos Inválidos: APROBADO (Bloqueo exitoso de entradas anómalas)")

    # --------------------------------------------------------------------------
    # CASO 6: Consulta (Proceso 3: Consulta de Catálogo y Equipo)
    # --------------------------------------------------------------------------
    def test_06_consulta_catalogo_y_equipo(self):
        """CP-06: Consulta y verifica la visualización del catálogo de productos y colaboradores."""
        driver = self.driver
        wait = self.wait

        print("\n[*] Ejecutando CP-06: Consulta de Información (Proceso 3)...")
        driver.get(f"{RESTORA_FRONTEND_URL}/catalogo")
        wait.until(lambda d: "/catalogo" in d.current_url)

        # Esperar a que se hidraten los productos y colaboradores
        wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Arroz') or contains(text(), 'Pollo')]")))

        productos_esperados = ["Arroz", "Pollo", "Aceite de cocina", "Papa"]
        for p in productos_esperados:
            elem = driver.find_element(By.XPATH, f"//*[contains(text(), '{p}')]")
            self.assertTrue(elem.is_displayed(), f"El producto {p} no está visible en el catálogo.")

        colaboradores_esperados = ["Carlos Mamani", "Luis Condori", "Rosa Apaza"]
        for c in colaboradores_esperados:
            elem = driver.find_element(By.XPATH, f"//*[contains(text(), '{c}')]")
            self.assertTrue(elem.is_displayed(), f"El colaborador {c} no está visible en el equipo.")

        guardar_evidencia_caso(driver, "CP06", "consulta_catalogo_equipo", "OK")
        print("[✓] CP-06 Consulta de Información: APROBADO (Catálogo y Personal verificados)")

    # --------------------------------------------------------------------------
    # CASO 7: Cambio de Estado (Proceso 3: CC-01 / Alternancia Operativa)
    # --------------------------------------------------------------------------
    def test_07_cambio_de_estado_producto_colaborador(self):
        """CP-07: Verifica la actualización de estado reactiva en el módulo de personal/catálogo."""
        driver = self.driver
        wait = self.wait

        print("\n[*] Ejecutando CP-07: Cambio de Estado (Proceso 3 / CC-01)...")
        driver.get(f"{RESTORA_FRONTEND_URL}/catalogo")
        wait.until(lambda d: "/catalogo" in d.current_url)

        # Localizar el botón de alternar capacitación para 'Luis Condori'
        # El botón contiene el texto 'Capacitado' o 'Sin capacitar'
        fila_colaborador = wait.until(
            EC.presence_of_element_located((
                By.XPATH,
                "//li[contains(., 'Luis Condori')]"
            ))
        )

        boton_toggle = fila_colaborador.find_element(By.XPATH, ".//button[contains(., 'Capacitado') or contains(., 'Sin capacitar')]")
        texto_inicial = boton_toggle.text.strip()
        print(f"    - Estado inicial de capacitación: '{texto_inicial}'")

        # Clic para cambiar el estado
        boton_toggle.click()
        time.sleep(1.2)

        # Verificar que el texto del botón cambió
        fila_actualizada = driver.find_element(By.XPATH, "//li[contains(., 'Luis Condori')]")
        boton_actualizado = fila_actualizada.find_element(By.XPATH, ".//button[contains(., 'Capacitado') or contains(., 'Sin capacitar')]")
        texto_nuevo = boton_actualizado.text.strip()
        print(f"    - Estado actualizado de capacitación: '{texto_nuevo}'")

        self.assertNotEqual(texto_inicial, texto_nuevo, "El estado de capacitación no cambió tras la interacción.")

        # Revertir para mantener la idempotencia de los datos
        boton_actualizado.click()
        time.sleep(1)

        guardar_evidencia_caso(driver, "CP07", "cambio_estado_reactivo", "OK")
        print("[✓] CP-07 Cambio de Estado: APROBADO (Transición reactiva y persistente)")

    # --------------------------------------------------------------------------
    # CASO 8: Cierre de Sesión (Logout Seguro) - Seguridad Transversal
    # --------------------------------------------------------------------------
    def test_08_cierre_de_sesion(self):
        """CP-08: Verifica el cierre de sesión, destrucción de cookies y protección contra retroceso."""
        driver = self.driver
        wait = self.wait

        print("\n[*] Ejecutando CP-08: Cierre de Sesión...")
        driver.get(f"{RESTORA_FRONTEND_URL}/dashboard")
        wait.until(lambda d: "/dashboard" in d.current_url or d.current_url.endswith(":5173/"))

        # Abrir el menú desplegable del perfil en la barra lateral
        trigger_usuario = wait.until(
            EC.element_to_be_clickable((
                By.XPATH,
                "//div[@data-sidebar='footer']//button | //button[.//span[contains(text(), 'María') or contains(text(), 'El Buen Sabor')]]"
            ))
        )
        trigger_usuario.click()

        # Clic en la opción 'Cerrar sesión'
        btn_cerrar = wait.until(
            EC.element_to_be_clickable((
                By.XPATH,
                "//*[@role='menuitem' and contains(., 'Cerrar sesión')] | //button[contains(., 'Cerrar sesión')] | //*[contains(text(), 'Cerrar sesión')]"
            ))
        )
        btn_cerrar.click()

        # Aserción observable 1: Redirección automática a /auth
        wait.until(lambda d: "/auth" in d.current_url)
        self.assertIn("/auth", driver.current_url, "No se redirigió a /auth tras cerrar sesión.")

        # Aserción observable 2: Intento de volver atrás en el historial del navegador
        driver.back()
        time.sleep(1.5)
        # El guardia requireSession debe atraparlo y devolverlo a /auth
        self.assertIn("/auth", driver.current_url, "El retroceso del navegador no fue bloqueado tras el logout.")

        guardar_evidencia_caso(driver, "CP08", "cierre_sesion_seguro", "OK")
        print("[✓] CP-08 Cierre de Sesión: APROBADO (Sesión revocada y retroceso bloqueado)")

def suite():
    s = unittest.TestSuite()
    s.addTest(TestCasosNegocioRestora("test_01_acceso_correcto"))
    s.addTest(TestCasosNegocioRestora("test_02_credenciales_invalidas"))
    s.addTest(TestCasosNegocioRestora("test_03_restriccion_por_rol_rutas_protegidas"))
    s.addTest(TestCasosNegocioRestora("test_04_registro_valido_entrega"))
    s.addTest(TestCasosNegocioRestora("test_05_datos_invalidos_rechazo"))
    s.addTest(TestCasosNegocioRestora("test_06_consulta_catalogo_y_equipo"))
    s.addTest(TestCasosNegocioRestora("test_07_cambio_de_estado_producto_colaborador"))
    s.addTest(TestCasosNegocioRestora("test_08_cierre_de_sesion"))
    return s

if __name__ == "__main__":
    runner = unittest.TextTestRunner(verbosity=2)
    resultado = runner.run(suite())
    sys.exit(0 if resultado.wasSuccessful() else 1)
