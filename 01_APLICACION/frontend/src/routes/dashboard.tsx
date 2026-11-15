import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Leaf, PiggyBank, Plus, Receipt, Scale, TrendingDown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { requireSession, useSession } from "@/lib/session";
import { getDashboard, getTendencias } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  beforeLoad: ({ context }) => requireSession(context.queryClient),
  head: () => ({
    meta: [
      { title: "Panel — restora" },
      {
        name: "description",
        content:
          "Métricas operativas del día: pérdida económica, desperdicio generado, prevención y operaciones registradas.",
      },
      { property: "og:title", content: "Panel — restora" },
      {
        property: "og:description",
        content: "Métricas de desperdicio y pérdida del restaurante en un solo panel.",
      },
    ],
  }),
  component: DashboardPage,
});

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-PE", { month: "short", day: "numeric" });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-PE", { hour: "numeric", minute: "2-digit" });
}
function pct(n: number | null): string {
  return n == null ? "—" : `${n.toFixed(1)}%`;
}
function money(n: number): string {
  return `S/ ${n.toFixed(2)}`;
}

function DashboardPage() {
  const session = useSession();
  const restauranteId = session.data?.restaurante.id ?? "";

  const dashboard = useQuery({
    queryKey: ["dashboard", restauranteId],
    queryFn: () => getDashboard(restauranteId),
    enabled: !!restauranteId,
  });

  const tendencias = useQuery({
    queryKey: ["tendencias", restauranteId, "dashboard"],
    queryFn: () => getTendencias(restauranteId),
    enabled: !!restauranteId,
  });

  const chartData =
    tendencias.data?.tendencia.map((b) => ({
      semana: fmtDate(b.periodoInicio),
      kg: Number(b.totalKg.toFixed(1)),
    })) ?? [];
  const resumen = dashboard.data?.resumen;
  const cargando = dashboard.isLoading;

  return (
    <AppShell active="/dashboard">
      <PageHeader
        title="Resumen"
        description={`Métricas operativas de ${session.data?.restaurante.nombre ?? "tu restaurante"}.`}
        actions={
          <Button asChild>
            <Link to="/register">
              <Plus /> Registrar el día
            </Link>
          </Button>
        }
      />

      {dashboard.isError && (
        <p className="text-sm text-destructive">No se pudo cargar el panel. Intenta recargar.</p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Pérdida est."
          icon={TrendingDown}
          tone="danger"
          loading={cargando}
          value={resumen ? money(resumen.perdidaEstimada) : "—"}
          hint="Costo de lo desperdiciado"
        />
        <StatCard
          label="Desperdicio"
          icon={Scale}
          tone="warning"
          loading={cargando}
          value={resumen ? `${resumen.totalKg.toFixed(1)} kg` : "—"}
          hint="Total registrado"
        />
        <StatCard
          label="Prevención"
          icon={Leaf}
          tone="success"
          loading={cargando}
          value={resumen ? pct(resumen.prevencionPct) : "—"}
          hint="Residuos evitados"
        >
          <Progress
            value={Math.max(0, Math.min(100, resumen?.prevencionPct ?? 0))}
            className="mt-3 h-1.5"
          />
        </StatCard>
        <StatCard
          label="Operaciones"
          icon={Receipt}
          tone="primary"
          loading={cargando}
          value={dashboard.data?.ultimasOperaciones.length ?? "—"}
          hint="Registradas hace poco"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Desempeño semanal</CardTitle>
            <CardDescription>Kilos de desperdicio por semana</CardDescription>
          </CardHeader>
          <CardContent>
            {tendencias.isLoading ? (
              <Skeleton className="h-60 w-full" />
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} margin={{ left: -16, right: 8 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="semana"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: "var(--accent)" }}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [`${v} kg`, "Desperdicio"]}
                  />
                  <Bar dataKey="kg" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={56} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={PiggyBank}
                title="Aún no hay datos de tendencia"
                description="Registra operaciones para ver la evolución semanal."
              />
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Actividad reciente</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link to="/history">Ver todo</Link>
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            {dashboard.data?.ultimasOperaciones.length === 0 && (
              <EmptyState icon={Receipt} title="Aún no hay operaciones registradas." />
            )}
            <div className="divide-y">
              {dashboard.data?.ultimasOperaciones.map((op) => (
                <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0" key={op.id}>
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                    <Receipt className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      Operación
                      <Badge variant="soft">
                        {op.turno === "MANANA"
                          ? "Mañana"
                          : op.turno === "TARDE"
                            ? "Tarde"
                            : "Noche"}
                      </Badge>
                    </div>
                    <div className="truncate text-sm text-muted-foreground">
                      {op.totalDesperdicioKg.toFixed(1)} kg desperdicio · S/{" "}
                      {op.totalVentas.toFixed(0)} en ventas
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground/80">
                      {fmtDate(op.fecha)}, {fmtTime(op.fecha)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
