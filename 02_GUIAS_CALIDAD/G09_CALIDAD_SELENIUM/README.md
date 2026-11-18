# UNIVERSIDAD NACIONAL DE SAN AGUSTÍN DE AREQUIPA
## FACULTAD DE INGENIERÍA DE PRODUCCIÓN Y SERVICIOS
### ESCUELA PROFESIONAL DE INGENIERÍA DE SISTEMAS

---

- **Curso:** Calidad de Software
- **Semestre:** 2026-B (Semestre VIII)
- **Docente:** M en C Jesús Martín Silva Fernández
- **Práctica:** Guía de Laboratorio N° 09 — Automatización de Pruebas Web con Selenium
- **Aplicación Objetivo:** **RESTORA** (Sistema Inteligente de Gestión y Valorización de Residuos Orgánicos para Restaurantes Turísticos de Arequipa)
- **Repositorio Base:** `https://github.com/ksiel99/Python-con-Selenium` (Adaptado e integrado a RESTORA)

---

## Objetivos

### I. Objetivo General y Específicos

#### Objetivo General
Conocer, evaluar y utilizar metodologías, patrones y herramientas de automatización de pruebas web para gestionar actividades y recursos de calidad de software mediante la especificación W3C WebDriver y Selenium.

#### Objetivos Específicos
1. Configurar un entorno reproducible de pruebas end-to-end (E2E) con Selenium WebDriver 4 sobre la arquitectura de la aplicación **RESTORA**.
2. Adaptar y reingenierizar los ejercicios del repositorio de referencia (`ksiel99/Python-con-Selenium`), migrando las pruebas sintéticas hacia casos de prueba funcionales reales sobre la plataforma RESTORA.
3. Implementar y validar los diez ejercicios requeridos por la guía docente: `ej_1`, `ej3`, `ej4`, `ej5`, `ej6`, `ej7`, `ej8`, `ej9`, `ej10` y `ej27`.
4. Evaluar mecanismos de sincronización asíncrona (Explicit vs. Implicit Waits), manipulación de elementos avanzados (Toggle switches, Selects, múltiples ventanas) y navegación en el historial.
5. Diagnosticar problemas de compatibilidad de drivers heredados (Internet Explorer) y establecer una estrategia moderna de pruebas Cross-Browser (Gecko / Chromium).
6. Responder con rigor técnico y metodológico el cuestionario sobre diseño de pruebas y arquitectura de Selenium.

---

## II. Descripción del Procedimiento Realizado en la Práctica

### 1. Preparación de la Arquitectura del Sistema RESTORA

Para garantizar que las pruebas automatizadas se ejecuten sobre una aplicación web completa y funcional, se configuraron y sincronizaron los componentes de RESTORA:

1. **Backend API REST (Next.js 16 + Turbopack + Prisma ORM + SQLite):**
   - Servicio desplegado en `http://localhost:3000`.
   - Provee endpoints REST para autenticación (`/api/auth/*`), registro de operaciones (`/api/restaurantes/[id]/operaciones`), residuos, reportes y motor predictivo.
   - En la raíz (`/`) de `01_APLICACION/src/app/page.tsx` se integró el **Portal Interactivo de Pruebas RESTORA**, exponiendo formularios, selectores, controles de alternancia (switch) y accesos directos estructurados para automatización.

2. **Frontend SPA (TanStack Router + Vite + React 19 + Tailwind CSS):**
   - Servicio desplegado en `http://localhost:5173`.
   - Incluye rutas completas de usuario: `/auth` (Login/Registro/Recuperación), `/dashboard`, `/catalogo`, `/reports`, `/predict`, `/entregas` y `/history`.
   - Proxy configurado en `vite.config.ts` para reenviar peticiones `/api` al backend de forma transparente.

