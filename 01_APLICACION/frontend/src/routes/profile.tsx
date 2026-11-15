import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BadgeCheck, Bell, LogOut, Mail, MapPin, Pencil, Scale, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { requireSession, useSession } from "@/lib/session";
import { logout, updateRestaurante, ApiError } from "@/lib/api";

export const Route = createFileRoute("/profile")({
  ssr: false,
  beforeLoad: ({ context }) => requireSession(context.queryClient),
  head: () => ({
    meta: [
      { title: "Perfil y ajustes - restora" },
      {
        name: "description",
        content: "Gestiona los datos de tu restaurante, preferencias y cuenta.",
      },
    ],
  }),
  component: ProfilePage,
});

function CampoIcono({
  id,
  label,
  icon: Icon,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  icon: typeof Mail;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input id={id} className="pl-9 disabled:bg-secondary/50 disabled:opacity-100" {...props} />
      </div>
    </div>
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const session = useSession();
  const restaurante = session.data?.restaurante;

  const [pushNotifications, setPushNotifications] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [lineaBase, setLineaBase] = useState("");

  useEffect(() => {
    if (restaurante) {
      setNombre(restaurante.nombre);
      setCiudad(restaurante.ciudad);
      setLineaBase(restaurante.lineaBaseSemanalKg?.toString() ?? "");
    }
  }, [restaurante]);

  const saveMutation = useMutation({
    mutationFn: () =>
      updateRestaurante(restaurante!.id, {
        nombre,
        ciudad,
        lineaBaseSemanalKg: lineaBase ? Number(lineaBase) : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      setEditing(false);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["session"] });
      navigate({ to: "/auth" });
    },
  });

  return (
    <AppShell active="/profile">
      <PageHeader
        title="Perfil y ajustes"
        description="Gestiona los datos de tu restaurante, preferencias y cuenta."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div className="space-y-1.5">
              <CardTitle className="text-base">Perfil del restaurante</CardTitle>
              <CardDescription>Datos usados en reportes e indicadores.</CardDescription>
            </div>
            {editing ? (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)} type="button">
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  disabled={saveMutation.isPending}
                  onClick={() => saveMutation.mutate()}
                  type="button"
                >
                  {saveMutation.isPending ? "Guardando…" : "Guardar"}
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)} type="button">
                <Pencil /> Editar
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {saveMutation.isError && (
              <p className="text-sm text-destructive">
                {saveMutation.error instanceof ApiError
                  ? saveMutation.error.message
                  : "No se pudieron guardar los cambios."}
              </p>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="profile-nombre">Nombre del restaurante</Label>
              <Input
                className="disabled:bg-secondary/50 disabled:opacity-100"
                disabled={!editing}
                id="profile-nombre"
                onChange={(e) => setNombre(e.target.value)}
                type="text"
                value={nombre}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <CampoIcono
                id="profile-ciudad"
                label="Ciudad"
                icon={MapPin}
                disabled={!editing}
                onChange={(e) => setCiudad(e.target.value)}
                type="text"
                value={ciudad}
              />
              <CampoIcono
                id="profile-email"
                label="Correo de contacto"
                icon={Mail}
                disabled
                readOnly
                type="email"
                value={session.data?.email ?? ""}
              />
              <CampoIcono
                id="profile-linea-base"
                label="Línea base semanal (kg)"
                icon={Scale}
                disabled={!editing}
                inputMode="decimal"
                onChange={(e) => setLineaBase(e.target.value)}
                placeholder="Se usa para el indicador de Prevención"
                type="text"
                value={lineaBase}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary to-[#4a1528] text-primary-foreground">
          <div className="pointer-events-none absolute -right-8 -top-8 size-36 rounded-full bg-white/10 blur-2xl" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <Badge className="border-transparent bg-white/20 text-white hover:bg-white/20">
                Plan activo
              </Badge>
              <BadgeCheck className="size-5" />
            </div>
            <CardTitle className="flex items-center gap-2 pt-3 text-2xl">
              <Sparkles className="size-5 text-amber-300" /> IA Premium
            </CardTitle>
          </CardHeader>
          <CardContent className="relative text-sm text-white/85">
            Acceso completo a análisis avanzado, registro automatizado con IA y soporte prioritario.
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="border-b bg-secondary/40">
            <CardTitle className="text-base">Preferencias de la app</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <Bell className="size-5" />
                </span>
                <div>
                  <Label htmlFor="pref-push" className="text-sm font-medium">
                    Notificaciones push
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Alertas de nuevos registros y reportes.
                  </p>
                </div>
              </div>
              <Switch
                id="pref-push"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        variant="outline"
        className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        disabled={logoutMutation.isPending}
        onClick={() => logoutMutation.mutate()}
        type="button"
      >
        <LogOut /> {logoutMutation.isPending ? "Cerrando sesión…" : "Cerrar sesión"}
      </Button>
    </AppShell>
  );
}
