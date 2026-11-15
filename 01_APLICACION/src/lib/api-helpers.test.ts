import { describe, it, expect, vi } from "vitest";
import { handleRouteError, isUniqueViolation, NotFoundError } from "@/lib/api-helpers";

describe("handleRouteError (OBS-04)", () => {
  it("responde 409 ante una violación de restricción única de Prisma", async () => {
    const res = handleRouteError(Object.assign(new Error("unique"), { code: "P2002" }));
    expect(res.status).toBe(409);
    expect((await res.json()).error).toMatch(/misma fecha y turno/);
  });

  it("sigue respondiendo 404 para NotFoundError", () => {
    expect(handleRouteError(new NotFoundError("no existe")).status).toBe(404);
  });

  it("responde 500 ante un error desconocido", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(handleRouteError(new Error("boom")).status).toBe(500);
    spy.mockRestore();
  });

  it("isUniqueViolation solo reconoce el código P2002", () => {
    expect(isUniqueViolation({ code: "P2002" })).toBe(true);
    expect(isUniqueViolation({ code: "P2025" })).toBe(false);
    expect(isUniqueViolation(null)).toBe(false);
    expect(isUniqueViolation("P2002")).toBe(false);
  });
});
