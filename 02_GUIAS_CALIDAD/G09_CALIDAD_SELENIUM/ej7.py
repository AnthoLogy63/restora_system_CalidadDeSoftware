#!/usr/bin/env python3
"""
EJERCICIO 7: Gestión y alternancia entre ventanas y pestañas en RESTORA.
Laboratorio 09 - Calidad de Software (UNSA)

Objetivo:
- Abrir nuevas pestañas de navegación con window.open() o enlaces con target='_blank'.
- Inspeccionar window_handles para identificar identificadores de ventana.
- Conmutar el contexto del driver con switch_to.window().
- Validar contenido en la nueva ventana y retornar a la original.
"""

import sys
import time
from conftest import obtener_driver, guardar_evidencia, RESTORA_PORTAL_URL, RESTORA_FRONTEND_URL

def test_ejercicio_7():
    print("==================================================")
    print("EJERCICIO 7: Gestión de Ventanas y Pestañas")
    print("==================================================")

    driver = obtener_driver()
    try:
        print(f"[*] Navegando a la ventana principal: {RESTORA_PORTAL_URL}")
        driver.get(RESTORA_PORTAL_URL)
        time.sleep(1.5)

        ventana_principal = driver.current_window_handle
        print(f"[*] Identificador de ventana principal: {ventana_principal}")
        print(f"[*] Título ventana principal: '{driver.title}'")

        # Abrir una nueva pestaña hacia la app Frontend (SPA)
        print(f"[*] Abriendo nueva pestaña hacia: {RESTORA_FRONTEND_URL}")
        driver.execute_script(f"window.open('{RESTORA_FRONTEND_URL}', '_blank');")
        time.sleep(2)

        todas_las_ventanas = driver.window_handles
        print(f"[+] Pestañas detectadas ({len(todas_las_ventanas)}): {todas_las_ventanas}")
        assert len(todas_las_ventanas) >= 2, "No se detectó la nueva pestaña"

        # Cambiar el foco a la nueva pestaña
        nueva_ventana = [v for v in todas_las_ventanas if v != ventana_principal][0]
        print(f"[*] Conmutando foco a la pestaña: {nueva_ventana}")
        driver.switch_to.window(nueva_ventana)
        time.sleep(1.5)

        print(f"[+] Título en la nueva pestaña: '{driver.title}'")
        assert "restora" in driver.title.lower()

        guardar_evidencia(driver, "06_ej7_pestanas_restora.png")

        # Cerrar la pestaña secundaria y regresar a la principal
        print("[*] Cerrando pestaña secundaria...")
        driver.close()
        driver.switch_to.window(ventana_principal)
        print(f"[+] Retorno exitoso a la ventana principal: '{driver.title}'")

        print("[✓] EJERCICIO 7 completado exitosamente.\n")
    except Exception as e:
        print(f"[✗] Error en Ejercicio 7: {e}")
        sys.exit(1)
    finally:
        driver.quit()

if __name__ == "__main__":
    test_ejercicio_7()
