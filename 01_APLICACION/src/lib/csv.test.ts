import { describe, it, expect } from "vitest";
import { toCsv } from "@/lib/csv";

describe("toCsv", () => {
  it("cadena vacía cuando no hay filas", () => {
    expect(toCsv([])).toBe("");
  });

  it("genera cabecera a partir de las claves de la primera fila", () => {
    const csv = toCsv([{ a: 1, b: 2 }]);
    expect(csv.split("\n")[0]).toBe("a,b");
  });

  it("serializa varias filas", () => {
    const csv = toCsv([
      { nombre: "arroz", kg: 3 },
      { nombre: "pollo", kg: 5 },
    ]);
    expect(csv).toBe("nombre,kg\narroz,3\npollo,5");
  });

  it("entrecomilla valores con coma, comillas o salto de línea", () => {
    const csv = toCsv([{ texto: 'dice "hola", adiós' }]);
    expect(csv.split("\n")[1]).toBe('"dice ""hola"", adiós"');
  });

  it("trata null y undefined como celda vacía", () => {
    const csv = toCsv([{ a: null, b: undefined, c: 0 }]);
    expect(csv.split("\n")[1]).toBe(",,0");
  });

  it("neutraliza valores textuales que podrían ejecutarse como fórmulas", () => {
    const csv = toCsv([
      { igual: "=1+1", suma: "+cmd", arroba: "@SUM(A1:A2)", tab: "\t=1+1" },
    ]);
    expect(csv.split("\n")[1]).toBe("'=1+1,'+cmd,'@SUM(A1:A2),'\t=1+1");
  });

  it("conserva números negativos como números y no altera texto seguro", () => {
    const csv = toCsv([{ monto: -3, texto: "café" }]);
    expect(csv.split("\n")[1]).toBe("-3,café");
  });

  it("entrecomilla y neutraliza una fórmula con separadores", () => {
    const csv = toCsv([{ texto: '=HYPERLINK("https://ejemplo.pe", "abrir")' }]);
    expect(csv.split("\n")[1]).toBe('"\'=HYPERLINK(""https://ejemplo.pe"", ""abrir"")"');
  });
});
