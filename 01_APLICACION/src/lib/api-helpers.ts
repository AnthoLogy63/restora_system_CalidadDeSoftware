import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthError } from "@/lib/auth";

export function jsonError(status: number, message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function handleRouteError(error: unknown): NextResponse {
  if (error instanceof AuthError) {
    return jsonError(error.status, error.message);
  }
  if (error instanceof ZodError) {
    return jsonError(400, "Datos inválidos", error.flatten());
  }
  if (error instanceof NotFoundError) {
    return jsonError(404, error.message);
  }
  if (isUniqueViolation(error)) {
    return jsonError(409, "Ya existe un registro con esos datos (por ejemplo, la misma fecha y turno).");
  }
  console.error(error);
  return jsonError(500, "Error interno del servidor");
}

export class NotFoundError extends Error {}

/** Violación de restricción única (Prisma P2002): se informa como conflicto, no como error interno. */
export function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: unknown }).code === "P2002";
}

export function parseDateRange(searchParams: URLSearchParams): { from: Date; to: Date } {
  const fromRaw = searchParams.get("from");
  const toRaw = searchParams.get("to");
  const to = toRaw ? new Date(toRaw) : new Date();
  const from = fromRaw
    ? new Date(fromRaw)
    : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
  return { from, to };
}
