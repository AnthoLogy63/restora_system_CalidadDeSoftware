@echo off
setlocal EnableExtensions DisableDelayedExpansion
REM Uso: restore_svn.bat "RUTA_DESTINO_NUEVO"
if "%~1"=="" (echo Uso: %~nx0 "RUTA_DESTINO_NUEVO" & exit /b 2)
where svnadmin >nul 2>&1 || (echo ERROR: svnadmin no instalado. & exit /b 3)
where py >nul 2>&1 || (echo ERROR: Lanzador Python py no encontrado. & exit /b 4)
set "DEST=%~f1"
set "DUMP=%~dp0..\EVIDENCIAS_SVN\restora_g05_svn_repository.svndump.gz"
if not exist "%DUMP%" (echo ERROR: no existe el dump "%DUMP%" & exit /b 5)
if exist "%DEST%" (echo ERROR: destino ya existente. Elija otro. & exit /b 6)
set "TEMP_DUMP=%TEMP%\restora_%RANDOM%%RANDOM%.svndump"
py -c "import gzip,shutil,sys;shutil.copyfileobj(gzip.open(sys.argv[1],'rb'),open(sys.argv[2],'wb'))" "%DUMP%" "%TEMP_DUMP%"
if errorlevel 1 (echo ERROR descomprimiendo. & exit /b 7)
svnadmin create "%DEST%"
if errorlevel 1 (echo ERROR creando el repositorio. & del /q "%TEMP_DUMP%" & exit /b 8)
svnadmin load "%DEST%" < "%TEMP_DUMP%"
set "LOAD_ERROR=%ERRORLEVEL%"
del /q "%TEMP_DUMP%" >nul 2>&1
if not "%LOAD_ERROR%"=="0" (echo ERROR cargando dump. El destino puede haber quedado incompleto. & exit /b 9)
svnadmin verify "%DEST%"
if errorlevel 1 (echo ERROR verificando el repositorio. & exit /b 10)
echo OK: repositorio restaurado y verificado en "%DEST%"
exit /b 0
