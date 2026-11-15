import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CalendarDays, Search, SearchX, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { requireSession, useSession } from "@/lib/session";
import { deleteOperacion, listOperaciones, type RegistroOperacion, type Turno } from "@/lib/api";

export const Route = createFileRoute("/history")({
  ssr: false,
  beforeLoad: ({ context }) => requireSession(context.queryClient),
  head: () => ({
    meta: [
      { title: "restora - Historial" },
      { name: "description", content: "Revisa los registros diarios y su impacto económico." },
    ],
  }),
  component: HistoryPage,
});

function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-PE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
const ETIQUETA_TURNO_CORTO: Record<Turno, string> = {
  MANANA: "Mañana",
  TARDE: "Tarde",
  NOCHE: "Noche",
};
function totals(op: RegistroOperacion) {
  const sales = op.ventas.reduce((s, v) => s + v.montoTotal, 0);
  const wasteKg = op.residuos.reduce((s, r) => s + r.cantidadKg, 0);
  const impact = op.residuos.reduce((s, r) => s + (r.costoTotal ?? 0), 0);
  const missingCost = op.residuos.some((r) => r.costoTotal == null);
  return { sales, wasteKg, impact, missingCost };
}

function Dato({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-base font-semibold tabular-nums ${tone ?? ""}`}>{value}</p>
    </div>
  );
}

function RecordCard({
  op,
  onDelete,
  deleting,
}: {
  op: RegistroOperacion;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const { sales, wasteKg, impact, missingCost } = totals(op);
  return (
    <Card className="group p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
            <CalendarDays className="size-5" />
          </span>
          <div>
            <h3 className="text-base font-semibold">{fmtDate(op.fecha)}</h3>
            <p className="text-xs text-muted-foreground">
              Turno {ETIQUETA_TURNO_CORTO[op.turno]}
              {op.observaciones ? ` · ${op.observaciones}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={missingCost ? "warning" : "success"}>
            {missingCost ? "Falta costo" : "Conciliado"}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            disabled={deleting}
            onClick={() => onDelete(op.id)}
            title="Eliminar registro"
            aria-label="Eliminar registro"
            type="button"
          >
            <Trash2 />
          </Button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-3">
        <Dato label="Ventas" value={`S/ ${sales.toFixed(2)}`} />
        <Dato label="Desperdicio" value={`${wasteKg.toFixed(1)} kg`} />
        <Dato label="Impacto econ." value={`- S/ ${impact.toFixed(2)}`} tone="text-destructive" />
      </div>
    </Card>
  );
}

function HistoryPage() {
  const queryClient = useQueryClient();
  const session = useSession();
  const restauranteId = session.data?.restaurante.id ?? "";

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 350);
  const [turno, setTurno] = useState<Turno | "">("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const rangoInvalido = !!from && !!to && from > to;

  const operaciones = useQuery({
    queryKey: ["operaciones", restauranteId, debouncedSearch, turno, from, to],
    queryFn: () =>
      listOperaciones(restauranteId, {
        ...(debouncedSearch ? { q: debouncedSearch } : {}),
        ...(turno ? { turno } : {}),
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
      }),
    enabled: !!restauranteId && !rangoInvalido,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOperacion(restauranteId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operaciones"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return (
    <AppShell active="/history">
      <PageHeader
        title="Historial de registros"
        description="Revisa los registros diarios y su impacto económico."
      />

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_180px_160px_160px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar registros..."
              type="text"
              aria-label="Buscar registros"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <NativeSelect
            aria-label="Turno"
            value={turno}
            onChange={(e) => setTurno(e.target.value as Turno | "")}
          >
            <option value="">Todos los turnos</option>
            <option value="MANANA">Mañana</option>
            <option value="TARDE">Tarde</option>
            <option value="NOCHE">Noche</option>
          </NativeSelect>
          <Input
            type="date"
            aria-label="Desde"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <Input
            type="date"
            aria-label="Hasta"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </Card>

      {rangoInvalido && (
        <p role="alert" className="text-sm text-destructive">
          La fecha de inicio no puede ser posterior a la fecha de fin.
        </p>
      )}

      {operaciones.isError && !rangoInvalido && (
        <p className="text-sm text-destructive">No se pudo cargar el historial.</p>
      )}

      <div className="space-y-3">
        {operaciones.isLoading &&
          [0, 1, 2].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        {operaciones.data?.length === 0 && (
          <Card>
            <EmptyState
              icon={SearchX}
              title="Ningún registro coincide con estos filtros."
              description="Prueba con otro turno o amplía el rango de fechas."
            />
          </Card>
        )}
        {operaciones.data?.map((op) => (
          <RecordCard
            deleting={deleteMutation.isPending && deleteMutation.variables === op.id}
            key={op.id}
            onDelete={(id) => {
              if (confirm("¿Eliminar este registro? Esta acción no se puede deshacer."))
                deleteMutation.mutate(id);
            }}
            op={op}
          />
        ))}
      </div>
    </AppShell>
  );
}
