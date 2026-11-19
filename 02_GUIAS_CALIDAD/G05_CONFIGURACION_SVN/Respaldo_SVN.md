# Respaldo y restauración SVN — RESTORA

## Evidencia recibida
- `EVIDENCIAS_SVN/restora_g05_svn_repository.svndump.gz` (dump SVN comprimido).
- `EVIDENCIAS_SVN/registro_ejecucion_svn.txt` (registro de operaciones).
- `DOCUMENTACION_ORIGINAL/Politica_Configuracion.md` (política de control).

## Requisitos
Windows con `svnadmin`, `svn`, y Python 3.8+ instalados. Un directorio de destino **nuevo**; nunca apuntar a un repositorio existente.

## Restauración manual segura
1. Verificar que el dump exista y calcular su SHA-256.
2. Descomprimir el archivo `.gz` a `.svndump` con Python `gzip` o una utilidad compatible, conservando el original.
3. Ejecutar `svnadmin create RUTA_NUEVO_REPOSITORIO`.
4. Ejecutar `svnadmin load RUTA_NUEVO_REPOSITORIO < dump.svndump` desde una consola con redirección adecuada.
5. Verificar `svnadmin verify RUTA_NUEVO_REPOSITORIO` y `svn log file:///RUTA_NUEVO_REPOSITORIO`.
6. Si `/trunk` existe, obtener una copia de trabajo separada con `svn checkout`.

## Advertencias
El paquete incluye el respaldo y un script auxiliar, pero **no certifica una restauración ejecutada en Windows**. La política describe procedimientos planeados y las evidencias deben correlacionarse con el registro SVN real. Ninguna acción debe alterar el repositorio SVN original.