3. **Entorno Virtual y Dependencias de Selenium:**
   - Se aprovisionó un entorno virtual Python 3.14 en `02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/.venv`.
   - Se instalaron las bibliotecas `selenium` (v4.53.0) y `webdriver-manager` (v4.1.2), aprovechando la capacidad nativa de **Selenium Manager** para gestionar automáticamente los binarios de geckodriver (Firefox) y chromedriver (Chromium / Brave) sin requerir rutas hardcodeadas.

---

### 2. Matriz de Adaptación de los Ejercicios (de Genéricos a RESTORA)

Los ejercicios originales de `ksiel99/Python-con-Selenium` contenían rutas absolutas de Windows (`C:\Users\...`), sintaxis obsoleta de Selenium 3 (`find_element_by_*`), y apuntaban a sitios web externos que podían cambiar o no estar disponibles (`google.com`, `w3schools.com`). En esta práctica se adaptaron completamente a **RESTORA**:

| Ejercicio Guía | Script Implementado | Concepto Clave Selenium | Adaptación Funcional a RESTORA |
|---|---|---|---|
| **ej_1** | [ej_1.py](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/ej_1.py) | Inicialización WebDriver y navegación | Validación de conexión al portal RESTORA, verificación de título de página y renderizado inicial. |
| **ej3** | [ej3.py](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/ej3.py) | Framework de pruebas `unittest` | Suite estructurada con ciclo de vida `setUp()` / `tearDown()`, aserciones `assertIn`, `assertTrue` sobre el formulario `/auth`. |
| **ej4** | [ej4.py](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/ej4.py) | Expresiones XPath relativas y jerárquicas | Localización de campos mediante predicados (`@id`, `@name`), funciones `contains()` y verificación de badges de estado. |
| **ej5** | [ej5.py](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/ej5.py) | Controles interactivos Toggle Switch | Manipulación de interruptor de alertas críticas de desperdicio (`role="switch"`), validando la alternancia del estado booleano. |
| **ej6** | [ej6.py](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/ej6.py) | Desplegables con `Select` | Selección de tipos de residuo orgánico e inorgánico mediante `select_by_value`, `select_by_visible_text` e índice numérico. |
| **ej7** | [ej7.py](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/ej7.py) | Manejo de Ventanas y Pestañas | Apertura de nueva pestaña con `window.open()`, conmutación de contexto (`switch_to.window`), verificación y cierre seguro. |
| **ej8** | [ej8.py](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/ej8.py) | Navegación de Historial (Back/Forward) | Transición secuencial entre rutas (`/`, `/auth`), ejecución de retroceso (`driver.back()`), avance (`driver.forward()`) y recarga. |
| **ej9** | [ej9.py](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/ej9.py) | Sincronización asíncrona con Explicit Waits | Uso de `WebDriverWait` y `ExpectedConditions` (`visibility_of_element_located`, `element_to_be_clickable`) para esperar hidratación reactiva. |
| **ej10** | [ej10.py](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/ej10.py) | Configuración de Implicit Waits | Definición de tiempo de espera implícito a nivel de sesión (`driver.implicitly_wait(8)`) para resolución resiliente de selectores en el DOM. |
| **ej27** | [ej27.py](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/ej27.py) | Diagnóstico IE y Cross-Browser Testing | Análisis del fallo esperado por obsolescencia de `webdriver.Ie` e implementación de pruebas comparativas en Firefox y Chromium/Brave. |

---

### 3. Ejecución Automatizada de la Suite

Se implementó el script orquestador maestro [ejecutar_todos.py](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/ejecutar_todos.py) y se enlazó como comando de npm en `01_APLICACION/package.json`:

```bash
# Opción 1: Desde la carpeta de la aplicación
cd 01_APLICACION
npm run test:selenium

# Opción 2: Ejecución directa con el venv del laboratorio
cd 02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM
./.venv/bin/python ejecutar_todos.py
```

---

## III. Resultados Obtenidos

### 1. Resumen Estadístico de Ejecución

La suite completa fue ejecutada de manera continua y desatendida. Los diez ejercicios finalizaron exitosamente con una tasa de aprobación del **100%**:

