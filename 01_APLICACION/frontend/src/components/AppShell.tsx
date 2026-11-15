import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  BarChart3,
  ChevronsUpDown,
  ClipboardPen,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Package,
  Recycle,
  Sparkles,
  Store,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useSession } from "@/lib/session";
import { logout } from "@/lib/api";
import { AsistenteWidget } from "@/components/asistente/AsistenteWidget";
import { Brand } from "@/components/Brand";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type NavItem = { to: string; label: string; icon: LucideIcon };

const GRUPOS: { titulo: string; items: NavItem[] }[] = [
  {
    titulo: "Operación",
    items: [
      { to: "/dashboard", label: "Panel", icon: LayoutDashboard },
      { to: "/register", label: "Registrar", icon: ClipboardPen },
      { to: "/history", label: "Historial", icon: History },
      { to: "/entregas", label: "Entregas", icon: Recycle },
    ],
  },
  {
    titulo: "Inteligencia",
    items: [
      { to: "/analytics", label: "Análisis", icon: BarChart3 },
      { to: "/reports", label: "Reportes", icon: FileText },
      { to: "/predict", label: "Predicción IA", icon: Sparkles },
    ],
  },
  {
    titulo: "Configuración",
    items: [
      { to: "/catalogo", label: "Catálogo", icon: Package },
      { to: "/profile", label: "Perfil", icon: UserRound },
    ],
  },
];

const TODOS = GRUPOS.flatMap((g) => g.items);

export function AppShell({ children, active }: { children: ReactNode; active: string }) {
  const session = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const nombreRestaurante = session.data?.restaurante.nombre ?? "restora";
  const nombreUsuario = session.data?.nombre ?? "Usuario";
  const email = session.data?.email ?? "";
  const seccion = TODOS.find((i) => i.to === active)?.label ?? "";

  const salir = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["session"] });
      navigate({ to: "/auth" });
    },
  });

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-4 pt-5 pb-3">
          <Link to="/" aria-label="Ir al inicio">
            <Brand />
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-2">
          {GRUPOS.map((g) => (
            <SidebarGroup key={g.titulo}>
              <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider">
                {g.titulo}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {g.items.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={active === item.to}
                        className="h-10 data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground"
                      >
                        <Link to={item.to}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="border-t p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-sidebar-accent"
              >
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {nombreUsuario.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{nombreUsuario}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {nombreRestaurante}
                  </span>
                </span>
                <ChevronsUpDown className="size-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <span className="block text-sm font-medium">{nombreUsuario}</span>
                <span className="block truncate text-xs text-muted-foreground">{email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <Store className="mr-2 size-4" /> Mi restaurante
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => salir.mutate()} className="text-destructive">
                <LogOut className="mr-2 size-4" /> Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-w-0 bg-background">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur lg:px-8">
          <SidebarTrigger aria-label="Abrir menú" />
          <Separator orientation="vertical" className="h-5" />
          <nav aria-label="Ubicación" className="flex items-center gap-2 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{nombreRestaurante}</span>
            <span className="hidden text-muted-foreground sm:inline">/</span>
            <span className="font-medium">{seccion}</span>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 pb-24 lg:p-8">
          {children}
        </main>
      </SidebarInset>
      <AsistenteWidget />
    </SidebarProvider>
  );
}
