import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Lightbulb,
  ListChecks,
  Recycle,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { requireSession, useSession } from "@/lib/session";
import {
  getIndicadores,
  getRecomendaciones,
  getTendencias,
  listAcciones,
  createAccion,
  ApiError,
  type Recomendacion,
} from "@/lib/api";
import { ETIQUETA_CATEGORIA, ETIQUETA_MOTIVO } from "@/lib/etiquetas";

export const Route = createFileRoute("/analytics")({
  ssr: false,
  beforeLoad: ({ context }) => requireSession(context.queryClient),
  head: () => ({
    meta: [
      { title: "restora - Análisis" },
      { name: "description", content: "Sigue tus metas de reducción de desperdicio." },
    ],
  }),
  component: AnalyticsPage,
});

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "#a8a29e",
];
const TOOLTIP_STYLE = { borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 };
const TICK = { fill: "var(--muted-foreground)", fontSize: 12 };

function humanize(label: string): string {
  return label.charAt(0) + label.slice(1).toLowerCase().replace(/_/g, " ");
}
function etiquetaCategoria(label: string): string {
  return (ETIQUETA_CATEGORIA as Record<string, string>)[label] ?? humanize(label);
}
function etiquetaMotivo(label: string): string {
  return (ETIQUETA_MOTIVO as Record<string, string>)[label] ?? humanize(label);
}
function fmtWeek(iso: string) {
  return new Date(iso).toLocaleDateString("es-PE", { month: "short", day: "numeric" });
}
function monthRange(offsetMonths: number) {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
  const to =
    offsetMonths === 0 ? now : new Date(now.getFullYear(), now.getMonth() + offsetMonths + 1, 0);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

function AnalyticsPage() {
  const session = useSession();
  const queryClient = useQueryClient();
  const restauranteId = session.data?.restaurante.id ?? "";
  const [period, setPeriod] = useState<"Este mes" | "Mes anterior">("Este mes");
  const range = monthRange(period === "Este mes" ? 0 : -1);

  const indicadores = useQuery({
    queryKey: ["indicadores", restauranteId, range.from, range.to],
    queryFn: () => getIndicadores(restauranteId, range),
    enabled: !!restauranteId,
  });
  const tendencias = useQuery({
    queryKey: ["tendencias", restauranteId, range.from, range.to],
    queryFn: () => getTendencias(restauranteId, range),
    enabled: !!restauranteId,
  });
  const recomendaciones = useQuery({
    queryKey: ["recomendaciones", restauranteId, range.from, range.to],
    queryFn: () => getRecomendaciones(restauranteId, range),
    enabled: !!restauranteId,
  });
  const acciones = useQuery({
    queryKey: ["acciones", restauranteId],
    queryFn: () => listAcciones(restauranteId),
    enabled: !!restauranteId,
  });

  const aplicar = useMutation({
    mutationFn: (rec: Recomendacion) =>
      createAccion(restauranteId, {
        recomendacionCodigo: rec.codigo,
        descripcion: rec.titulo,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["acciones"] });
      queryClient.invalidateQueries({ queryKey: ["indicadores"] });
    },
  });

  const codigosAplicados = useMemo(
    () => new Set((acciones.data ?? []).map((a) => a.recomendacionCodigo)),
    [acciones.data],
  );

  const wasteData = useMemo(
    () =>
      (tendencias.data?.tendencia ?? []).map((b) => ({
        week: fmtWeek(b.periodoInicio),
        waste: Number(b.totalKg.toFixed(1)),
      })),
    [tendencias.data],
  );
  const lossData = useMemo(
    () =>
      Object.entries(indicadores.data?.generacion.porCategoria ?? {}).map(([categoria, kg]) => ({
        category: etiquetaCategoria(categoria),
        kg: Number(kg.toFixed(1)),
      })),
    [indicadores.data],
  );
  const causesData = useMemo(
    () =>
      Object.entries(indicadores.data?.analisis.porMotivo ?? {}).map(([motivo, kg], i) => ({
        name: etiquetaMotivo(motivo),
        value: Number(kg.toFixed(1)),
        color: PALETTE[i % PALETTE.length]!,
      })),
    [indicadores.data],
  );
  const listaRecs = recomendaciones.data?.recomendaciones ?? [];
  const cargando = indicadores.isLoading;

  return (
    <AppShell active="/analytics">
      <PageHeader
        title="Análisis de desempeño"
        description="Sigue tus metas de reducción de desperdicio."
        actions={
          <Button
            variant="outline"
            onClick={() => setPeriod(period === "Este mes" ? "Mes anterior" : "Este mes")}
          >
            {period} <ChevronDown />
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Pérdida económica total"
          icon={CircleDollarSign}
          tone="danger"
          loading={cargando}
          value={
            indicadores.data ? `S/ ${indicadores.data.economia.perdidaEstimada.toFixed(0)}` : "—"
          }
          hint={period}
        />
        <StatCard
          label="Valorización"
          icon={Recycle}
          tone="success"
          loading={cargando}
          value={
            indicadores.data?.valorizacionPct != null
              ? `${indicadores.data.valorizacionPct.toFixed(0)}%`
              : "—"
          }
          hint={`Trazabilidad: ${
            indicadores.data?.trazabilidadPct != null
              ? `${indicadores.data.trazabilidadPct.toFixed(0)}%`
              : "—"
          }`}
        />
        <StatCard
          label="Prevención"
          icon={TrendingDown}
          tone="primary"
          loading={cargando}
          value={
            indicadores.data?.prevencionPct != null
              ? `${indicadores.data.prevencionPct.toFixed(1)}%`
              : "—"
          }
          hint="Reducción frente a tu línea base"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Evolución del desperdicio (kg)</CardTitle>
            <CardDescription>Total semanal del periodo seleccionado</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            {tendencias.isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : wasteData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wasteData} margin={{ left: -16, right: 8 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" tick={TICK} axisLine={false} tickLine={false} />
                  <YAxis tick={TICK} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line
                    type="monotone"
                    dataKey="waste"
                    stroke="var(--chart-1)"
                    strokeWidth={2.5}
                    dot={{ fill: "var(--card)", stroke: "var(--chart-1)", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={TrendingDown} title="No hay datos de tendencia en este periodo." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Desperdicio por categoría (kg)</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            {lossData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lossData} margin={{ left: -16, right: 8 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="category"
                    tick={{ ...TICK, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={56}
                  />
                  <YAxis tick={TICK} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "var(--accent)" }} />
                  <Bar dataKey="kg" fill="var(--chart-5)" radius={[6, 6, 0, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={TrendingDown} title="No hay datos en este periodo." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Principales causas</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            {causesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={causesData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    stroke="var(--card)"
                  >
                    {causesData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={TrendingDown} title="No hay datos en este periodo." />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="size-5 text-warning" /> Recomendaciones para este periodo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recomendaciones.isLoading && (
            <p className="text-sm text-muted-foreground">Cargando recomendaciones…</p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {listaRecs.map((rec) => {
              const aplicado = codigosAplicados.has(rec.codigo);
              const esSinAlertas = rec.codigo === "R10_SIN_ALERTAS";
              return (
                <div
                  key={rec.codigo}
                  className="flex flex-col rounded-lg border bg-secondary/30 p-4"
                >
                  <div className="mb-1.5 flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold">{rec.titulo}</h4>
                    <Badge variant="soft" className="shrink-0">
                      P{rec.prioridad}
                    </Badge>
                  </div>
                  <p className="flex-1 text-sm text-muted-foreground">{rec.descripcion}</p>
                  {!esSinAlertas && (
                    <div className="mt-3">
                      {aplicado ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                          <CheckCircle2 className="size-4" /> Marcada como aplicada
                        </span>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => aplicar.mutate(rec)}
                          disabled={aplicar.isPending}
                        >
                          <ListChecks /> Marcar como aplicada
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {aplicar.isError && (
            <p className="mt-3 text-sm text-destructive">
              {aplicar.error instanceof ApiError
                ? aplicar.error.message
                : "No se pudo registrar la acción."}
            </p>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
