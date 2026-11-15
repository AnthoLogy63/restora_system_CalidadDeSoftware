import { describe, expect, it } from "vitest";
import { registroOperacionFiltersSchema } from "@/lib/validation/registroOperacion";

describe("registroOperacionFiltersSchema (OBS-03)", () => {
  it("rechaza un intervalo con inicio posterior al fin", () => {
    const r = registroOperacionFiltersSchema.safeParse({ from: "2026-11-10", to: "2026-11-01" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].message).toMatch(/posterior/);
  });

  it("acepta un intervalo válido, el mismo día y filtros parciales", () => {
    expect(
      registroOperacionFiltersSchema.safeParse({ from: "2026-11-01", to: "2026-11-10" }).success,
    ).toBe(true);
    expect(
      registroOperacionFiltersSchema.safeParse({ from: "2026-11-05", to: "2026-11-05" }).success,
    ).toBe(true);
    expect(registroOperacionFiltersSchema.safeParse({ from: "2026-11-05" }).success).toBe(true);
  });
});
