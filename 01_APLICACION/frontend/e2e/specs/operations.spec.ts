import { test, expect } from "@playwright/test";
import { freshFechaTurno, uniqueFechaTurno } from "../utils/dates";
import { acceptNextDialog } from "../utils/dialogs";

test("creates a daily operation with a venta and a desperdicio row, then finds and deletes it in history", async ({
  page,
}) => {
  const { fecha, turno } = freshFechaTurno();
  const marker = `E2E-${Date.now()}`;

  await page.goto("/register");
  await page.locator("#entry-date").fill(fecha);
  await page.locator("#entry-turno").selectOption(turno);

  // Placeholders "0"/"0.00"/"0.0" are substrings of each other under Playwright's
  // default fuzzy matching, so each needs exact:true to hit the right field.
  await page.getByPlaceholder("Ej. Lomo Saltado").fill(`Plato ${marker}`);
  await page.getByPlaceholder("0", { exact: true }).fill("5");
  await page.getByPlaceholder("0.00", { exact: true }).fill("50");

  await page.getByPlaceholder("Ej. Arroz, recortes de verdura").fill(`Verduras ${marker}`);
  await page.getByPlaceholder("0.0", { exact: true }).fill("1.5");

  await page.locator("#obs").fill(marker);

  const submit = page.getByRole("button", { name: /Guardar registro/ });
  await expect(submit).toBeEnabled();
  await submit.click();

  await expect(page).toHaveURL("/history");

  // Isolate the just-created record via the unique observaciones marker (searchable server-side).
  // RecordCard root has Tailwind's "group" class; scope to the one card containing our marker
  // (plato/producto names aren't rendered on the card, only turno/observaciones/totals are).
  await page.getByPlaceholder("Buscar registros...").fill(marker);
  const card = page.locator("div.group", { has: page.getByText(marker, { exact: false }) });
  await expect(card).toHaveCount(1);
  await expect(card.getByText("Turno Noche", { exact: false })).toBeVisible();

  acceptNextDialog(page);
  await card.getByTitle("Eliminar registro").click();
  await expect(page.getByText("Ningún registro coincide con estos filtros.")).toBeVisible();
});

test("search filter shows an empty state for a non-matching term", async ({ page }) => {
  await page.goto("/history");
  await page.getByPlaceholder("Buscar registros...").fill("no-existing-search-term-xyz-123");
  await expect(page.getByText("Ningún registro coincide con estos filtros.")).toBeVisible();
});

test("OBS-04: registrar dos veces la misma fecha y turno responde 409 con mensaje claro", async ({ page }) => {
  const me = await (await page.request.get("/api/auth/me")).json();
  const url = `/api/restaurantes/${me.restaurante.id}/operaciones`;
  const body = { fecha: "2033-03-03", turno: "NOCHE", ventas: [{ concepto: "Dup OBS04", cantidad: 1, montoTotal: 1 }] };

  const primero = await page.request.post(url, { data: body });
  expect(primero.status()).toBe(201);
  const segundo = await page.request.post(url, { data: body });
  expect(segundo.status()).toBe(409);
  expect((await segundo.json()).error).toContain("misma fecha y turno");

  await page.request.delete(`${url}/${(await primero.json()).id}`);
});

test("OBS-01: el formulario manual captura producción y la guarda en el registro", async ({ page }) => {
  const { fecha, turno } = uniqueFechaTurno("MANANA");
  const marker = `E2E-PROD-${Date.now()}`;

  await page.goto("/register");
  await page.locator("#entry-date").fill(fecha);
  await page.locator("#entry-turno").selectOption(turno);
  await page.getByLabel("Producto elaborado").fill(`Arroz ${marker}`);
  await page.getByLabel("Cantidad producida").fill("12");
  await page.getByLabel("Unidad de producción").fill("porciones");
  await page.locator("#obs").fill(marker);

  const submit = page.getByRole("button", { name: /Guardar registro/ });
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page).toHaveURL("/history");

  const me = await (await page.request.get("/api/auth/me")).json();
  const url = `/api/restaurantes/${me.restaurante.id}/operaciones`;
  const lista = await (await page.request.get(`${url}?q=${marker}`)).json();
  const registro = (Array.isArray(lista) ? lista : lista.items ?? lista.data)[0];
  expect(registro.producciones).toHaveLength(1);
  expect(registro.producciones[0].cantidadProducida).toBe(12);
  expect(registro.producciones[0].unidad).toBe("porciones");

  await page.request.delete(`${url}/${registro.id}`);
});

test("OBS-03: el historial informa un intervalo con inicio posterior al fin", async ({ page }) => {
  await page.goto("/history");
  await page.getByLabel("Desde").fill("2026-11-10");
  await page.getByLabel("Hasta").fill("2026-11-01");
  await expect(page.getByRole("alert")).toContainText("no puede ser posterior");

  await page.getByLabel("Hasta").fill("2026-11-20");
  await expect(page.getByRole("alert")).toHaveCount(0);

  const me = await (await page.request.get("/api/auth/me")).json();
  const r = await page.request.get(
    `/api/restaurantes/${me.restaurante.id}/operaciones?from=2026-11-10&to=2026-11-01`,
  );
  expect(r.status()).toBe(400);
});
