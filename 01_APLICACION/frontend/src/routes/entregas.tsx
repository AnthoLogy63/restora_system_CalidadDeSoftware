import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Camera, FileText, PackageOpen, Recycle, Save, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { requireSession, useSession } from "@/lib/session";
import {
  listEntregas,
  createEntrega,
  deleteEntrega,
  ApiError,
  type CategoriaResiduo,
} from "@/lib/api";
import { ETIQUETA_CATEGORIA, CATEGORIAS_VALORIZABLES, opcionesDe } from "@/lib/etiquetas";

export const Route = createFileRoute("/entregas")({
  ssr: false,
  beforeLoad: ({ context }) => requireSession(context.queryClient),
  head: () => ({
    meta: [
      { title: "restora - Entregas" },
      {
        name: "description",
        content: "Registra entregas a recicladores con evidencia para la trazabilidad.",
      },
    ],
  }),
  component: EntregasPage,
});

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function fmtFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function errMsg(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

function EntregasPage() {
  const queryClient = useQueryClient();
  const session = useSession();
  const restauranteId = session.data?.restaurante.id ?? "";

  const [categoria, setCategoria] = useState<CategoriaResiduo>("CARTON");
  const [pesoKg, setPesoKg] = useState("");
  const [fecha, setFecha] = useState(todayISO());
  const [receptor, setReceptor] = useState("");
  const [fotografiaUrl, setFotografiaUrl] = useState("");
  const [constanciaUrl, setConstanciaUrl] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const entregas = useQuery({
    queryKey: ["entregas", restauranteId],
    queryFn: () => listEntregas(restauranteId),
    enabled: !!restauranteId,
  });

  const crear = useMutation({
    mutationFn: () =>
      createEntrega(restauranteId, {
        categoria,
        pesoKg: Number(pesoKg),
        fecha,
        receptor: receptor.trim(),
        ...(fotografiaUrl.trim() ? { fotografiaUrl: fotografiaUrl.trim() } : {}),
        ...(constanciaUrl.trim() ? { constanciaUrl: constanciaUrl.trim() } : {}),
        ...(observaciones.trim() ? { observaciones: observaciones.trim() } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entregas"] });
      queryClient.invalidateQueries({ queryKey: ["indicadores"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setPesoKg("");
      setReceptor("");
      setFotografiaUrl("");
      setConstanciaUrl("");
      setObservaciones("");
    },
  });

  const eliminar = useMutation({
    mutationFn: (id: string) => deleteEntrega(restauranteId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entregas"] });
      queryClient.invalidateQueries({ queryKey: ["indicadores"] });
    },
  });

  const puedeGuardar = restauranteId && Number(pesoKg) > 0 && receptor.trim().length >= 2;

  return (
    <AppShell active="/entregas">
      <PageHeader
        title="Entregas a recicladores"
        description="Registra a quién entregas tus residuos valorizables y adjunta evidencia. Esto alimenta los indicadores de valorización y trazabilidad."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Recycle className="size-5 text-success" /> Nueva entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (puedeGuardar) crear.mutate();
                }}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="e-cat">Categoría</Label>
                  <NativeSelect
                    id="e-cat"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as CategoriaResiduo)}
                  >
                    {opcionesDe(ETIQUETA_CATEGORIA).map((o) => (
                      <option key={o.valor} value={o.valor}>
                        {o.etiqueta}
                        {CATEGORIAS_VALORIZABLES.includes(o.valor) ? " ♻️" : ""}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="e-peso">Peso (kg)</Label>
                    <Input
                      id="e-peso"
                      inputMode="decimal"
                      placeholder="0.0"
                      value={pesoKg}
                      onChange={(e) => setPesoKg(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="e-fecha">Fecha</Label>
                    <Input
                      id="e-fecha"
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="e-receptor">Receptor / reciclador</Label>
                  <Input
                    id="e-receptor"
                    placeholder="Ej. Recicladora San Martín"
                    value={receptor}
                    onChange={(e) => setReceptor(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="e-foto">URL de fotografía (opcional)</Label>
                  <Input
                    id="e-foto"
                    placeholder="https://…"
                    value={fotografiaUrl}
                    onChange={(e) => setFotografiaUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="e-const">URL de constancia (opcional)</Label>
                  <Input
                    id="e-const"
                    placeholder="https://…"
                    value={constanciaUrl}
                    onChange={(e) => setConstanciaUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="e-obs">Observaciones (opcional)</Label>
                  <Textarea
                    id="e-obs"
                    rows={2}
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                  />
                </div>

                {crear.isError && (
                  <p className="text-sm text-destructive">
                    {errMsg(crear.error, "No se pudo registrar la entrega.")}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={!puedeGuardar || crear.isPending}
                >
                  <Save /> {crear.isPending ? "Guardando…" : "Registrar entrega"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-3 lg:col-span-3">
          <h2 className="text-base font-semibold">Entregas registradas</h2>
          {entregas.isLoading && (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          )}
          {entregas.isError && (
            <p className="text-sm text-destructive">No se pudo cargar el historial de entregas.</p>
          )}
          {entregas.data?.length === 0 && (
            <Card className="border-dashed">
              <EmptyState
                icon={PackageOpen}
                title="Aún no registras entregas."
                description="La primera entrega hará subir tu % de valorización."
              />
            </Card>
          )}
          <ul className="space-y-3">
            {entregas.data?.map((e) => (
              <li key={e.id}>
                <Card className="flex items-start justify-between gap-4 p-4">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-success/12 text-success">
                        <Recycle className="size-4" />
                      </span>
                      {ETIQUETA_CATEGORIA[e.categoria]} · {e.pesoKg} kg
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {fmtFecha(e.fecha)} · {e.receptor}
                    </p>
                    <div className="flex gap-3">
                      {e.fotografiaUrl && (
                        <a
                          href={e.fotografiaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          <Camera className="size-3.5" /> Foto
                        </a>
                      )}
                      {e.constanciaUrl && (
                        <a
                          href={e.constanciaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          <FileText className="size-3.5" /> Constancia
                        </a>
                      )}
                    </div>
                    {e.observaciones && (
                      <p className="text-sm italic text-muted-foreground">{e.observaciones}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Eliminar entrega"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      if (confirm("¿Eliminar esta entrega?")) eliminar.mutate(e.id);
                    }}
                  >
                    <Trash2 />
                  </Button>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