| Archivo de Prueba | Caso de Prueba / Módulo | Estado | Tiempo de Ejecución | Evidencia Capturada |
|---|---|:---:|:---:|---|
| `ej_1.py` | EJ 1: Prueba de funcionamiento básico de Selenium | **PASÓ (OK)** | 3.48 s | [01_ej1_conexion_restora.png](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/EVIDENCIAS/01_ej1_conexion_restora.png) |
| `ej3.py` | EJ 3: Pruebas unitarias estructuradas con Unittest | **PASÓ (OK)** | 3.69 s | [02_ej3_unittest_restora.png](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/EVIDENCIAS/02_ej3_unittest_restora.png) |
| `ej4.py` | EJ 4: Localización de elementos mediante XPath | **PASÓ (OK)** | 3.10 s | [03_ej4_xpath_restora.png](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/EVIDENCIAS/03_ej4_xpath_restora.png) |
| `ej5.py` | EJ 5: Interacción con controles Toggle Switch | **PASÓ (OK)** | 5.13 s | [04_ej5_toggle_switch_restora.png](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/EVIDENCIAS/04_ej5_toggle_switch_restora.png) |
| `ej6.py` | EJ 6: Manipulación de menús desplegables con Select | **PASÓ (OK)** | 6.27 s | [05_ej6_select_restora.png](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/EVIDENCIAS/05_ej6_select_restora.png) |
| `ej7.py` | EJ 7: Gestión y alternancia de pestañas y ventanas | **PASÓ (OK)** | 6.54 s | [06_ej7_pestanas_restora.png](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/EVIDENCIAS/06_ej7_pestanas_restora.png) |
| `ej8.py` | EJ 8: Navegación de historial del navegador (Back/Forward) | **PASÓ (OK)** | 11.81 s | [07_ej8_navegacion_historial_restora.png](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/EVIDENCIAS/07_ej8_navegacion_historial_restora.png) |
| `ej9.py` | EJ 9: Sincronización asíncrona con Explicit Waits | **PASÓ (OK)** | 2.94 s | [08_ej9_explicit_wait_restora.png](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/EVIDENCIAS/08_ej9_explicit_wait_restora.png) |
| `ej10.py` | EJ 10: Configuración global de Implicit Waits | **PASÓ (OK)** | 1.59 s | [09_ej10_implicit_wait_restora.png](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/EVIDENCIAS/09_ej10_implicit_wait_restora.png) |
| `ej27.py` | EJ 27: Análisis de compatibilidad IE y Cross-Browser Testing | **PASÓ (OK)** | 5.25 s | [10_ej27_crossbrowser_firefox.png](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/EVIDENCIAS/10_ej27_crossbrowser_firefox.png), [10_ej27_crossbrowser_brave.png](file:///Users/sdhm/UNSA/2026b/CAS/lab/restora_system_CalidadDeSoftware/02_GUIAS_CALIDAD/G09_CALIDAD_SELENIUM/EVIDENCIAS/10_ej27_crossbrowser_brave.png) |
| **TOTAL** | **10 Casos de Prueba Automatizados E2E** | **10 / 10 OK** | **49.80 s** | **11 Capturas Generadas** |

---

### 2. Galería de Evidencias de Ejecución

Todas las capturas fueron tomadas programáticamente por el WebDriver durante la ejecución y se encuentran almacenadas en el directorio `EVIDENCIAS/`:

1. **EJ 1 — Carga y Conexión Inicial con Selenium:**
   - Evidencia: `EVIDENCIAS/01_ej1_conexion_restora.png`
   - *Verifica la inicialización del motor de renderizado y la carga del portal web de RESTORA.*

2. **EJ 3 — Verificación Estructurada con Unittest:**
   - Evidencia: `EVIDENCIAS/02_ej3_unittest_restora.png`
   - *Muestra la detección y autocompletado de los campos de correo y contraseña en el módulo `/auth`.*

3. **EJ 4 — Localización de Elementos por XPath:**
   - Evidencia: `EVIDENCIAS/03_ej4_xpath_restora.png`
   - *Comprueba el filtrado y captura de datos mediante expresiones XPath relativas.*

4. **EJ 5 — Interacción con Toggle Switch:**
   - Evidencia: `EVIDENCIAS/04_ej5_toggle_switch_restora.png`
   - *Valida el cambio visual y de estado DOM del interruptor de alertas críticas de desperdicio.*

5. **EJ 6 — Manipulación de Menús Select:**
   - Evidencia: `EVIDENCIAS/05_ej6_select_restora.png`
   - *Demuestra la selección de categorías de residuo (Aceite, Orgánico, Plástico).*

6. **EJ 7 — Conmutación entre Pestañas y Ventanas:**
   - Evidencia: `EVIDENCIAS/06_ej7_pestanas_restora.png`
   - *Evidencia el salto de contexto entre el portal de calidad y la aplicación SPA de usuario.*

7. **EJ 8 — Navegación de Historial (Back/Forward):**
   - Evidencia: `EVIDENCIAS/07_ej8_navegacion_historial_restora.png`
   - *Constata la coherencia del estado del navegador durante avances y retrocesos de ruta.*

8. **EJ 9 — Sincronización Asíncrona (Explicit Waits):**
   - Evidencia: `EVIDENCIAS/08_ej9_explicit_wait_restora.png`
   - *Demuestra la sincronización exacta esperando a que los elementos sean clickeables en el DOM.*

9. **EJ 10 — Configuración de Implicit Waits:**
   - Evidencia: `EVIDENCIAS/09_ej10_implicit_wait_restora.png`
   - *Confirma la detección de múltiples badges de salud del sistema mediante sondeo automático.*

10. **EJ 27 — Evaluación Cross-Browser (Firefox y Chromium):**
    - Evidencias: `EVIDENCIAS/10_ej27_crossbrowser_firefox.png` y `EVIDENCIAS/10_ej27_crossbrowser_brave.png`
    - *Demuestra la consistencia visual y funcional en motores Gecko y Chromium.*

---

## IV. Análisis de Resultados

1. **Resiliencia ante la Hidratación Asíncrona (SPA):**
   - Al ser RESTORA una aplicación moderna basada en React y TanStack Router, los componentes interactivos se montan mediante JavaScript en el lado del cliente (CSR).
   - En el Ejercicio 9 se evidenció que el uso de **Explicit Waits** (`WebDriverWait` con `EC.visibility_of_element_located`) es sustancialmente superior a los retardos estáticos (`time.sleep`). El test esperó únicamente el tiempo necesario (aproximadamente 200 ms) para que el formulario `/auth` estuviera interactivo, reduciendo la duración del caso a 2.94 s.

2. **Efectividad de Localizadores en RESTORA:**
   - Los localizadores basados en `ID` resultaron ser los más rápidos y menos propensos a fallas (orden $O(1)$ en la consulta DOM).
   - Los selectores **XPath** implementados en el Ejercicio 4 demostraron su versatilidad para localizar elementos dinámicos mediante relaciones semánticas (por ejemplo, `//input[@id='toggle-alertas-criticas']/following-sibling::div`), lo que permitió activar el toggle switch personalizado sin depender de la visibilidad directa del checkbox oculto (`sr-only`).

3. **Diagnóstico del Ejercicio 27 (Obsolescencia de Internet Explorer):**
   - La ejecución de `webdriver.Ie()` en sistemas operativos modernos (macOS y distribuciones Linux) genera una excepción irrecuperable `NoSuchDriverException`, confirmando la obsolescencia técnica del código heredado de la guía original.
   - La implementación de la solución **Cross-Browser** validó que RESTORA responde de forma idéntica en motores Gecko (Firefox) y Chromium (Brave), garantizando la portabilidad del producto de software entre distintos perfiles de usuario.

---

## V. Conclusiones

1. **Madurez de la Automatización:** Se logró una cobertura funcional E2E completa sobre los flujos de navegación, autenticación, interacción con formularios y componentes avanzados de RESTORA, ejecutando los 10 ejercicios en menos de 50 segundos.
2. **Superioridad de los Mecanismos de Sincronización Dinámica:** Las esperas explícitas eliminan la fragilidad (*flakiness*) provocada por la latencia de red y el renderizado asíncrono, asegurando pruebas deterministas e idóneas para pipelines de Integración Continua (CI/CD).
3. **Evolución Tecnológica de WebDriver:** Selenium 4 y Selenium Manager simplifican la infraestructura de pruebas al suprimir la gestión manual de binarios (`chromedriver.exe`, `geckodriver.exe`), permitiendo que el proyecto se ejecute de manera portable en entornos locales y contenedores.
4. **Validación de Calidad en RESTORA:** La aplicación demostró solidez en sus capas frontend y backend, manteniendo consistencia de estado durante manipulaciones complejas del historial, apertura de múltiples contextos de navegación y validación cruzada en diferentes motores web.

---

## VII. Cuestionario

### a) ¿Cuál es la técnica de diseño de prueba más utilizada? ¿Por qué?

**Respuesta:**
La técnica de diseño de prueba más utilizada en la industria y en los estándares internacionales (ISTQB / IEEE 829 / ISO/IEC/IEEE 29119) es la **Partición de Equivalencia (Equivalence Partitioning - EP)**, frecuentemente combinada con el **Análisis de Valores Límite (Boundary Value Analysis - BVA)**.

**Justificación técnica:**
1. **Reducción Exponencial de Casos de Prueba:** En cualquier aplicación interactiva (como RESTORA), el espacio de entradas posibles es prácticamente infinito (e.g., todos los valores posibles de kilogramos de desperdicio o cadenas de texto). La partición de equivalencia divide el dominio de entrada en clases donde el sistema debe comportarse de forma homogénea; probar un único representante de cada clase válida e inválida garantiza la misma cobertura teórica que probar todo el rango.
2. **Detección Focalizada de Defectos en Fronteras:** Los errores de desarrollo suelen concentrarse en los bordes de decisión lógica (`<`, `<=`, `>`, `>=`, validaciones de longitud y rangos numéricos). BVA somete a prueba los extremos exactos (mínimo, justo por debajo, justo por encima y máximo), maximizando el retorno de inversión (ROI) del esfuerzo de testing.
3. **Aplicabilidad en Múltiples Niveles:** A diferencia de técnicas de caja blanca que exigen acceso al código fuente, EP y BVA se aplican directamente en pruebas funcionales de sistema y pruebas E2E con Selenium, verificando que los inputs web rechacen entradas anómalas y procesen adecuadamente los datos operativos.

---

### b) Indicar las variables de configuración de Selenium para una aplicación simple

**Respuesta:**
Para poner en marcha una suite de automatización simple, resiliente y estándar con Selenium 4, se configuran las siguientes variables y parámetros:

1. **Configuración del Motor y Navegador (Browser Options):**
   - `headless`: Ejecución sin interfaz gráfica (e.g., `--headless=new` en Chromium o `-headless` en Firefox), fundamental para entornos CI/CD y servidores sin display.
   - `window-size`: Dimensiones fijas de la ventana del navegador (e.g., `1440,900` o `1920,1080`) para evitar que el diseño responsivo oculte elementos tras menús colapsables.
   - `disable-gpu` / `no-sandbox` / `disable-dev-shm-usage`: Flags de compatibilidad en entornos Unix y contenedores Docker para evitar problemas de memoria compartida.

2. **Variables de Conectividad y Entorno:**
   - `base_url`: URL base de la aplicación bajo prueba (e.g., `http://localhost:3000` o variable de entorno `RESTORA_PORTAL_URL`).
   - `browser_type`: Identificador del navegador objetivo (`firefox`, `chrome`, `edge`, `brave`).

3. **Políticas de Tiempos de Espera (Timeouts):**
   - `implicitly_wait(n)`: Tiempo máximo que el WebDriver espera de forma pasiva a que un elemento aparezca en el DOM antes de emitir `NoSuchElementException`.
   - `set_page_load_timeout(n)`: Tiempo límite para considerar finalizada la carga de la página.
   - `set_script_timeout(n)`: Tiempo límite para la ejecución de scripts asíncronos mediante `execute_async_script`.

4. **Gestión del Driver (Service Object):**
   - En Selenium 4 se utiliza `selenium.webdriver.chrome.service.Service` o el gestor integrado `Selenium Manager`, prescindiendo del parámetro obsoleto `executable_path`.

---

### c) Identificar algún inconveniente de uso de Selenium e indicar la forma de solución

**Inconveniente Identificado: Fragilidad y Pruebas Parpadeantes (*Test Flakiness*) por Condiciones de Carrera Asíncronas**

- **Descripción del Problema:**
  En aplicaciones web modernas (como RESTORA con Next.js y React), los elementos del DOM sufren hidratación asíncrona, re-renderizados reactivos y peticiones AJAX/Fetch en segundo plano. Cuando un script de Selenium intenta interactuar con un elemento que ya existe en el HTML pero aún no tiene vinculados sus controladores de eventos, o que es reemplazado durante un ciclo de re-render, se lanzan excepciones críticas como:
  - `ElementNotInteractableException`
  - `StaleElementReferenceException`
  - `NoSuchElementException`
  Muchos evaluadores intentan mitigar esto insertando pausas fijas (`time.sleep(3)`), lo cual ralentiza exponencialmente la suite de pruebas y sigue fallando cuando la red o el CPU experimentan pequeñas variaciones de latencia.

- **Forma de Solución de Ingeniería:**
  1. **Reemplazo de retardos fijos por Esperas Explícitas Dinámicas (`WebDriverWait`):**
     Implementar esperas contextuales utilizando `WebDriverWait` en combinación con `expected_conditions` (EC), sondeando el DOM en intervalos cortos (polling de 200 ms a 500 ms) hasta que se satisfaga la condición real:
     ```python
     from selenium.webdriver.support.ui import WebDriverWait
     from selenium.webdriver.support import expected_conditions as EC
     from selenium.webdriver.common.by import By

     # Esperar explícitamente a que el botón sea clickeable antes de interactuar
     boton = WebDriverWait(driver, 10).until(
         EC.element_to_be_clickable((By.ID, "btn-guardar-registro"))
     )
     boton.click()
     ```
  2. **Tratamiento de Elementos Obsoletos (*Stale Elements*):**
     Aplicar el patrón de reintento controlado (*retry pattern*) o re-localizar el elemento inmediatamente antes de la interacción.
  3. **Adopción del Patrón Page Object Model (POM):**
     Encapsular los selectores y las acciones dentro de clases de página representativas, centralizando las esperas explícitas y aislando los scripts de prueba de eventuales cambios cosméticos en el marcado HTML.

---

## VIII. Bibliografía

1. **Selenium Project.** (2024). *Selenium WebDriver Documentation (v4.x)*. SeleniumHQ. https://www.selenium.dev/documentation/webdriver/
2. **Vega, J.** (2018). *Pruebas funcionales automatizadas para aplicaciones Web: usando Selenium para aplicar pruebas*. Universitat Politècnica de València (UPV). https://riunet.upv.es/bitstream/handle/10251/111170/Vega%20-%20Pruebas%20funcionales%20automatizadas%20para%20aplicaciones%20Web%3A%20usando%20Selenium%20para%20aplicar%20prue....pdf?sequence=1
3. **ISTQB.** (2023). *Certified Tester Foundation Level (CTFL) Syllabus v4.0*. International Software Testing Qualifications Board.
4. **W3C.** (2018). *WebDriver: W3C Recommendation*. World Wide Web Consortium. https://www.w3.org/TR/webdriver1/
