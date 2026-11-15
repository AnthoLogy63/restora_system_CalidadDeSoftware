import { test, expect } from "@playwright/test";
import { acceptNextDialog } from "../utils/dialogs";

test("adds and deletes a producto", async ({ page }) => {
  const nombre = `E2E Producto ${Date.now()}`;
  await page.goto("/catalogo");

  const section = page.locator("section", { has: page.getByRole("heading", { name: "Productos" }) });
  await section.getByPlaceholder("Nombre del producto").fill(nombre);
  await section.getByPlaceholder("Costo S/").fill("9.99");
  const submit = section.getByRole("button", { name: "Agregar" });
  await expect(submit).toBeEnabled();
  await submit.click();

  const row = section.locator("li", { hasText: nombre });
  await expect(row).toHaveCount(1);
  await expect(row).toContainText("S/ 9.99");

  acceptNextDialog(page);
  await row.getByRole("button", { name: "Eliminar producto" }).click();
  await expect(section.getByText(nombre)).toHaveCount(0);
});

test("adds a colaborador, toggles capacitado, then deletes", async ({ page }) => {
  const nombre = `E2E Colaborador ${Date.now()}`;
  await page.goto("/catalogo");

  const section = page.locator("section", {
    has: page.getByRole("heading", { name: "Colaboradores" }),
  });
  await section.getByPlaceholder("Nombre").fill(nombre);
  const submit = section.getByRole("button", { name: "Agregar" });
  await expect(submit).toBeEnabled();
  await submit.click();

  const row = section.locator("li", { hasText: nombre });
  await expect(row).toHaveCount(1);
  await expect(row.getByText("Sin capacitar")).toBeVisible();

  await row.getByTitle("Alternar capacitación").click();
  // The toggle button's own text is the material-icon ligature ("verified")
  // concatenated with the label, so it never equals "Capacitado" exactly —
  // substring match like the "Sin capacitar" check above.
  await expect(row.getByText("Capacitado")).toBeVisible();

  acceptNextDialog(page);
  await row.getByRole("button", { name: "Eliminar colaborador" }).click();
  await expect(section.getByText(nombre)).toHaveCount(0);
});

test("CC-01: un producto con historial se inactiva en lugar de eliminarse", async ({ page }) => {
  const nombre = `E2E Historial ${Date.now()}`;
  const me = await (await page.request.get("/api/auth/me")).json();
  const base = `/api/restaurantes/${me.restaurante.id}`;

  const producto = await (
    await page.request.post(`${base}/productos`, { data: { nombre, costoUnitario: 4.5 } })
  ).json();
  const residuo = await page.request.post(`${base}/residuos`, {
    data: {
      categoria: "MERMA_PREPARACION",
      cantidadKg: 2,
      area: "COCINA",
      productoAsociado: nombre,
      productoId: producto.id,
      motivo: "ERROR_PREPARACION",
      fecha: new Date().toISOString().slice(0, 10),
      turno: "MANANA",
      destinoPrevisto: "PENDIENTE_DEFINIR",
    },
  });
  expect(residuo.ok()).toBeTruthy();

  await page.goto("/catalogo");
  const section = page.locator("section", { has: page.getByRole("heading", { name: "Productos" }) });
  const row = section.locator("li", { hasText: nombre });
  acceptNextDialog(page);
  await row.getByRole("button", { name: "Eliminar producto" }).click();

  await expect(row).toContainText("Inactivo");
  await expect(section.getByRole("status")).toContainText("se inactivó");
  await expect(row.getByRole("button", { name: "Reactivar" })).toBeVisible();

  // El costo histórico del registro no se pierde.
  const lista = await (await page.request.get(`${base}/residuos`)).json();
  const guardado = lista.find((r: { productoId: string | null }) => r.productoId === producto.id);
  expect(guardado.costoTotal).toBeCloseTo(9, 5);

  // Reactivar devuelve el producto al catálogo operativo.
  await row.getByRole("button", { name: "Reactivar" }).click();
  await expect(row).not.toContainText("Inactivo");
});
