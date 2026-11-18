= Operación, Monitoreo y Mantenimiento Técnico

La continuidad operativa y la confiabilidad del sistema RESTORA exigen protocolos de mantenimiento preventivo, políticas de respaldo de datos y monitoreo de la salud de los servicios.

== Políticas de Respaldo y Restauración de Base de Datos

Al utilizar *SQLite* como motor de persistencia, toda la información operativa del restaurante reside en el archivo único `01_APLICACION/dev.db`.

=== Procedimiento de Respaldo en Caliente (*Hot Backup*)
Para realizar una copia de seguridad sin necesidad de detener los servicios de Node.js, se debe emplear el comando nativo de respaldo transaccional de SQLite, garantizando que no se capture un estado inconsistente en medio de una transacción:

```bash
# Script de Respaldo Automatizado (backup_restora.sh)
FECHA=$(date +%Y%m%d_%H%M%S)
DESTINO="/var/backups/restora/backup_${FECHA}.db"

# Ejecutar respaldo consistente en caliente
sqlite3 01_APLICACION/dev.db ".backup '${DESTINO}'"

# Generar suma de comprobación criptográfica
sha256sum "${DESTINO}" > "${DESTINO}.sha256"

# Comprimir el archivo resultante
gzip "${DESTINO}"
```

*Frecuencia recomendada:* Respaldo diario al cierre del turno noche (23:30 hrs) y retención local durante 30 días calendario.

=== Procedimiento de Restauración ante Corrupción
En caso de fallo de disco, corrupción accidental o desastre operativo:
+ Detener los procesos en ejecución de Node.js (`kill -9 ...` o `Stop-Process`).
+ Renombrar el archivo dañado: `mv dev.db dev.db.corrupto`.
+ Descomprimir el respaldo íntegro más reciente:
  ```bash
  gunzip -c /var/backups/restora/backup_20261118_233000.db.gz > 01_APLICACION/dev.db
  ```
+ Verificar la integridad física de las páginas de base de datos:
  ```bash
  sqlite3 01_APLICACION/dev.db "PRAGMA integrity_check;"
  # Debe responder: ok
  ```
+ Reanudar los servicios del backend y frontend.

== Monitoreo de Salud del Sistema y Diagnóstico

El backend dispone de un endpoint de sondeo de disponibilidad (*Health Check*) accesible sin autenticación en:
`GET http://localhost:3000/api/health`

Este servicio puede vincularse a herramientas de monitoreo como *Uptime Kuma*, *Prometheus* o scripts de *cron* en el servidor. La respuesta esperada debe ser `200 OK` con un cuerpo JSON válido:

```json
{
  "status": "ok",
  "timestamp": "2026-11-18T14:30:00.000Z"
}
```

Si el endpoint no responde en un lapso de 5 segundos o emite códigos de la serie 5xx, el orquestador del sistema debe emitir una alerta crítica y reiniciar el proceso Node.js.

== Auditoría de Logs y Eventos Críticos

Todos los eventos significativos de seguridad y de negocio son registrados en la consola estándar del servidor con formato estructurado:
- Intentos de inicio de sesión fallidos (posibles ataques de fuerza bruta).
- Bajas lógicas de productos de catálogo (cambio CC-01).
- Eliminación de registros de operación de turnos.
- Fallos en la comunicación con proveedores externos de IA o en el subproceso Python.

En entornos de producción, la salida de `stdout` y `stderr` debe ser capturada mediante un gestor de procesos como *PM2* o *systemd*:

```bash
# Ejemplo de gestión mediante PM2 en producción
pm2 start npm --name "restora-backend" -- run start
pm2 start "cd frontend && npm run preview" --name "restora-frontend"
pm2 logs restora-backend
```

== Protocolo de Reentrenamiento del Modelo de Machine Learning

El modelo predictivo de demanda (`predictor/train.py`) debe reentrenarse periódicamente para incorporar la estacionalidad reciente y los nuevos patrones de consumo del restaurante.

*Condición de disparo:* Cada vez que se acumulen 30 nuevos registros diarios de turnos completos en la base de datos.

*Comando de reentrenamiento manual:*
```bash
# En el directorio 01_APLICACION
./predictor/.venv/bin/python predictor/train.py --restauranteId cm3r01demo
```

El script efectúa la validación cruzada, genera las métricas de error cuadrático medio (RMSE) y actualiza el binario serializado correspondiente en `predictor/models/<restauranteId>.joblib`. Si el reentrenamiento no arroja un $R^2$ superior a $0.65$, se conserva la versión anterior del modelo para evitar la degradación del servicio predictivo.

== Plan de Contingencias Técnicas

#table(
  columns: (1.5fr, 2fr, 2.5fr),
  table.header([*Escenario de Fallo*], [*Impacto en la Operación*], [*Protocolo de Contingencia*]),
  [Caída de API de Gemini / Groq], [El chat de lenguaje natural no interpreta consultas externas.], [Activación automática del motor determinista local en `src/lib/ai/dialogo.ts`. El usuario puede continuar registrando datos mediante árboles guiados de botones sin interrupción.],
  [Bloqueo de base SQLite por concurrencia], [Peticiones HTTP simultáneas reciben `SQLITE_BUSY`.], [El adaptador `better-sqlite3` tiene configurado un `busy_timeout` de 5000 ms con modo WAL (*Write-Ahead Logging*). En caso extremo, reiniciar el servicio.],
  [Falla del intérprete de Python], [Las predicciones de demanda emiten error en pantalla.], [El frontend captura la excepción y muestra el historial estático sin bloquear el registro de ventas ni el catálogo de productos.]
)
