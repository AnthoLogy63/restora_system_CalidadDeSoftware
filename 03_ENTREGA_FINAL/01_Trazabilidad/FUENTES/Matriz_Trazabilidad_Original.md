# Matriz de trazabilidad – RESTORA

## Resumen
Esta matriz relaciona los 10 requisitos funcionales (RF) y los 5 requisitos no funcionales (RNF) aprobados con los casos de prueba existentes, evidencias y defectos asociados.

| ID Requisito | Tipo | Descripción | Fuente | Versión | Componente | Ruta Código | ID Prueba | Tipo Prueba | Criterio de aceptación | Resultado | Evidencia | Versión Verif. | Defecto Rel. | Observaciones |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| FRQ-0001 | RF | Iniciar sesión | SDD v1.1 | 0.9.0 | API auth | src/lib/api-helpers.test.ts | TC-RF-001 | Funcional | Usuario autenticado, token devuelto | Pendiente | src/lib/api-helpers.test.ts | 0.9.0 |  |  |
| FRQ-0002 | RF | Cerrar sesión | SDD v1.1 | 0.9.0 | API auth | src/lib/api-helpers.test.ts | TC-RF-002 | Funcional | Sesión terminada, token invalidado | Pendiente | src/lib/api-helpers.test.ts | 0.9.0 |  |  |
| FRQ-0005 | RF | Mantener catálogo de alimentos | SDD v1.1 | 0.9.0 | API catalogo | src/lib/catalogo.test.ts | TC-RF-005 | Funcional | Alimento creado/actualizado/borrado | Pendiente | src/lib/catalogo.test.ts | 0.9.0 |  |  |
| FRQ-0006 | RF | Registrar producción diaria | SDD v1.1 | 0.9.0 | API operaciones | src/lib/api-helpers.test.ts | TC-RF-006 | Funcional | Producción registrada correctamente | Pendiente | src/lib/api-helpers.test.ts | 0.9.0 |  |  |
| FRQ-0008 | RF | Registrar ventas por alimento | SDD v1.1 | 0.9.0 | API operaciones | src/lib/api-helpers.test.ts | TC-RF-008 | Funcional | Venta almacenada | Pendiente | src/lib/api-helpers.test.ts | 0.9.0 |  |  |
| FRQ-0010 | RF | Registrar desperdicios | SDD v1.1 | 0.9.0 | API residuos | src/lib/api-helpers.test.ts | TC-RF-010 | Funcional | Desperdicio guardado | Pendiente | src/lib/api-helpers.test.ts | 0.9.0 |  |  |
| FRQ-0013 | RF | Estimar pérdida por desperdicio | SDD v1.1 | 0.9.0 | Lib costo | src/lib/costo.test.ts | TC-RF-013 | Funcional | Cálculo correcto de pérdida | Pendiente | src/lib/costo.test.ts | 0.9.0 |  |  |
| FRQ-0014 | RF | Consultar historial por periodo | SDD v1.1 | 0.9.0 | API operaciones | src/lib/api-helpers.test.ts | TC-RF-014 | Funcional | Historial filtrado por fechas | Pendiente | src/lib/api-helpers.test.ts | 0.9.0 |  |  |
| FRQ-0016 | RF | Visualizar indicadores operativos | SDD v1.1 | 0.9.0 | Lib estadisticas | src/lib/estadisticas.test.ts | TC-RF-016 | Funcional | Indicadores mostrados | Pendiente | src/lib/estadisticas.test.ts | 0.9.0 |  |  |
| FRQ-0020 | RF | Presentar recomendaciones básicas | SDD v1.1 | 0.9.0 | Lib recomendaciones | src/lib/recomendaciones.test.ts | TC-RF-020 | Funcional | Recomendaciones generadas | Pendiente | src/lib/recomendaciones.test.ts | 0.9.0 |  |  |
| NFR-0002 | RNF | Protección de contraseñas y sesiones | SDD v1.1 | 0.9.0 | Lib auth | src/lib/password.test.ts | TC-RNF-002 | Seguridad | Passwords hashed, JWT signed | Pendiente | src/lib/password.test.ts | 0.9.0 |  |  |
| NFR-0003 | RNF | Integridad de las operaciones | SDD v1.1 | 0.9.0 | Validaciones | src/lib/validation/auth.test.ts | TC-RNF-003 | Seguridad | Operaciones rechazan datos corruptos | Pendiente | src/lib/validation/auth.test.ts | 0.9.0 |  |  |
| NFR-0004 | RNF | Persistencia de la información | SDD v1.1 | 0.9.0 | Prisma | prisma/schema.prisma | TC-RNF-004 | Mantenimiento | Datos guardados en DB | Pendiente | prisma/schema.prisma | 0.9.0 |  |  |
| NFR-0005 | RNF | Claridad de formularios y mensajes | SDD v1.1 | 0.9.0 | Frontend | frontend/components | TC-RNF-005 | Usabilidad | Mensajes claros en UI | Pendiente | frontend/components | 0.9.0 |  |  |
| NFR-0008 | RNF | Configuración y mantenibilidad | SDD v1.1 | 0.9.0 | Infra | next.config.ts | TC-RNF-008 | Mantenibilidad | Configuración versionada y documentada | Pendiente | next.config.ts | 0.9.0 |  |  |

### Indicadores automáticos (para la versión Excel eventual)
- **Total RF**: 10
- **Total RNF**: 5
- **Requisitos con pruebas**: 15 (todos tienen al menos una prueba asociada)
- **Requisitos sin pruebas**: 0
- **Cobertura RF**: 100 %
- **Cobertura RNF**: 100 %
- **Pruebas pendientes**: 15 (estado *Pendiente* a validar)

Esta tabla será exportada a `00_GESTION_GENERAL/Matriz_Trazabilidad_RESTORA.xlsx` con las fórmulas correspondientes.
