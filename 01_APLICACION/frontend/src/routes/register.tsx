import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarClock, ChefHat, Plus, Save, Trash2, UtensilsCrossed, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { requireSession, useSession } from "@/lib/session";
import {
  createOperacion,
  ApiError,
  type Turno,
  type CategoriaResiduo,
  type AreaProceso,
  type MotivoGeneracion,
  type DestinoPrevisto,
  type VentaItem,
  type ProduccionItem,
  type ResiduoItem,
} from "@/lib/api";
import {
  ETIQUETA_CATEGORIA,
  ETIQUETA_AREA,
  ETIQUETA_MOTIVO,
  ETIQUETA_DESTINO,
  ETIQUETA_TURNO,
  opcionesDe,
} from "@/lib/etiquetas";

export const Route = createFileRoute("/register")({
  ssr: false,
  beforeLoad: ({ context }) => requireSession(context.queryClient),
  head: () => ({
    meta: [
      { title: "Registro diario - restora" },
      {
        name: "description",
        content: "Registra ventas, producción y desperdicios del turno para el cierre del día.",
      },
    ],
  }),
  component: RegisterPage,
});

/** Motivo por defecto sugerido a partir de la categoría (coincide con el backend). */
const MOTIVO_POR_CATEGORIA: Record<CategoriaResiduo, MotivoGeneracion> = {
  MERMA_PREPARACION: "ERROR_PREPARACION",
  PRODUCTO_DETERIORADO: "PRODUCTO_VENCIDO",
  SOBREPRODUCCION: "SOBREPRODUCCION",
  ALIMENTO_NO_VENDIDO: "SOBREPRODUCCION",
  RESTOS_CLIENTE: "DEVOLUCION_CLIENTE",
  CARTON: "OTRO",
  VIDRIO: "OTRO",
  PLASTICO: "OTRO",
  ACEITE_USADO: "OTRO",
  NO_APROVECHABLE: "OTRO",
};

interface VentaRow {
  concepto: string;
  cantidad: string;
  montoTotal: string;
}
interface ProduccionRow {
  productoAsociado: string;
  cantidadProducida: string;
  unidad: string;
}
interface DesperdicioRow {
  productoAsociado: string;
  categoria: CategoriaResiduo;
  cantidadKg: string;
  motivo: MotivoGeneracion;
  area: AreaProceso;
  destinoPrevisto: DestinoPrevisto;
  costoManual: string;
}

function ventaVacia(): VentaRow {
  return { concepto: "", cantidad: "", montoTotal: "" };
}
function produccionVacia(): ProduccionRow {
  return { productoAsociado: "", cantidadProducida: "", unidad: "" };
}
function desperdicioVacio(): DesperdicioRow {
  return {
    productoAsociado: "",
    categoria: "MERMA_PREPARACION",
    cantidadKg: "",
    motivo: "ERROR_PREPARACION",
    area: "COCINA",
    destinoPrevisto: "PENDIENTE_DEFINIR",
    costoManual: "",
  };
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  return "No se pudo guardar el registro. Inténtalo de nuevo.";
}

