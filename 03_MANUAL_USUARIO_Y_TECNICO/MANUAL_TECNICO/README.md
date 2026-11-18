# RESTORA — Manual Técnico de Sistema

Manual Técnico formal elaborado en **Typst** para la plataforma web **RESTORA** (Sistema Inteligente de Gestión y Valorización de Residuos Orgánicos para Restaurantes Turísticos de Arequipa), correspondiente a la entrega del Trabajo Final Integrador del curso de **Calidad de Software (Semestre 2026-B)**, Escuela Profesional de Ingeniería de Sistemas — Universidad Nacional de San Agustín (UNSA).

---

## 📄 Documento Compilado

El manual técnico se encuentra compilado en formato PDF de alta resolución:
- 📌 **Archivo PDF:** [`manual_tecnico.pdf`](manual_tecnico.pdf)

---

## 🛠️ Instrucciones de Compilación con Typst

Para recompilar el documento tras realizar modificaciones en el texto o configuración:

```bash
# Situarse en este directorio
cd 03_MANUAL_USUARIO_Y_TECNICO/MANUAL_TECNICO

# Compilar a PDF
typst compile main.typ manual_tecnico.pdf

# Modo observador (recompila automáticamente al guardar cambios)
typst watch main.typ manual_tecnico.pdf
```

---

## 📂 Estructura de Archivos del Manual

```text
MANUAL_TECNICO/
├── main.typ                         # Archivo maestro que orquesta las secciones
├── config.typ                       # Parámetros institucionales, portada y tipografía
├── plantilla.typ                    # Reglas de maquetación, encabezados y sangría francesa
├── referencias.bib                  # Bibliografía técnica y normativa (IEEE / ISO / W3C)
├── manual_tecnico.pdf               # Documento PDF compilado
├── imagenes/                        # Galería de diagramas, mockups y evidencias de calidad
│   ├── logo-izquierdo.png           # Escudo EPIS - UNSA
│   ├── logo-derecho.png             # Escudo institucional UNSA
│   ├── G03_arquitectura.png         # Diagrama de arquitectura de componentes
│   ├── G03_clases.png               # Diagrama de clases de dominio
│   ├── G03_modelo_datos.png         # Diagrama Entidad-Relación de base de datos
│   ├── G03_secuencia_registrar_turno.png # Diagrama de secuencia del proceso de registro
│   ├── register.png                 # Mockup de registro multi-ítem de operaciones
│   ├── dashboard.png                # Mockup de dashboard analítico y KPIs
│   ├── CC01_2_producto_inactivado.png # Evidencia de baja lógica (Cambio CC-01)
│   ├── QA_Riesgos.png               # Matriz de riesgos y mapa de calor MAGERIT
│   ├── cobertura_index.png          # Reporte V8 de cobertura de pruebas unitarias (>80%)
│   ├── defecto.png                  # Evidencia del ensayo de defecto controlado
│   ├── 05_dashboard_apdex_carga.png # Dashboard JMeter de índice Apdex bajo carga
│   ├── 09_estres_escalonado.png     # Gráfica de estrés escalonado (10-25-50 usuarios)
│   ├── 08_ej9_explicit_wait_restora.png # Prueba Selenium E2E con esperas explícitas
│   └── 10_ej27_crossbrowser_firefox.png # Prueba Selenium Cross-Browser en Firefox
└── secciones/
    ├── 01-introduccion.typ          # Propósito, alcance, audiencia y árbol de código
    ├── 02-arquitectura-tecnologias.typ # Monorepo, stack, seguridad JWT e IPC Node-Python
    ├── 03-modelo-datos-persistencia.typ # Esquema Prisma, tablas, enums y baja lógica CC-01
    ├── 04-especificacion-api-servicios.typ # Endpoints REST, esquemas Zod y contratos JSON
    ├── 05-instalacion-despliegue-configuracion.typ # Requisitos, .env, Prisma migrate/seed y FAQ
    ├── 06-calidad-pruebas-verificacion.typ # Trazabilidad integral de las 9 Guías (G01 a G09)
    ├── 07-operacion-mantenimiento.typ # Respaldo SQLite, health check, logs y contingencias
    ├── 08-conclusiones-glosario.typ # Conclusiones técnicas y glosario de términos
    └── 09-referencias.typ           # Referencias bibliográficas formales
```

---

## 👥 Equipo de Trabajo (EPIS - UNSA)

- **Ajra Huacso, Jeans Anthony**
- **Barrios Medina, Mathias Alonso**
- **Hancco Mullisaca, Sergio Danilo**
- **Valdivia Segovia, Ryan Fabian**

**Docente(s):** M en C Jesús Martín Silva Fernández / Ing. José Rafael Delgado Bastidas  
**Curso:** Calidad de Software (2026-B)  
**Semestre:** VIII Semestre  
