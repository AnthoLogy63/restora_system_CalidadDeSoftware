import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { AuthError, requireSession, signSession } from "@/lib/auth";

beforeEach(() => {
  vi.stubEnv("AUTH_SECRET", "restora-test-secret-with-more-than-32-bytes");
});

describe("requireSession tenant isolation (G06 R01)", () => {
  it("permite acceder al restaurante asociado a la sesión", async () => {
    const token = await signSession({ usuarioId: "user-a", restauranteId: "rest-a" });
    const request = new NextRequest("http://localhost/api/restaurantes/rest-a/dashboard", {
      headers: { cookie: `session=${token}` },
    });

    await expect(requireSession(request, "rest-a")).resolves.toMatchObject({
      usuarioId: "user-a",
      restauranteId: "rest-a",
    });
  });

  it("rechaza con 403 una sesión que intenta acceder al restaurante de otro tenant", async () => {
    const token = await signSession({ usuarioId: "user-a", restauranteId: "rest-a" });
    const request = new NextRequest("http://localhost/api/restaurantes/rest-b/dashboard", {
      headers: { cookie: `session=${token}` },
    });

    await expect(requireSession(request, "rest-b")).rejects.toMatchObject({
      status: 403,
      message: "No autorizado para este restaurante",
    });
  });

  it("rechaza solicitudes sin sesión autenticada con 401", async () => {
    const request = new NextRequest("http://localhost/api/restaurantes/rest-a/dashboard");

    await expect(requireSession(request, "rest-a")).rejects.toBeInstanceOf(AuthError);
    await expect(requireSession(request, "rest-a")).rejects.toMatchObject({ status: 401 });
  });
});
