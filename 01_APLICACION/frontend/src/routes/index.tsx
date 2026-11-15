import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ClipboardPen,
  LineChart,
  Recycle,
  Sparkles,
  TrendingDown,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "restora — Convierte los datos de tu restaurante en decisiones" },
      {
        name: "description",
        content:
          "restora transforma registros simples de residuos en información de costos, recomendaciones operativas y evidencia de valorización para restaurantes turísticos de Arequipa.",
      },
      { property: "og:title", content: "restora — Menos desperdicio, más eficiencia" },
      {
        property: "og:description",
        content:
          "Registra en menos de un minuto con un asistente de IA, descubre dónde pierdes dinero y valoriza tus residuos.",
      },
    ],
  }),
  component: Index,
});

const BENEFICIOS = [
  {
    icon: Trash2,
    titulo: "Reduce el desperdicio",
    texto:
      "La predicción de demanda por plato, entrenada con tu propio historial, te ayuda a preparar exactamente lo necesario y minimizar la sobreproducción.",
    destacado: true,
  },
  {
    icon: TrendingDown,
    titulo: "Identifica pérdidas",
    texto:
      "Convierte cada kilo desperdiciado en su costo real y descubre qué área, plato o turno concentra la pérdida.",
  },
  {
    icon: Recycle,
    titulo: "Valoriza y demuestra",
    texto:
      "Registra entregas a recicladores con evidencia y mantén la trazabilidad de tus residuos valorizables.",
  },
  {
    icon: BarChart3,
    titulo: "Sostenibilidad medible",
    texto:
      "Indicadores de segregación, valorización, prevención y trazabilidad que muestran el avance mes a mes, listos para reportes y reconocimiento.",
    destacado: true,
  },
];

const PASOS = [
  {
    icon: ClipboardPen,
    titulo: "Registra el turno",
    texto: "Dicta o escribe ventas y desperdicios. El asistente completa el formulario por ti.",
  },
  {
    icon: LineChart,
    titulo: "Mide el impacto",
    texto: "Cada kilo se convierte en soles y se compara contra tu línea base.",
  },
  {
    icon: Sparkles,
    titulo: "Actúa con datos",
    texto: "Recibe recomendaciones y pronósticos de demanda para preparar lo justo.",
  },
];

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-8">
          <Brand />
          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              className="hidden px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:block"
              href="#como-funciona"
            >
              Cómo funciona
            </a>
            <a
              className="hidden px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:block"
              href="#beneficios"
            >
              Beneficios
            </a>
            <Button asChild variant="ghost">
              <Link to="/auth">Ingresar</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Crear cuenta</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="bg-grid absolute inset-0" aria-hidden="true" />
          <div
            className="pointer-events-none absolute left-1/2 top-0 size-[520px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 md:px-8 lg:grid-cols-2 lg:pt-24">
            <div className="space-y-6">
              <Badge variant="soft" className="gap-1.5 px-3 py-1 text-sm">
                <Bot className="size-3.5" /> Registro con asistente de IA
              </Badge>
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
                Convierte los datos de tu restaurante en decisiones que{" "}
                <span className="ai-gradient-text">reducen el desperdicio</span>.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                restora ayuda a restaurantes turísticos de Arequipa a registrar residuos en menos de
                un minuto, descubrir dónde pierden dinero y valorizar lo aprovechable. Sin sistemas
                complejos.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link to="/auth">
                    Crear cuenta <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/auth">Ver la demo</Link>
                </Button>
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
                {["Sin instalación", "Funciona en celular", "Datos aislados por restaurante"].map(
                  (t) => (
                    <li key={t} className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-success" /> {t}
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Vista previa del producto */}
            <div className="relative">
              <Card className="space-y-4 p-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Resumen del turno</span>
                  <Badge variant="success">En vivo</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-secondary/40 p-3">
                    <p className="text-xs text-muted-foreground">Pérdida estimada</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-destructive">
                      S/ 316.90
                    </p>
                  </div>
                  <div className="rounded-lg border bg-secondary/40 p-3">
                    <p className="text-xs text-muted-foreground">Prevención</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-success">67.0%</p>
                  </div>
                </div>
                <div className="space-y-2 rounded-lg border bg-background p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Bot className="size-3.5 text-primary" /> Asistente restora
                  </div>
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
                    Ayer en la noche vendimos 40 lomo saltado y botamos 3 kg de arroz.
                  </div>
                  <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-secondary px-3 py-2 text-sm">
                    Anotado: 40 Lomo Saltado y 3 kg de arroz (sobreproducción). ¿Confirmo el
                    registro del turno noche?
                  </div>
                </div>
              </Card>
              <Card className="absolute -bottom-9 -left-3 hidden items-center gap-3 p-3 shadow-lg sm:flex">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
                  <UtensilsCrossed className="size-4" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Demanda prevista</p>
                  <p className="text-sm font-semibold">Lomo Saltado · 46 u.</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="border-y bg-card py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight">Cómo funciona</h2>
              <p className="mt-3 text-muted-foreground">
                El problema no es generar residuos, es no saber cuáles cuestan más. restora lo hace
                visible en tres pasos.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {PASOS.map((p, i) => (
                <div key={p.titulo} className="relative space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
                      <p.icon className="size-5" />
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      Paso {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{p.titulo}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section id="beneficios" className="py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight">Precisión operativa</h2>
              <p className="mt-3 text-muted-foreground">
                Beneficios clave pensados para administradores de restaurantes.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {BENEFICIOS.map((b) => (
                <Card key={b.titulo} className="space-y-3 p-6 transition-shadow hover:shadow-md">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
                    <b.icon className="size-5" />
                  </span>
                  <h3 className="text-lg font-semibold">{b.titulo}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{b.texto}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20 md:px-8">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-gradient-to-br from-[#3a0f20] via-primary to-[#9f3c59] px-8 py-14 text-center text-white">
            <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" />
            <h2 className="relative text-3xl font-semibold tracking-tight">
              Empieza a medir tu desperdicio hoy
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-white/80">
              Crea tu cuenta o explora la demo con datos de ejemplo.
            </p>
            <div className="relative mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link to="/auth">
                  Crear cuenta <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/auth">Ver la demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-8">
          <Brand size="sm" />
          <p className="text-xs text-muted-foreground">
            © 2026 restora · Proyecto de Calidad de Software, UNSA
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground">
              Plataforma
            </Link>
            <a href="#beneficios" className="hover:text-foreground">
              Beneficios
            </a>
            <Link to="/auth" className="hover:text-foreground">
              Ingresar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
