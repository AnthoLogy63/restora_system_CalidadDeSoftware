import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Recycle,
  Sparkles,
  Store,
  TrendingDown,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, register, forgotPassword, resetPassword, ApiError } from "@/lib/api";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "restora - Ingresar / Registrarse" },
      {
        name: "description",
        content: "Inicia sesión, regístrate o recupera tu contraseña en restora.",
      },
      { property: "og:title", content: "restora - Ingresar / Registrarse" },
    ],
  }),
  component: AuthPage,
});

type View = "login" | "register" | "recovery";

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  return "Algo salió mal. Inténtalo de nuevo.";
}

function Campo({
  id,
  label,
  icon: Icon,
  trailing,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  icon?: LucideIcon;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          id={id}
          className={`h-11 ${Icon ? "pl-9" : ""} ${trailing ? "pr-10" : ""}`}
          {...props}
        />
        {trailing && <div className="absolute right-1 top-1/2 -translate-y-1/2">{trailing}</div>}
      </div>
    </div>
  );
}

function VerPassword({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-9 text-muted-foreground"
      aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
      onClick={onToggle}
    >
      {visible ? <Eye /> : <EyeOff />}
    </Button>
  );
}

function Mensaje({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {children}
    </p>
  );
}

const BENEFICIOS = [
  { icon: TrendingDown, texto: "Descubre dónde pierdes dinero, plato por plato." },
  { icon: Sparkles, texto: "Registra hablando con un asistente de IA en menos de un minuto." },
  { icon: Recycle, texto: "Valoriza residuos y demuestra su trazabilidad." },
];

function AuthPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [view, setView] = useState<View>("login");
  const [loginPwVisible, setLoginPwVisible] = useState(false);
  const [regPwVisible, setRegPwVisible] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<"request" | "confirm">("request");
  const [recEmail, setRecEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    nombreRestaurante: "",
    nombreUsuario: "",
    email: "",
    password: "",
  });

  const goToApp = () => {
    queryClient.invalidateQueries({ queryKey: ["session"] });
    navigate({ to: "/dashboard" });
  };

  const loginMutation = useMutation({
    mutationFn: () => login(loginForm),
    onSuccess: goToApp,
  });

  // Acceso rápido para demos: usa el usuario sembrado por prisma/seed.ts, sin
  // que el presentador tenga que escribir credenciales en vivo.
  const demoLoginMutation = useMutation({
    mutationFn: () => login({ email: "demo@circularaqp.pe", password: "demo1234" }),
    onSuccess: goToApp,
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      await register(registerForm);
      // El backend no inicia sesión automáticamente al registrar; lo hacemos
      // acá para no obligar al usuario a volver a escribir sus credenciales.
      await login({ email: registerForm.email, password: registerForm.password });
    },
    onSuccess: goToApp,
  });

  const forgotMutation = useMutation({
    mutationFn: () => forgotPassword(recEmail),
    onSuccess: (data) => {
      // Sin servicio de email: el backend devuelve el token directo. Se
      // precarga para que el usuario no tenga que copiarlo a mano en la demo.
      if (data.resetToken) setResetToken(data.resetToken);
      setRecoveryStep("confirm");
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => resetPassword(resetToken, newPassword),
    onSuccess: () => {
      switchForm("login");
    },
  });

  const switchForm = (v: View) => {
    setView(v);
    if (v !== "recovery") {
      setRecoveryStep("request");
      setRecEmail("");
      setResetToken("");
      setNewPassword("");
    }
  };

  const volver = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Volver"
      className="-ml-2"
      onClick={() => switchForm("login")}
    >
      <ArrowLeft />
    </Button>
  );

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_1fr]">
      {/* Panel de marca */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#3a0f20] via-primary to-[#9f3c59] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-amber-300/20 blur-3xl" />
        <Link to="/" className="relative">
          <Brand size="lg" className="[&>span:last-child]:text-white" />
        </Link>
        <div className="relative max-w-md space-y-8">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight">
            Menos desperdicio. Más margen para tu restaurante.
          </h2>
          <ul className="space-y-4">
            {BENEFICIOS.map((b) => (
              <li key={b.texto} className="flex items-start gap-3 text-white/90">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <b.icon className="size-4" />
                </span>
                <span className="text-sm leading-relaxed">{b.texto}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-white/60">
          Gestión inteligente de residuos para restaurantes turísticos de Arequipa.
        </p>
      </aside>

      {/* Formulario */}
      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-[400px]">
          <Link to="/" className="mb-8 inline-block lg:hidden">
            <Brand />
          </Link>

          {view === "login" && (
            <div>
              <div className="mb-6 space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight">Bienvenido de nuevo</h1>
                <p className="text-sm text-muted-foreground">
                  Inicia sesión para gestionar tu restaurante.
                </p>
              </div>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  loginMutation.mutate();
                }}
              >
                <Campo
                  id="login-email"
                  label="Correo electrónico"
                  icon={Mail}
                  placeholder="admin@restaurant.com"
                  required
                  type="email"
                  autoComplete="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                />
                <Campo
                  id="login-password"
                  label="Contraseña"
                  icon={Lock}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  type={loginPwVisible ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                  trailing={
                    <VerPassword
                      visible={loginPwVisible}
                      onToggle={() => setLoginPwVisible((v) => !v)}
                    />
                  }
                />
                <div className="flex justify-end">
                  <button
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => switchForm("recovery")}
                    type="button"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                {loginMutation.isError && <Mensaje>{errorMessage(loginMutation.error)}</Mensaje>}
                <Button
                  size="lg"
                  className="w-full"
                  disabled={loginMutation.isPending}
                  type="submit"
                >
                  {loginMutation.isPending ? "Ingresando…" : "Iniciar sesión"}
                  <ArrowRight />
                </Button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <span className="relative mx-auto block w-fit bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground">
                  o
                </span>
              </div>

              {demoLoginMutation.isError && (
                <div className="mb-2">
                  <Mensaje>{errorMessage(demoLoginMutation.error)}</Mensaje>
                </div>
              )}
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                disabled={demoLoginMutation.isPending}
                onClick={() => demoLoginMutation.mutate()}
                type="button"
              >
                <Zap />
                {demoLoginMutation.isPending ? "Ingresando…" : "Entrar como demo"}
              </Button>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <button
                  className="font-semibold text-primary hover:underline"
                  onClick={() => switchForm("register")}
                  type="button"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          )}

          {view === "register" && (
            <div>
              <div className="mb-6 space-y-1.5">
                {volver}
                <h1 className="text-2xl font-semibold tracking-tight">Crear cuenta</h1>
                <p className="text-sm text-muted-foreground">
                  Configura tu restaurante en menos de un minuto.
                </p>
              </div>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  registerMutation.mutate();
                }}
              >
                <Campo
                  id="reg-restaurant"
                  label="Nombre del restaurante"
                  icon={Store}
                  placeholder="Ej. La Nueva Palomino"
                  required
                  type="text"
                  value={registerForm.nombreRestaurante}
                  onChange={(e) =>
                    setRegisterForm((f) => ({ ...f, nombreRestaurante: e.target.value }))
                  }
                />
                <Campo
                  id="reg-admin"
                  label="Nombre del administrador"
                  icon={User}
                  placeholder="Nombre completo"
                  required
                  type="text"
                  value={registerForm.nombreUsuario}
                  onChange={(e) =>
                    setRegisterForm((f) => ({ ...f, nombreUsuario: e.target.value }))
                  }
                />
                <Campo
                  id="reg-email"
                  label="Correo electrónico"
                  icon={Mail}
                  placeholder="admin@restaurant.com"
                  required
                  type="email"
                  autoComplete="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))}
                />
                <Campo
                  id="reg-password"
                  label="Contraseña"
                  icon={Lock}
                  placeholder="Mín. 8 caracteres"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  type={regPwVisible ? "text" : "password"}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))}
                  trailing={
                    <VerPassword
                      visible={regPwVisible}
                      onToggle={() => setRegPwVisible((v) => !v)}
                    />
                  }
                />
                <p className="text-center text-xs text-muted-foreground">
                  Al registrarte, aceptas nuestros{" "}
                  <a className="text-primary hover:underline" href="#">
                    Términos
                  </a>{" "}
                  y{" "}
                  <a className="text-primary hover:underline" href="#">
                    Política de privacidad
                  </a>
                  .
                </p>
                {registerMutation.isError && (
                  <Mensaje>{errorMessage(registerMutation.error)}</Mensaje>
                )}
                <Button
                  size="lg"
                  className="w-full"
                  disabled={registerMutation.isPending}
                  type="submit"
                >
                  {registerMutation.isPending ? "Creando…" : "Crear cuenta"}
                </Button>
              </form>
            </div>
          )}

          {view === "recovery" && (
            <div>
              <div className="mb-6 space-y-1.5">
                {volver}
                <h1 className="text-2xl font-semibold tracking-tight">Recuperar contraseña</h1>
              </div>

              {recoveryStep === "request" && (
                <>
                  <p className="mb-5 text-sm text-muted-foreground">
                    Ingresa el correo asociado a tu cuenta y te generaremos un código de
                    recuperación.
                  </p>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      forgotMutation.mutate();
                    }}
                  >
                    <Campo
                      id="rec-email"
                      label="Correo electrónico"
                      icon={Mail}
                      placeholder="admin@restaurant.com"
                      required
                      type="email"
                      value={recEmail}
                      onChange={(e) => setRecEmail(e.target.value)}
                    />
                    {forgotMutation.isError && (
                      <Mensaje>{errorMessage(forgotMutation.error)}</Mensaje>
                    )}
                    <Button
                      size="lg"
                      className="w-full"
                      disabled={forgotMutation.isPending}
                      type="submit"
                    >
                      {forgotMutation.isPending ? "Enviando…" : "Enviar código"}
                    </Button>
                  </form>
                </>
              )}

              {recoveryStep === "confirm" && (
                <>
                  <div className="mb-5 flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-3 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                    <p className="text-foreground/80">
                      Generamos tu código de recuperación (en esta demo no se envía correo: el
                      código ya está precargado).
                    </p>
                  </div>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      resetMutation.mutate();
                    }}
                  >
                    <Campo
                      id="rec-token"
                      label="Código de recuperación"
                      icon={KeyRound}
                      required
                      type="text"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                    />
                    <Campo
                      id="rec-new-password"
                      label="Nueva contraseña"
                      icon={Lock}
                      placeholder="Mín. 8 caracteres"
                      required
                      minLength={8}
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {resetMutation.isError && (
                      <Mensaje>{errorMessage(resetMutation.error)}</Mensaje>
                    )}
                    <Button
                      size="lg"
                      className="w-full"
                      disabled={resetMutation.isPending}
                      type="submit"
                    >
                      {resetMutation.isPending ? "Guardando…" : "Guardar contraseña"}
                    </Button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
