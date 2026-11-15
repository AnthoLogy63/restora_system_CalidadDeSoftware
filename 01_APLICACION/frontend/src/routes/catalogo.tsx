import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BadgeCheck, GraduationCap, Package, Plus, RotateCcw, Trash2, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { requireSession, useSession } from "@/lib/session";
import {
  listProductos,
  createProducto,
  deleteProducto,
  updateProducto,
  listColaboradores,
  createColaborador,
  updateColaborador,
  deleteColaborador,
  ApiError,
  type RolColaborador,
} from "@/lib/api";
import { ETIQUETA_ROL, opcionesDe } from "@/lib/etiquetas";

export const Route = createFileRoute("/catalogo")({
  ssr: false,
  beforeLoad: ({ context }) => requireSession(context.queryClient),
  head: () => ({
    meta: [
      { title: "restora - Catálogo" },
      {
        name: "description",
        content: "Gestiona productos con su costo y el personal del restaurante.",
      },
    ],
  }),
  component: CatalogoPage,
});

function errMsg(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

function CatalogoPage() {
  const queryClient = useQueryClient();
  const session = useSession();
  const restauranteId = session.data?.restaurante.id ?? "";

  return (
    <AppShell active="/catalogo">
      <PageHeader
        title="Catálogo y equipo"
        description="Registra tus productos con su costo para calcular automáticamente la pérdida económica del desperdicio, y a tu personal con su nivel de capacitación."
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <ProductosPanel restauranteId={restauranteId} queryClient={queryClient} />
        <ColaboradoresPanel restauranteId={restauranteId} queryClient={queryClient} />
      </div>
    </AppShell>
  );
}

type QC = ReturnType<typeof useQueryClient>;

function ProductosPanel({
  restauranteId,
  queryClient,
}: {
  restauranteId: string;
  queryClient: QC;
}) {
  const [nombre, setNombre] = useState("");
  const [costo, setCosto] = useState("");

  const productos = useQuery({
    queryKey: ["productos", restauranteId],
    queryFn: () => listProductos(restauranteId),
    enabled: !!restauranteId,
  });

  const crear = useMutation({
    mutationFn: () =>
      createProducto(restauranteId, { nombre: nombre.trim(), costoUnitario: Number(costo) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setNombre("");
      setCosto("");
    },
  });
  const [aviso, setAviso] = useState<string | null>(null);
  const eliminar = useMutation({
    mutationFn: (id: string) => deleteProducto(restauranteId, id),
    onSuccess: (res) => {
      setAviso(
        res.inactivado
          ? "El producto tiene registros históricos: se inactivó para conservar su costo y trazabilidad."
          : null,
      );
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
  const reactivar = useMutation({
    mutationFn: (id: string) => updateProducto(restauranteId, id, { activo: true }),
    onSuccess: () => {
      setAviso(null);
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  const puede = restauranteId && nombre.trim().length >= 2 && Number(costo) > 0;

  return (
    <section>
      <Card>
        <CardHeader className="pb-4">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Package className="size-5 text-primary" /> Productos
          </h2>
        </CardHeader>
        <CardContent>
          <form
            className="mb-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (puede) crear.mutate();
            }}
          >
            <Input
              aria-label="Nombre del producto"
              placeholder="Nombre del producto"
              className="flex-1"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <Input
              aria-label="Costo en soles"
              placeholder="Costo S/"
              inputMode="decimal"
              className="sm:w-28"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
            />
            <Button type="submit" disabled={!puede || crear.isPending}>
              <Plus /> Agregar
            </Button>
          </form>
          {crear.isError && (
            <p className="mb-3 text-sm text-destructive">
              {errMsg(crear.error, "No se pudo crear el producto.")}
            </p>
          )}

          {aviso && (
            <p
              role="status"
              className="mb-3 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning"
            >
              {aviso}
            </p>
          )}

          {productos.data?.length === 0 && (
            <EmptyState icon={Package} title="Aún no hay productos en el catálogo." />
          )}
          <ul className="divide-y">
            {productos.data?.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2.5">
                <div className={`flex items-center gap-2 ${p.activo ? "" : "opacity-60"}`}>
                  <span className="text-sm font-medium">{p.nombre}</span>
                  <Badge variant="secondary">S/ {p.costoUnitario}</Badge>
                  {!p.activo && <Badge variant="warning">Inactivo</Badge>}
                </div>
                <div className="flex items-center">
                  {!p.activo && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      disabled={reactivar.isPending}
                      onClick={() => reactivar.mutate(p.id)}
                    >
                      <RotateCcw /> Reactivar
                    </Button>
                  )}
                  {p.activo && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Eliminar producto"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        if (confirm(`¿Eliminar "${p.nombre}"?`)) eliminar.mutate(p.id);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}

function ColaboradoresPanel({
  restauranteId,
  queryClient,
}: {
  restauranteId: string;
  queryClient: QC;
}) {
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState<RolColaborador>("COCINERO");
  const [capacitado, setCapacitado] = useState(false);

  const colaboradores = useQuery({
    queryKey: ["colaboradores", restauranteId],
    queryFn: () => listColaboradores(restauranteId),
    enabled: !!restauranteId,
  });

  const crear = useMutation({
    mutationFn: () => createColaborador(restauranteId, { nombre: nombre.trim(), rol, capacitado }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colaboradores"] });
      queryClient.invalidateQueries({ queryKey: ["indicadores"] });
      setNombre("");
      setCapacitado(false);
    },
  });
  const alternarCapacitado = useMutation({
    mutationFn: (v: { id: string; capacitado: boolean }) =>
      updateColaborador(restauranteId, v.id, { capacitado: v.capacitado }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colaboradores"] });
      queryClient.invalidateQueries({ queryKey: ["indicadores"] });
    },
  });
  const eliminar = useMutation({
    mutationFn: (id: string) => deleteColaborador(restauranteId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colaboradores"] });
      queryClient.invalidateQueries({ queryKey: ["indicadores"] });
    },
  });

  const puede = restauranteId && nombre.trim().length >= 2;

  return (
    <section>
      <Card>
        <CardHeader className="pb-4">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Users className="size-5 text-success" /> Colaboradores
          </h2>
        </CardHeader>
        <CardContent>
          <form
            className="mb-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (puede) crear.mutate();
            }}
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                aria-label="Nombre del colaborador"
                placeholder="Nombre"
                className="flex-1"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <div className="sm:w-44">
                <NativeSelect
                  aria-label="Rol"
                  value={rol}
                  onChange={(e) => setRol(e.target.value as RolColaborador)}
                >
                  {opcionesDe(ETIQUETA_ROL).map((o) => (
                    <option key={o.valor} value={o.valor}>
                      {o.etiqueta}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={capacitado} onCheckedChange={(v) => setCapacitado(v === true)} />
                Capacitado en manejo de residuos
              </label>
              <Button type="submit" disabled={!puede || crear.isPending}>
                <Plus /> Agregar
              </Button>
            </div>
          </form>
          {crear.isError && (
            <p className="mb-3 text-sm text-destructive">
              {errMsg(crear.error, "No se pudo crear el colaborador.")}
            </p>
          )}

          {colaboradores.data?.length === 0 && (
            <EmptyState icon={Users} title="Aún no hay colaboradores registrados." />
          )}
          <ul className="divide-y">
            {colaboradores.data?.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2 py-2.5">
                <div className="min-w-0">
                  <span className="text-sm font-medium">{c.nombre}</span>
                  <span className="ml-2 text-sm text-muted-foreground">{ETIQUETA_ROL[c.rol]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      alternarCapacitado.mutate({ id: c.id, capacitado: !c.capacitado })
                    }
                    className={c.capacitado ? "text-success" : "text-muted-foreground"}
                    title="Alternar capacitación"
                  >
                    {c.capacitado ? <BadgeCheck /> : <GraduationCap />}
                    {c.capacitado ? "Capacitado" : "Sin capacitar"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Eliminar colaborador"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      if (confirm(`¿Eliminar a "${c.nombre}"?`)) eliminar.mutate(c.id);
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
