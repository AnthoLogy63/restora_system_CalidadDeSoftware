# Registro y Reporte de Defectos — Guía 09 (Selenium E2E)
## Sistema RESTORA — Calidad de Software (UNSA)

Este documento registra formalmente los defectos, validaciones anómalas y controles defensivos evaluados durante la ejecución de la suite automatizada con Selenium WebDriver 4 sobre la aplicación web **RESTORA**.

---

### Resumen Ejecutivo de Defectos

| ID Defecto | Caso Asociado | Severidad | Proceso de RESTORA | Estado | Resolución Técnica |
|---|---|:---:|---|:---:|---|
| **DEF-G09-001** | CP-05 (Datos Inválidos) | Media | Proceso 2: Trazabilidad de Entregas | **Cerrado** | Doble barrera de validación: Deshabilitación reactiva en cliente (`puedeGuardar`) y validación Zod en backend. |
| **DEF-G09-002** | CP-03 (Rutas Protegidas) y CP-08 (Logout) | Alta | Transversal (Seguridad RF-01 / RF-02) | **Cerrado** | Guardia síncrono `requireSession` en `beforeLoad` de TanStack Router e invalidación de cookie en `/auth/logout`. |
| **DEF-G09-003** | EJ-27 (Cross-Browser) | Baja | Compatibilidad (RNF-05) | **Cerrado** | Adopción de Selenium 4 con Selenium Manager para motores Gecko (Firefox) y Chromium (Brave). |

---

### Análisis Detallado de Incidentes

#### 1. DEF-G09-001: Validación de Campos Numéricos en Registro de Entregas
- **Escenario:** Un usuario o automatizador ingresa un valor negativo (`-12.5 kg`) o nulo en el formulario de entregas valorizables (`/entregas`).
- **Riesgo:** Inconsistencia en balances de masa, distorsión de KPIs de economía circular y posible corrupción de agregaciones estadísticas en SQLite.
- **Resultado de la Verificación:**
  El frontend evalúa reactivamente:
  ```typescript
  const puedeGuardar = categoria && pesoValido && receptor.trim().length > 0;
  ```
  Al ingresar `-12.5`, `pesoValido` evalúa a `false`, manteniendo el botón `<button type="submit" disabled>` inhabilitado para el clic del usuario. La base de datos `dev.db` se mantuvo 100% íntegra.

#### 2. DEF-G09-002: Fuga de Sesión y Navegación hacia Atrás
- **Escenario:** Un operador cierra sesión formalmente desde `/dashboard`, pero posteriormente presiona el botón "Atrás" del navegador (`driver.back()`).
- **Riesgo:** Exposición visual indebida de datos del restaurante a un usuario posterior en una terminal compartida.
- **Resultado de la Verificación:**
  El guardia de ruta `requireSession` intercepta la carga de la vista y consulta `me()` al backend:
  ```typescript
  export async function requireSession(queryClient: QueryClient) {
    try {
      return await queryClient.ensureQueryData(sessionQueryOptions);
    } catch {
      throw redirect({ to: "/auth" });
    }
  }
  ```
  Al estar la cookie invalidada, la petición devuelve HTTP 401 y el enrutador fuerza la redirección a `/auth` de manera imperativa, bloqueando el renderizado de cualquier vista sensible.

---

### Dictamen de Defectos
> **Conclusión:** No existen defectos bloqueantes ni críticos abiertos. Los mecanismos de defensa en profundidad (validación reactiva en cliente + validación Zod en servidor + middleware de autenticación) responden satisfactoriamente a las pruebas automatizadas de aceptación.
