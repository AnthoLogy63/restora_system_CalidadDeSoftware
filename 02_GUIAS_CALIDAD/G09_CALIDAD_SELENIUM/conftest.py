"""
Utilidades compartidas y configuración para la suite de pruebas automatizadas con Selenium en RESTORA.
Laboratorio 09 - Calidad de Software (UNSA)
"""

import os
import json
import time
from selenium import webdriver
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATOS_DIR = os.path.join(BASE_DIR, "DATOS")
RESULTADOS_DIR = os.path.join(BASE_DIR, "RESULTADOS")
EVIDENCIAS_DIR = os.path.join(BASE_DIR, "EVIDENCIAS")

os.makedirs(DATOS_DIR, exist_ok=True)
os.makedirs(RESULTADOS_DIR, exist_ok=True)
os.makedirs(EVIDENCIAS_DIR, exist_ok=True)

RESTORA_PORTAL_URL = os.environ.get("RESTORA_PORTAL_URL", "http://localhost:3000")
RESTORA_FRONTEND_URL = os.environ.get("RESTORA_FRONTEND_URL", "http://localhost:5173")

def cargar_datos_prueba():
    """Carga el dataset parametrizado para los 8 casos de prueba."""
    ruta_datos = os.path.join(DATOS_DIR, "datos_pruebas_selenium.json")
    if os.path.exists(ruta_datos):
        with open(ruta_datos, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def obtener_driver(headless: bool = True, browser: str = "firefox"):
    """
    Inicializa el WebDriver adecuado (Firefox o Brave/Chrome) configurando
    el tamaño de ventana estándar (1440x900) para pruebas E2E consistentes.
    Aprovecha Selenium Manager para la gestión automática de drivers.
    """
    browser_type = os.environ.get("SELENIUM_BROWSER", browser).lower()

    if browser_type in ("brave", "chrome", "chromium"):
        options = ChromeOptions()
        brave_paths = [
            "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
            os.path.expanduser("~/.local/bin/brave"),
        ]
        for bp in brave_paths:
            if os.path.exists(bp):
                options.binary_location = bp
                break

        if headless:
            options.add_argument("--headless=new")
        options.add_argument("--window-size=1440,900")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        driver = webdriver.Chrome(options=options)
    else:
        options = FirefoxOptions()
        if headless:
            options.add_argument("-headless")
        options.add_argument("--width=1440")
        options.add_argument("--height=900")
        driver = webdriver.Firefox(options=options)

    driver.set_window_size(1440, 900)
    return driver

def guardar_evidencia(driver, nombre_archivo: str):
    """Guarda una captura de pantalla en la carpeta EVIDENCIAS/."""
    ruta = os.path.join(EVIDENCIAS_DIR, nombre_archivo)
    driver.save_screenshot(ruta)
    print(f" [Evidencia guardada]: {ruta}")
    return ruta

def guardar_evidencia_caso(driver, codigo_caso: str, descripcion: str, estado: str = "OK"):
    """Genera captura estandarizada con código de caso y estado."""
    limpio = descripcion.lower().replace(" ", "_").replace("/", "_")[:30]
    nombre = f"{codigo_caso.lower()}_{limpio}_{estado.lower()}.png"
    return guardar_evidencia(driver, nombre)

def iniciar_sesion(driver, email: str = "demo@circularaqp.pe", password: str = "demo1234", timeout: int = 10):
    """
    Inicia sesión de manera robusta en la aplicación frontend (/auth)
    y espera a que la sesión esté establecida y redirija a /dashboard o /.
    """
    url_auth = f"{RESTORA_FRONTEND_URL}/auth"
    driver.get(url_auth)
    wait = WebDriverWait(driver, timeout)

    campo_email = wait.until(EC.visibility_of_element_located((By.ID, "login-email")))
    campo_pass = wait.until(EC.visibility_of_element_located((By.ID, "login-password")))

    campo_email.clear()
    campo_email.send_keys(email)
    campo_pass.clear()
    campo_pass.send_keys(password)

    boton_login = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']")))
    boton_login.click()

    # Esperar cambio de URL o presencia del sidebar/dashboard
    wait.until(
        lambda d: "/auth" not in d.current_url or len(d.find_elements(By.XPATH, "//span[contains(text(), 'El Buen Sabor') or contains(text(), 'María')]")) > 0
    )
    time.sleep(1)

def limpiar_sesion(driver):
    """Elimina cookies y almacenamiento local para aislar pruebas no autenticadas."""
    try:
        driver.delete_all_cookies()
        driver.execute_script("window.localStorage.clear(); window.sessionStorage.clear();")
    except Exception:
        pass
