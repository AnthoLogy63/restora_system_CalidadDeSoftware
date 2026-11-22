= Introducción

El presente documento constituye el *Manual Técnico de Sistema* de la plataforma *RESTORA* (Sistema Inteligente de Gestión y Valorización de Residuos Orgánicos para Restaurantes Turísticos de Arequipa), desarrollado en el marco del curso de *Calidad de Software* de la Escuela Profesional de Ingeniería de Sistemas (EPIS - UNSA).

RESTORA es una solución integral orientada a pequeñas y medianas empresas del sector gastronómico y turístico de la región Arequipa. Su propósito fundamental es transformar registros diarios de operación —frecuentemente omitidos o consignados en soportes precarios de papel— en métricas cuantificables de costos, trazabilidad regulatoria de valorización hacia recicladores formales, recomendaciones algorítmicas de prevención y predicciones automatizadas de demanda operativa.

== Propósito y Objetivos del Manual Técnico

El objetivo de este manual es proporcionar al equipo de desarrollo, analistas de sistemas, evaluadores de aseguramiento de calidad (QA), auditores y administradores de infraestructura una guía técnica exhaustiva, reproducible y verificable sobre la arquitectura interna, diseño de datos, especificación de contratos de interfaz, protocolos de despliegue, baterías de pruebas y procedimientos de mantenimiento del producto.

Específicamente, este manual técnico persigue:
+ Documentar la arquitectura de software desacoplada (Frontend reactivo TanStack Start/Vite, Backend API REST Next.js 16, Capa de persistencia Prisma ORM con SQLite y Subsistema de predicción analítica en Python).
+ Detallar el modelo de datos relacional y las invariantes de negocio garantizadas a nivel de motor de base de datos y esquemas de validación estructural.
+ Especificar el catálogo completo de endpoints HTTP RESTful, sus contratos JSON y el mecanismo de seguridad y control de acceso mediante tokens criptográficos JWT.
+ Describir el procedimiento de instalación, configuración del entorno local y preparación de datos iniciales.
+ Demostrar la trazabilidad integral y la correspondencia verificable con las nueve guías de laboratorio del curso de Calidad de Software (desde la especificación de requisitos en G01 hasta la aceptación automatizada en G09).
+ Definir las pautas de operación, respaldo de información, monitoreo de salud y recuperación ante desastres en entornos de producción controlados.

== Alcance del Sistema RESTORA

El sistema comprende la automatización y control de tres procesos de negocio centrales:
+ *Gestión de Operaciones Diarias y Registro de Desperdicios:* Captura multi-ítem y transaccional de ventas, producción elaborada y residuos generados durante los turnos de mañana, tarde o noche, calculando automáticamente la pérdida económica en soles (PEN) a partir de los costos unitarios del catálogo de productos.
+ *Trazabilidad de Valorización y Salida de Residuos (Entregas):* Registro formal de entregas de materiales aprovechables (cartón, vidrio, plástico, aceite vegetal usado, restos orgánicos) a recolectores y centros de acopio autorizados, incorporando evidencia fotográfica y número de constancia física para cumplimiento ambiental.
+ *Analítica Predictiva y Recomendaciones Operativas:* Motor determinista de diez reglas expertas (R1 a R10) que emite alertas preventivas ante desviaciones de mermas, acoplado a un modelo de Machine Learning (Random Forest Regressor) ejecutado en Python que proyecta la demanda por producto con el fin de evitar la sobreproducción en cocina.

== Audiencia Técnica y Prerrequisitos

Este manual está dirigido a:
- *Ingenieros de Software y Desarrolladores:* Encargados del mantenimiento evolutivo, corrección de defectos e integración de nuevos módulos o adaptadores de terceros.
- *Ingenieros de Calidad de Software (QA / Testers):* Responsables de la reproducción y ejecución de pruebas unitarias, análisis de cobertura estática, pruebas de rendimiento bajo carga y regresión automatizada sobre interfaz de usuario.
- *Administradores de Sistemas / DevOps:* Personal técnico a cargo del aprovisionamiento del entorno, configuración de variables de entorno seguras, respaldo periódico del motor SQLite y orquestación de servicios en servidores locales o en la nube.

Se asumen conocimientos consolidados en desarrollo web sobre el ecosistema TypeScript/Node.js, protocolos HTTP/1.1, estándares RESTful, modelado relacional SQL, bibliotecas de aprendizaje automático en Python (`scikit-learn`), frameworks de pruebas automatizadas (`vitest`, `selenium-webdriver`) y herramientas de inyección de carga (`Apache JMeter`).

== Estructura del Repositorio de la Aplicación

El código fuente ejecutable del producto se encuentra centralizado en el directorio `01_APLICACION` del repositorio general del proyecto, organizado bajo el siguiente árbol de componentes:

```text
01_APLICACION/
├── src/                          # Backend API REST (Next.js 16 App Router)
│   ├── app/                      # Rutas HTTP públicas y protegidas
│   │   ├── api/
│   │   │   ├── auth/             # Autenticación (login, register, session, logout)
│   │   │   ├── health/           # Sondeo de disponibilidad (Health Check)
│   │   │   └── restaurantes/[id]/# Endpoints del tenant (operaciones, residuos, etc.)
│   ├── lib/                      # Lógica de dominio, reglas, costo y seguridad
│   │   ├── ai/                   # Asistente IA (Gemini, Groq, motor determinista)
│   │   ├── validation/           # Esquemas Zod de validación sintáctica y semántica
│   │   ├── auth.ts               # Guardianes de sesión JWT y tokens
│   │   ├── costo.ts              # Motor de costeo económico de mermas
│   │   ├── db.ts                 # Instancia singleton del cliente Prisma
│   │   ├── estadisticas.ts       # Algoritmos de agregación y métricas de sostenibilidad
│   │   ├── pythonBridge.ts       # Adaptador IPC de subproceso Python
│   │   └── recomendaciones.ts    # Motor de reglas operativas R1-R10
│   └── generated/prisma/         # Cliente ORM tipado generado automáticamente
├── frontend/                     # Frontend desacoplado (TanStack Start / React 19 / Vite)
│   ├── src/
│   │   ├── routes/               # Enrutamiento de páginas (dashboard, register, etc.)
│   │   ├── components/           # Componentes UI reutilizables y Shell visual
│   │   ├── hooks/                # Custom React hooks (sesión, asistente, estado)
│   │   └── lib/                  # Clientes HTTP fetch tipados y utilitarios
│   ├── vite.config.ts            # Proxy de desarrollo reverso hacia :3000
│   └── package.json              # Dependencias del subsistema frontend
├── prisma/                       # Definición de persistencia
│   ├── schema.prisma             # Modelo declarativo de entidades y relaciones
│   ├── migrations/               # Historial de migraciones DDL versionadas
│   └── seed.ts                   # Datos semilla reproducibles de demostración
├── predictor/                    # Subsistema analítico y Machine Learning en Python
│   ├── train.py                  # Pipeline de entrenamiento RandomForest + GridSearchCV
│   ├── predict.py                # Inferencia en tiempo real sobre datos operativos
│   ├── common.py                 # Transformaciones y serialización de modelos .joblib
│   └── requirements.txt          # Dependencias Python (scikit-learn, joblib, numpy)
├── dev.db                        # Base de datos relacional SQLite local
├── .env.example                  # Plantilla de variables de configuración requeridas
├── package.json                  # Dependencias del backend y scripts de ejecución
└── vitest.config.ts              # Configuración de pruebas unitarias y cobertura V8
```
