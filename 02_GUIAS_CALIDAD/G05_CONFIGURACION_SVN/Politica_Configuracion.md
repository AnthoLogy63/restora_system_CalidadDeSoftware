# Política de Configuración – RESTORA

## 1. Propósito
Esta política define cómo se gestionan los artefactos de configuración del proyecto RESTORA mediante Apache Subversion (SVN). Garantiza la trazabilidad, la reproducibilidad y la integridad del código fuente y de los artefactos de calidad.

## 2. Alcance
Aplica a todos los elementos listados en **G05.2 – Elementos de Configuración**:
- Requisitos (ERS, G01)
- Diseño (SDD, G03)
- Código fuente (directorio `01_APLICACION/`)
- Base de datos (esquema Prisma)
- Scripts (migraciones, despliegue, pruebas)
- Pruebas (unitarias, JMeter, Selenium)
- Documentación (manuales, guías G01‑G09)

## 3. Roles y Responsabilidades
| Rol | Responsabilidad |
|-----|-----------------|
| **Propietario** | Ryan Valdivia – mantiene la política y autoriza cambios críticos. |
| **Administrador SVN** | Configura el repositorio, crea tags/branches y verifica integridad. |
| **Desarrollador** | Realiza commits atómicos, escribe mensajes claros y actualiza los artefactos de configuración. |
| **Revisor de Calidad** | Verifica que cada commit cumpla con la política y que los archivos de evidencias se incluyan. |

## 4. Estructura del Repositorio
```
/trunk               <-- línea base de desarrollo
    /src/            <-- código fuente
    /prisma/         <-- esquema DB
    /tests/          <-- pruebas unitarias
    /docs/           <-- documentación (G01‑G09)
/branches            <-- trabajos paralelos (ej. feature‑g05)
/tags                <-- versiones liberadas (ej. Version_1.0.0)
```

## 5. Convenciones de Versionado y Nomenclatura
- **Versiones**: `Major.Minor.Patch` (ej. `1.0.0`). Los tags siguen la convención `/tags/Version_<Major>.<Minor>.<Patch>`.
- **Branches**: `branches/<feature‑nombre>` o `branches/<bug‑id>`.
- **Commits**: `<Tipo>: <Resumen> | <ID‑requisito> | <ID‑defecto opcional>`
  - Tipos: `ADD`, `FIX`, `DOC`, `TEST`, `CONFIG`.
- **Archivos de evidencia**: Se guardan bajo `02_GUIAS_CALIDAD/G05_CONFIGURACION_SVN/Evidencias/` con nombre descriptivo (`log_<rev>.txt`).

## 6. Procedimientos
### 6.1 Creación de la rama
1. `svn copy ^/trunk ^/branches/feature‑<nombre> -m "Creación rama para <nombre>"`
2. Realizar `svn checkout ^/branches/feature‑<nombre>` en un directorio de trabajo separado.

### 6.2 Integración (Merge)
1. Actualizar la rama con los últimos cambios del trunk: `svn merge ^/trunk`
2. Resolver conflictos manualmente; registrar los marcadores y la solución en `EVIDENCIAS/SVN/registro_conflicto_<rev>.txt`.
3. `svn commit -m "Merge de trunk a feature‑<nombre> | Resolución de conflicto"`

### 6.3 Etiquetado de versión final
```
svn copy ^/trunk ^/tags/Version_<Major>.<Minor>.<Patch> -m "Etiqueta versión <Major>.<Minor>.<Patch>"
```

### 6.4 Recuperación de revisión
Para volver a una revisión anterior (ej. r5):
```
svn update -r 5
```
Para crear una copia de trabajo basada en esa revisión y luego volver al HEAD:
```
svn checkout -r 5 ^/trunk work_r5
# ... verificar ...
svn update
```

### 6.5 Respaldo Portable
1. Exportar el repositorio a un dump: `svnadmin dump <ruta_repo> > repositorio_restora.svndump`
2. Comprimir (`gzip`) y almacenar en `00_GESTION_GENERAL/Respaldo_SVN/`.
3. Incluir en `Respaldo_SVN.md` las instrucciones de restauración (ver sección 7).

## 7. Respaldo y Restauración (Instrucciones)
1. **Descomprimir** el dump: `gzip -d repositorio_restora.svndump.gz`.
2. **Crear** un nuevo repositorio vacío: `svnadmin create /tmp/restora_restore`.
3. **Cargar** el dump: `svnadmin load /tmp/restora_restore < repositorio_restora.svndump`.
4. **Verificar** integridad: `svn log file:///tmp/restora_restore`.
5. **Checkout** para uso: `svn checkout file:///tmp/restora_restore/trunk`.

## 8. Control de Cambios
- Cada cambio debe documentarse en el **registro de cambios** (ver `Registro_Defectos.xlsx` para defectos y `Gestor_Requisitos_G02.xlsx` para requisitos).
- Los cambios mayores de versión requieren **aprobación del comité de cambios** y la actualización de la etiqueta.

## 9. Auditoría y Cumplimiento
- Se realizará una auditoría trimestral para validar que la política se sigue.
- Se archivarán los logs de `svn log` y los reportes de `svn diff --summarize` como evidencia.

---
*Esta política está versionada como `v1.0.0` y se incluye en el repositorio bajo `00_GESTION_GENERAL/`.*