# RESTORA — Proyecto final de Calidad de Software

RESTORA es una propuesta de plataforma web para pequeños y medianos restaurantes. Su propósito es centralizar el registro de producción, ventas y desperdicios alimentarios, estimar las pérdidas económicas y presentar información que apoye la planificación y el uso eficiente de los recursos.

## Estado actual

El proyecto se encuentra en la etapa de estructuración y planificación. Se ha creado la organización de carpetas para el desarrollo y la documentación de calidad. La aplicación, la base de datos y las pruebas están pendientes de implementación; los entregables se elaborarán durante las siguientes etapas.

La carpeta `proyecto-Calidad/` es la raíz de RESTORA y corresponde a `RESTORA/` en el esquema de `Estructura.txt`.

## Objetivo

Desarrollar una plataforma web que permita registrar, monitorear y analizar las operaciones de producción, ventas y desperdicio alimentario de restaurantes, facilitando la reducción de pérdidas económicas y la optimización de recursos.

## Alcance propuesto

- Autenticación, administración de usuarios y permisos por rol.
- Registro y consulta de producción y ventas.
- Registro de desperdicios con cantidades, categorías y causas.
- Cálculo de pérdidas económicas estimadas.
- Panel de indicadores, historial de operaciones y reportes.
- Alertas y recomendaciones basadas en la información registrada, sujetas a priorización.

Los usuarios previstos son el administrador o gerente y el personal operativo. Los requisitos, las reglas de negocio y los permisos específicos se definirán antes de la implementación. Las predicciones mediante inteligencia artificial y las integraciones automáticas con sistemas externos se consideran posibles ampliaciones futuras.

## Estructura de carpetas

```text
proyecto-Calidad/
├── 00_GESTION_GENERAL/
│   ├── 01_Propuesta_Proyecto/
│   └── 02_Organizacion/
├── 01_APLICACION/
│   ├── frontend/
│   ├── backend/
│   ├── database/
│   │   └── migrations/
│   └── config/
├── 02_GUIAS_CALIDAD/
│   ├── G01_REQUERIMIENTOS/
│   ├── G02_PROCESO_REQUERIMIENTOS/
│   ├── G03_ANALISIS_DISENO/
│   ├── G04_DIMENSIONAMIENTO/
│   ├── G05_CONFIGURACION_SVN/
│   ├── G06_RIESGOS/
│   ├── G07_PRUEBAS_UNITARIAS/
│   ├── G08_RENDIMIENTO_JMETER/
│   └── G09_CALIDAD_SELENIUM/
├── 03_INFORME_Y_ENTREGA_FINAL/
│   ├── 01_Informe_Integrador/
│   ├── 02_Trazabilidad/
│   ├── 03_Defectos/
│   ├── 04_Manuales/
│   ├── 05_Manifiesto/
│   └── 06_Anexos/
├── 04_SUSTENTACION/
│   ├── 01_Diapositivas/
│   ├── 02_Demostracion/
│   └── 03_Resultados/
└── README.md
```

| Carpeta | Contenido previsto |
| --- | --- |
| `00_GESTION_GENERAL` | Propuesta, problema, justificación, objetivos, alcance, integrantes, responsabilidades y validación del alcance. |
| `01_APLICACION` | Interfaz, lógica de negocio, base de datos, migraciones y configuración de la futura aplicación. |
| `02_GUIAS_CALIDAD` | Documentación y evidencias de requisitos, análisis, diseño, dimensionamiento, configuración, riesgos y pruebas. |
| `03_INFORME_Y_ENTREGA_FINAL` | Informe integrador, trazabilidad, defectos, manuales, manifiesto de versiones y evidencias, y anexos. |
| `04_SUSTENTACION` | Presentación, guion de demostración y resumen de resultados de calidad. |

## Documentos de referencia

- [Descripción de RESTORA](Descripción-Restora.txt): planteamiento general, objetivos, funcionalidades y resultados esperados.
- [Estructura propuesta](Estructura.txt): esquema de carpetas y nombres de los entregables previstos.
- [Organización de la aplicación](01_APLICACION/README.md): propósito de las carpetas reservadas para la implementación.

Los archivos de entrega enumerados en `Estructura.txt` se crearán cuando se desarrolle su contenido. Las imágenes existentes se conservan en su ubicación original y su relación con el proyecto está pendiente de definir.

## Trabajo pendiente

1. Precisar el alcance inicial y los requisitos con criterios de aceptación verificables.
2. Definir reglas de negocio, permisos, indicadores y fórmulas de pérdidas.
3. Documentar el análisis y diseño, y seleccionar las tecnologías.
4. Planificar las actividades de calidad, las pruebas y su trazabilidad.
5. Iniciar la implementación y elaborar los entregables una vez definida la planificación.
