import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CalendarRange, Download, FileSpreadsheet, FileText, Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { requireSession, useSession } from "@/lib/session";
import { createReporte, listReportes, reporteExportUrl, ApiError } from "@/lib/api";

export const Route = createFileRoute("/reports")({
  ssr: false,
  beforeLoad: ({ context }) => requireSession(context.queryClient),
  head: () => ({
    meta: [
      { title: "restora - Reportes" },
      { name: "description", content: "Genera y exporta reportes de tu restaurante." },
    ],
  }),
  component: ReportsPage,
});

function monthOptions() {
  const opts: { label: string; value: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    opts.push({
      label: d.toLocaleDateString("es-PE", { month: "long", year: "numeric" }),
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    });
  }
  return opts;
}
function monthToRange(value: string) {
  const [y, m] = value.split("-").map(Number) as [number, number];
  const from = new Date(y, m - 1, 1);
  const to = new Date(y, m, 0);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-PE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ReportsPage() {
  const queryClient = useQueryClient();
  const session = useSession();
  const restauranteId = session.data?.restaurante.id ?? "";
  const options = useMemo(monthOptions, []);
  const [month, setMonth] = useState(options[0]!.value);

  const reportes = useQuery({
    queryKey: ["reportes", restauranteId],
    queryFn: () => listReportes(restauranteId),
    enabled: !!restauranteId,
  });

  const generateMutation = useMutation({
    mutationFn: () => createReporte(restauranteId, monthToRange(month)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportes"] });
    },
  });

  return (
    <AppShell active="/reports">
      <PageHeader
        title="Reportes"
        description={`Genera y exporta reportes de ${session.data?.restaurante.nombre ?? "tu restaurante"}.`}
      />

      <Card>
        <CardHeader>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <CalendarRange className="size-4" /> Reporte mensual
          </div>
          <CardTitle className="text-lg">Generar un nuevo reporte</CardTitle>
          <CardDescription className="max-w-xl">
            Totales de desperdicio, pérdida económica e indicadores de segregación y valorización
            del mes seleccionado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              generateMutation.mutate();
            }}
          >
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="rep-mes">Periodo</Label>
              <NativeSelect id="rep-mes" value={month} onChange={(e) => setMonth(e.target.value)}>
                {options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <Button type="submit" disabled={generateMutation.isPending || !restauranteId}>
              <Wand2 /> {generateMutation.isPending ? "Generando…" : "Generar"}
            </Button>
          </form>
          {generateMutation.isError && (
            <p className="mt-3 text-sm text-destructive">
              {generateMutation.error instanceof ApiError
                ? generateMutation.error.message
                : "No se pudo generar el reporte."}
            </p>
          )}
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Reportes recientes</h2>
        {reportes.isError && (
          <p className="text-sm text-destructive">No se pudo cargar el historial de reportes.</p>
        )}
        {reportes.isLoading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        )}
        {reportes.data?.length === 0 && (
          <Card className="border-dashed">
            <EmptyState
              icon={FileText}
              title="Aún no hay reportes generados."
              description="Elige un mes y pulsa «Generar» para crear el primero."
            />
          </Card>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportes.data?.map((r) => (
            <Card key={r.id} className="flex flex-col p-5">
              <span className="mb-4 flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
                <FileSpreadsheet className="size-5" />
              </span>
              <h3 className="text-sm font-semibold">
                {fmtDate(r.periodoFrom)} – {fmtDate(r.periodoTo)}
              </h3>
              <p className="mb-4 mt-1 flex-1 text-sm text-muted-foreground">
                Generado el {fmtDate(r.createdAt)}
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href={reporteExportUrl(restauranteId, r.id)}>
                  <Download /> Descargar CSV
                </a>
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
