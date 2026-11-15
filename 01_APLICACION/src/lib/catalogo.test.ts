import { describe, it, expect } from "vitest";
import { decidirBajaProducto } from "@/lib/catalogo";

describe("decidirBajaProducto (CC-01 / FRQ-0005)", () => {
  it("elimina el producto cuando no tiene operaciones históricas", () => {
    expect(decidirBajaProducto(0)).toBe("ELIMINAR");
  });

  it("inactiva el producto cuando tiene una operación histórica (valor límite)", () => {
    expect(decidirBajaProducto(1)).toBe("INACTIVAR");
  });

  it("inactiva el producto cuando tiene muchas operaciones históricas", () => {
    expect(decidirBajaProducto(250)).toBe("INACTIVAR");
  });

  it("rechaza conteos negativos", () => {
    expect(() => decidirBajaProducto(-1)).toThrow(RangeError);
  });

  it("rechaza conteos no enteros", () => {
    expect(() => decidirBajaProducto(1.5)).toThrow(RangeError);
  });
});
