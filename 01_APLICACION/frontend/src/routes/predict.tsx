import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  AlertTriangle,
  BrainCircuit,
  Lightbulb,
  LineChart,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireSession, useSession } from "@/lib/session";
import { createPrediccion, listPredicciones, ApiError } from "@/lib/api";

export const Route = createFileRoute("/predict")({
  ssr: false,
  beforeLoad: ({ context }) => requireSession(context.queryClient),
  head: () => ({
    meta: [
      { title: "Predicción IA — restora Cortex" },
      {
        name: "description",
        content:
          "Pronósticos de demanda por plato basados en el historial de ventas del restaurante (modelo RandomForest).",
      },
      { property: "og:title", content: "Predicción IA — restora Cortex" },
    ],
  }),
  component: PredictPage,
});

function inSevenDays() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function PredictPage() {
  const queryClient = useQueryClient();
  const session = useSession();
  const restauranteId = session.data?.restaurante.id ?? "";
  const [fecha, setFecha] = useState(inSevenDays());

  const historial = useQuery({
    queryKey: ["predicciones", restauranteId],
    queryFn: () => listPredicciones(restauranteId),
    enabled: !!restauranteId,
  });

  const latest = historial.data?.find((p) => p.estado === "COMPLETADA" && p.resultado);

  const mutation = useMutation({
    mutationFn: () => createPrediccion(restauranteId, { fecha }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predicciones"] });
    },
  });

  const active = mutation.data?.resultado ?? latest?.resultado ?? null;
  const chartData = (active?.predicciones ?? [])
    .slice()
    .sort((a, b) => b.prediccion - a.prediccion)
    .map((p) => ({ plato: p.plato, unidades: p.prediccion }));
  const top = chartData[0];

  const insufficientData =
    mutation.isError && mutation.error instanceof ApiError && mutation.error.status === 422;

  return (
    <AppShell active="/predict">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="size-4 text-warning" /> restora Cortex
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Inteligencia <span className="ai-gradient-text">predictiva</span>
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Pronóstico de demanda por plato, entrenado con tu propio historial de ventas (modelo
            RandomForest).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            className="w-44"
            type="date"
            aria-label="Fecha a predecir"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
          <Button disabled={mutation.isPending || !restauranteId} onClick={() => mutation.mutate()}>
            <RefreshCw className={mutation.isPending ? "animate-spin" : ""} />
            {mutation.isPending ? "Prediciendo…" : "Predecir"}
          </Button>
        </div>
      </div>

      {insufficientData && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          {mutation.error instanceof ApiError
            ? mutation.error.message
            : "Aún no hay suficiente historial de ventas."}
        </div>
      )}
      {mutation.isError && !insufficientData && (
        <p className="text-sm text-destructive">
          No se pudo ejecutar la predicción. Inténtalo de nuevo.
        </p>
      )}

      {active && top && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#2a1018] to-[#4a1528] p-6 text-white shadow-lg md:p-8">
          <div className="absolute right-0 top-0 size-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="relative z-10 flex flex-col items-start gap-5 md:flex-row md:items-center">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
              <Lightbulb className="size-6" />
            </span>
            <div className="flex-1">
              <h3 className="mb-1.5 text-lg font-semibold text-amber-200">
                Recomendación de Cortex
              </h3>
              <p className="text-sm leading-relaxed text-white/85">
                Mayor demanda esperada: <strong className="text-white">{top.plato}</strong> (~
                {top.unidades.toFixed(0)} unidades). Precisión del modelo ~
                {active.metrics.precisionPct.toFixed(0)}% sobre el historial de este restaurante:
                prepara en consecuencia y registra el desperdicio real en el registro del turno.
              </p>
            </div>
            <Button asChild variant="secondary" className="shrink-0 rounded-full">
              <Link to="/register">Registrar ajuste</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div className="space-y-1.5">
              <CardTitle className="text-base">Pronóstico de demanda</CardTitle>
              <CardDescription>Unidades previstas por plato para {fecha}</CardDescription>
            </div>
            <LineChart className="size-5 text-primary" />
          </CardHeader>
          <CardContent className="h-[340px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: -16, right: 8 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="plato"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={64}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--accent)" }}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="unidades"
                    fill="var(--chart-1)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={BrainCircuit}
                title="Aún no hay pronóstico"
                description="Ejecuta una predicción para ver el pronóstico de demanda por plato."
              />
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <span className="mb-2 flex size-10 items-center justify-center rounded-full bg-success/12 text-success">
              <ShieldCheck className="size-5" />
            </span>
            <CardTitle className="text-base">Confianza del modelo</CardTitle>
            <div className="pt-2">
              <span className="text-4xl font-semibold tabular-nums">
                {active ? active.metrics.precisionPct.toFixed(0) : "—"}
              </span>{" "}
              <span className="text-sm text-muted-foreground">% precisión</span>
            </div>
          </CardHeader>
          {active && (
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-muted-foreground">MAE (error prom.)</span>
                <span className="font-semibold">{active.metrics.mae.toFixed(1)} unidades</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">R²</span>
                <span className="font-semibold">{active.metrics.r2.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Entrenado</span>
                <span className="font-semibold">
                  {new Date(active.entrenadoEn).toLocaleDateString("es-PE")}
                </span>
              </div>
            </CardContent>
          )}
        </Card>

        <section className="space-y-3 md:col-span-3">
          <div>
            <h2 className="text-base font-semibold">Metas de producción</h2>
            <p className="text-sm text-muted-foreground">
              Niveles de preparación sugeridos según la demanda prevista
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {chartData.slice(0, 6).map((t) => (
              <Card key={t.plato} className="flex items-center gap-4 p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <UtensilsCrossed className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold">{t.plato}</h3>
                  <span className="text-sm font-medium text-primary">
                    {t.unidades.toFixed(0)} unidades sugeridas
                  </span>
                </div>
              </Card>
            ))}
            {chartData.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aún no hay pronóstico — ejecuta una predicción arriba.
              </p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