function Campo({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Opciones({ mapa }: { mapa: Record<string, string> }) {
  return (
    <>
      {opcionesDe(mapa).map((o) => (
        <option key={o.valor} value={o.valor}>
          {o.etiqueta}
        </option>
      ))}
    </>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const session = useSession();
  const restauranteId = session.data?.restaurante.id ?? "";

  const [fecha, setFecha] = useState(todayISO());
  const [turno, setTurno] = useState<Turno>("MANANA");
  const [observaciones, setObservaciones] = useState("");
  const [ventas, setVentas] = useState<VentaRow[]>([ventaVacia()]);
  const [producciones, setProducciones] = useState<ProduccionRow[]>([produccionVacia()]);
  const [desperdicios, setDesperdicios] = useState<DesperdicioRow[]>([desperdicioVacio()]);

  function actualizarVenta(i: number, patch: Partial<VentaRow>) {
    setVentas((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function actualizarProduccion(i: number, patch: Partial<ProduccionRow>) {
    setProducciones((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function actualizarDesperdicio(i: number, patch: Partial<DesperdicioRow>) {
    setDesperdicios((rows) =>
      rows.map((r, idx) => {
        if (idx !== i) return r;
        const next = { ...r, ...patch };
        // Si cambia la categoría, sugiere el motivo por defecto (el usuario puede cambiarlo).
        if (patch.categoria && !("motivo" in patch)) {
          next.motivo = MOTIVO_POR_CATEGORIA[patch.categoria];
        }
        return next;
      }),
    );
  }

  const mutation = useMutation({
    mutationFn: () => {
      const ventasPayload: VentaItem[] = ventas
        .filter((v) => v.concepto.trim() && Number(v.cantidad) > 0)
        .map((v) => ({
          // El concepto ES el nombre real del plato → alimenta correctamente al predictor.
          concepto: v.concepto.trim(),
          cantidad: Number(v.cantidad),
          montoTotal: Number(v.montoTotal) || 0,
        }));

      const produccionesPayload: ProduccionItem[] = producciones
        .filter((p) => p.productoAsociado.trim() && Number(p.cantidadProducida) > 0)
        .map((p) => ({
          productoAsociado: p.productoAsociado.trim(),
          cantidadProducida: Number(p.cantidadProducida),
          ...(p.unidad.trim() ? { unidad: p.unidad.trim() } : {}),
        }));

      const desperdiciosPayload: ResiduoItem[] = desperdicios
        .filter((d) => d.productoAsociado.trim() && Number(d.cantidadKg) > 0)
        .map((d) => ({
          categoria: d.categoria,
          cantidadKg: Number(d.cantidadKg),
          area: d.area,
          productoAsociado: d.productoAsociado.trim(),
          motivo: d.motivo,
          fecha,
          turno,
          destinoPrevisto: d.destinoPrevisto,
          ...(d.costoManual ? { costoManual: Number(d.costoManual) } : {}),
        }));

      return createOperacion(restauranteId, {
        fecha,
        turno,
        ...(observaciones.trim() ? { observaciones: observaciones.trim() } : {}),
        ...(ventasPayload.length ? { ventas: ventasPayload } : {}),
        ...(produccionesPayload.length ? { producciones: produccionesPayload } : {}),
        ...(desperdiciosPayload.length ? { desperdicios: desperdiciosPayload } : {}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["operaciones"] });
      queryClient.invalidateQueries({ queryKey: ["indicadores"] });
      navigate({ to: "/history" });
    },
  });

  const hayAlgo =
    ventas.some((v) => v.concepto.trim() && Number(v.cantidad) > 0) ||
    producciones.some((p) => p.productoAsociado.trim() && Number(p.cantidadProducida) > 0) ||
    desperdicios.some((d) => d.productoAsociado.trim() && Number(d.cantidadKg) > 0);

  return (
    <AppShell active="/register">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <PageHeader
          title="Registro del turno"
          description={
            <>
              Registra las ventas por plato, la producción y los desperdicios del turno. ¿Prefieres dictarlo? Usa
              el <span className="font-semibold text-primary">asistente</span> abajo a la derecha.
            </>
          }
        />

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (hayAlgo) mutation.mutate();
          }}
        >
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarClock className="size-5 text-muted-foreground" /> Datos del turno
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Campo label="Fecha" htmlFor="entry-date">
                <Input
                  id="entry-date"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </Campo>
              <Campo label="Turno" htmlFor="entry-turno">
                <NativeSelect
                  id="entry-turno"
                  value={turno}
                  onChange={(e) => setTurno(e.target.value as Turno)}
                >
                  <Opciones mapa={ETIQUETA_TURNO} />
                </NativeSelect>
              </Campo>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <UtensilsCrossed className="size-5 text-primary" /> Ventas por plato
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => setVentas((r) => [...r, ventaVacia()])}
              >
                <Plus /> Añadir plato
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {ventas.map((v, i) => (
                <div key={i} className="grid grid-cols-12 items-end gap-2">
                  <Campo label={i === 0 ? "Plato" : ""} className="col-span-12 sm:col-span-6">
                    <Input
                      aria-label="Plato"
                      placeholder="Ej. Lomo Saltado"
                      value={v.concepto}
                      onChange={(e) => actualizarVenta(i, { concepto: e.target.value })}
                    />
                  </Campo>
                  <Campo label={i === 0 ? "Cant." : ""} className="col-span-5 sm:col-span-2">
                    <Input
                      aria-label="Cantidad"
                      inputMode="numeric"
                      placeholder="0"
                      value={v.cantidad}
                      onChange={(e) => actualizarVenta(i, { cantidad: e.target.value })}
                    />
                  </Campo>
                  <Campo label={i === 0 ? "Monto S/" : ""} className="col-span-5 sm:col-span-3">
                    <Input
                      aria-label="Monto en soles"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={v.montoTotal}
                      onChange={(e) => actualizarVenta(i, { montoTotal: e.target.value })}
                    />
                  </Campo>
                  <div className="col-span-2 flex justify-end sm:col-span-1 sm:justify-center">
                    {ventas.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Quitar plato"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setVentas((r) => r.filter((_, idx) => idx !== i))}
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <ChefHat className="size-5 text-primary" /> Producción
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => setProducciones((r) => [...r, produccionVacia()])}
              >
                <Plus /> Añadir producción
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {producciones.map((p, i) => (
                <div key={i} className="grid grid-cols-12 items-end gap-2">
                  <Campo
                    label={i === 0 ? "Producto elaborado" : ""}
                    className="col-span-12 sm:col-span-6"
                  >
                    <Input
                      aria-label="Producto elaborado"
                      placeholder="Ej. Arroz con pollo"
                      value={p.productoAsociado}
                      onChange={(e) => actualizarProduccion(i, { productoAsociado: e.target.value })}
                    />
                  </Campo>
                  <Campo label={i === 0 ? "Cant." : ""} className="col-span-5 sm:col-span-3">
                    <Input
                      aria-label="Cantidad producida"
                      inputMode="decimal"
                      placeholder="Ej. 20"
                      value={p.cantidadProducida}
                      onChange={(e) => actualizarProduccion(i, { cantidadProducida: e.target.value })}
                    />
                  </Campo>
                  <Campo label={i === 0 ? "Unidad" : ""} className="col-span-5 sm:col-span-2">
                    <Input
                      aria-label="Unidad de producción"
                      placeholder="porciones"
                      value={p.unidad}
                      onChange={(e) => actualizarProduccion(i, { unidad: e.target.value })}
                    />
                  </Campo>
                  <div className="col-span-2 flex justify-end sm:col-span-1 sm:justify-center">
                    {producciones.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Quitar producción"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setProducciones((r) => r.filter((_, idx) => idx !== i))}
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Trash2 className="size-5 text-destructive" /> Desperdicios
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => setDesperdicios((r) => [...r, desperdicioVacio()])}
              >
                <Plus /> Añadir desperdicio
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {desperdicios.map((d, i) => (
                <div key={i} className="space-y-4 rounded-lg border bg-secondary/40 p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Campo label="Producto / plato">
                      <Input
                        placeholder="Ej. Arroz, recortes de verdura"
                        value={d.productoAsociado}
                        onChange={(e) =>
                          actualizarDesperdicio(i, { productoAsociado: e.target.value })
                        }
                      />
                    </Campo>
                    <Campo label="Categoría">
                      <NativeSelect
                        value={d.categoria}
                        onChange={(e) =>
                          actualizarDesperdicio(i, {
                            categoria: e.target.value as CategoriaResiduo,
                          })
                        }
                      >
                        <Opciones mapa={ETIQUETA_CATEGORIA} />
                      </NativeSelect>
                    </Campo>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Campo label="Kilos">
                      <Input
                        inputMode="decimal"
                        placeholder="0.0"
                        value={d.cantidadKg}
                        onChange={(e) => actualizarDesperdicio(i, { cantidadKg: e.target.value })}
                      />
                    </Campo>
                    <Campo label="Motivo">
                      <NativeSelect
                        value={d.motivo}
                        onChange={(e) =>
                          actualizarDesperdicio(i, { motivo: e.target.value as MotivoGeneracion })
                        }
                      >
                        <Opciones mapa={ETIQUETA_MOTIVO} />
                      </NativeSelect>
                    </Campo>
                    <Campo label="Área">
                      <NativeSelect
                        value={d.area}
                        onChange={(e) =>
                          actualizarDesperdicio(i, { area: e.target.value as AreaProceso })
                        }
                      >
                        <Opciones mapa={ETIQUETA_AREA} />
                      </NativeSelect>
                    </Campo>
                    <Campo label="Costo S/ (opc.)">
                      <Input
                        inputMode="decimal"
                        placeholder="auto"
                        value={d.costoManual}
                        onChange={(e) => actualizarDesperdicio(i, { costoManual: e.target.value })}
                      />
                    </Campo>
                  </div>
                  <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
                    <Campo label="Destino previsto">
                      <NativeSelect
                        value={d.destinoPrevisto}
                        onChange={(e) =>
                          actualizarDesperdicio(i, {
                            destinoPrevisto: e.target.value as DestinoPrevisto,
                          })
                        }
                      >
                        <Opciones mapa={ETIQUETA_DESTINO} />
                      </NativeSelect>
                    </Campo>
                    {desperdicios.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="justify-self-start text-muted-foreground hover:text-destructive md:justify-self-end"
                        onClick={() => setDesperdicios((r) => r.filter((_, idx) => idx !== i))}
                      >
                        <Trash2 /> Quitar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Campo label="Observaciones (opcional)" htmlFor="obs">
                <Textarea
                  id="obs"
                  rows={2}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </Campo>
            </CardContent>
          </Card>

          {mutation.isError && (
            <p className="text-sm text-destructive">{errorMessage(mutation.error)}</p>
          )}

          <Button
            size="lg"
            className="w-full"
            disabled={mutation.isPending || !restauranteId || !hayAlgo}
            type="submit"
          >
            <Save /> {mutation.isPending ? "Guardando…" : "Guardar registro"}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
