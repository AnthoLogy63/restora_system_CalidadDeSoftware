# RESTORA — Proyecto final de Calidad de Software

RESTORA es una propuesta de plataforma web para pequeños y medianos restaurantes. Su propósito es centralizar el registro de producción, ventas y desperdicios alimentarios, estimar las pérdidas económicas y presentar información que apoye la planificación y el uso eficiente de los recursos.

## Estado actual

El repositorio ya contiene la aplicación, las nueve guías de calidad, los manuales de usuario y técnico, la matriz de trazabilidad y el registro de defectos. Los entregables se están organizando en `03_ENTREGA_FINAL`; el informe integrador y la presentación final todavía están pendientes de incorporar.

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
│   ├── Plan_Trabajo_RESTORA.xlsx
│   ├── Propuesta_Sistema_RESTORA.docx/.pdf
│   └── RESTORA-Presentacion.pdf
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
├── 03_ENTREGA_FINAL/
│   ├── Informe_Final_RESTORA.docx [pendiente]
│   ├── Informe_Final_RESTORA.pdf [pendiente]
│   ├── Sustentacion_RESTORA.pptx [pendiente]
│   ├── 01_Informe_Integrador/
│   ├── 02_Trazabilidad/
│   ├── 03_Defectos/
│   ├── 04_Manuales/
│   │   ├── Manual_Usuario/
│   │   └── Manual_Tecnico/
│   └── 05_Manifiesto/
├── SKILL-Informes/
│   └── Plantilla.docx
├── Descripción-Restora.txt
├── Estructura.txt
└── README.md
```

| Carpeta | Contenido previsto |
| --- | --- |
| `00_GESTION_GENERAL` | Propuesta, problema, justificación, objetivos, alcance, integrantes, responsabilidades y validación del alcance. |
| `02_GUIAS_CALIDAD` | Documentación y evidencias de requisitos, análisis, diseño, dimensionamiento, configuración, riesgos y pruebas. |
| `03_ENTREGA_FINAL` | Informe integrador y presentación final en la raíz; trazabilidad, defectos y manuales en sus subcarpetas. |

## Documentos de referencia

- [Descripción de RESTORA](Descripción-Restora.txt): planteamiento general, objetivos, funcionalidades y resultados esperados.
- [Estructura propuesta](Estructura.txt): esquema de carpetas y nombres de los entregables previstos.
- [Organización de la aplicación](01_APLICACION/README.md): propósito de las carpetas reservadas para la implementación.

La matriz de trazabilidad y el registro de defectos se encuentran en sus subcarpetas de entrega final, junto con sus informes y evidencias de apoyo. Los manuales y sus fuentes Typst están en `04_Manuales/`. El informe integrador y la presentación final están previstos en la raíz de `03_ENTREGA_FINAL`, pero aún no se han incorporado; `01_Informe_Integrador/` y `05_Manifiesto/` están vacías.

## Trabajo pendiente

1. Precisar el alcance inicial y los requisitos con criterios de aceptación verificables.
2. Definir reglas de negocio, permisos, indicadores y fórmulas de pérdidas.
3. Documentar el análisis y diseño, y seleccionar las tecnologías.
4. Planificar las actividades de calidad, las pruebas y su trazabilidad.
5. Iniciar la implementación y elaborar los entregables una vez definida la planificación.
