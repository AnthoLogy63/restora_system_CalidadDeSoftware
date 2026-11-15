/**
 * Reglas de baja del catálogo (CC-01, FRQ-0005).
 * Un producto referenciado por operaciones históricas no se elimina: se inactiva,
 * para conservar el costo y la trazabilidad de esos registros.
 */
export type BajaProducto = "ELIMINAR" | "INACTIVAR";

export function decidirBajaProducto(
  referenciasHistoricas: number,
): BajaProducto {
  if (!Number.isInteger(referenciasHistoricas) || referenciasHistoricas < 0) {
    throw new RangeError(
      "referenciasHistoricas debe ser un entero mayor o igual a 0",
    );
  }
  return referenciasHistoricas > 0 ? "INACTIVAR" : "ELIMINAR";
}
