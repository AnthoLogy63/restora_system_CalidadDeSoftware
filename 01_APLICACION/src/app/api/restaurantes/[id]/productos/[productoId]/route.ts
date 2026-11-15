import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { handleRouteError, NotFoundError } from "@/lib/api-helpers";
import { updateProductoSchema } from "@/lib/validation/producto";
import { decidirBajaProducto } from "@/lib/catalogo";

export const dynamic = "force-dynamic";

async function getOwnedProducto(restauranteId: string, productoId: string) {
  const producto = await db.producto.findFirst({ where: { id: productoId, restauranteId } });
  if (!producto) throw new NotFoundError("Producto no encontrado");
  return producto;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productoId: string }> }
) {
  try {
    const { id, productoId } = await params;
    await requireSession(request, id);
    const producto = await getOwnedProducto(id, productoId);
    return NextResponse.json(producto);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productoId: string }> }
) {
  try {
    const { id, productoId } = await params;
    await requireSession(request, id);
    await getOwnedProducto(id, productoId);
    const body = await request.json();
    const data = updateProductoSchema.parse(body);
    const producto = await db.producto.update({ where: { id: productoId }, data });
    return NextResponse.json(producto);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productoId: string }> }
) {
  try {
    const { id, productoId } = await params;
    await requireSession(request, id);
    await getOwnedProducto(id, productoId);
    // CC-01: con historial, el producto se inactiva para conservar costos y trazabilidad.
    const referencias = await db.residuo.count({ where: { productoId, restauranteId: id } });
    if (decidirBajaProducto(referencias) === "INACTIVAR") {
      await db.producto.update({ where: { id: productoId }, data: { activo: false } });
      return NextResponse.json({ ok: true, inactivado: true });
    }
    await db.producto.delete({ where: { id: productoId } });
    return NextResponse.json({ ok: true, inactivado: false });
  } catch (error) {
    return handleRouteError(error);
  }
}
