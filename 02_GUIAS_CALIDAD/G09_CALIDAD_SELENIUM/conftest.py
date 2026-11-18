"""
Utilidades compartidas para la suite de pruebas automatizadas con Selenium en RESTORA.
Laboratorio 09 - Calidad de Software (UNSA)
"""

import os
from selenium import webdriver
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.chrome.options import Options as ChromeOptions

RESTORA_PORTAL_URL = os.environ.get("RESTORA_PORTAL_URL", "http://localhost:3000")
RESTORA_FRONTEND_URL = os.environ.get("RESTORA_FRONTEND_URL", "http://localhost:5173")
EVIDENCIAS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "EVIDENCIAS"))

os.makedirs(EVIDENCIAS_DIR, exist_ok=True)

def obtener_driver(headless: bool = True, browser: str = "firefox"):
    """
    Inicializa el WebDriver adecuado (Firefox o Brave/Chrome) configurando
    el tamaño de ventana estándar para pruebas consistentes.
    """
    browser_type = os.environ.get("SELENIUM_BROWSER", browser).lower()

    if browser_type == "brave" or browser_type == "chrome":
        options = ChromeOptions()
        brave_path = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
        if os.path.exists(brave_path):
            options.binary_location = brave_path
        if headless:
            options.add_argument("--headless=new")
        options.add_argument("--window-size=1440,900")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
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
    """Guarda una captura de pantalla en la carpeta EVIDENCIAS."""
    ruta = os.path.join(EVIDENCIAS_DIR, nombre_archivo)
    driver.save_screenshot(ruta)
    print(f" [Evidencia guardada]: {ruta}")
    return ruta
