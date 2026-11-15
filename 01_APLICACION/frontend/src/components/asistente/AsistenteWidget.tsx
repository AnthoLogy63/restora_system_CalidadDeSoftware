import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AudioLines,
  Bot,
  ClipboardPen,
  Loader2,
  Mic,
  Package,
  Recycle,
  RotateCcw,
  SendHorizontal,
  Square,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAsistente } from "@/hooks/useAsistente";
import { useGrabacionVoz } from "@/hooks/useGrabacionVoz";
import { FLUJOS_DISPONIBLES, transcribirVoz, type FlujoId } from "@/lib/asistente";
import { ApiError } from "@/lib/api";
import { BorradorPanel } from "@/components/asistente/BorradorPanel";
import { ResumenConfirmacion } from "@/components/asistente/ResumenConfirmacion";

const ICONOS_FLUJO: Record<string, LucideIcon> = {
  edit_note: ClipboardPen,
  recycling: Recycle,
  inventory_2: Package,
  group: Users,
};

/** Renderiza texto con **negritas** y saltos de línea de forma segura. */
function TextoRico({ texto }: { texto: string }) {
  return (
    <>
      {texto.split("\n").map((linea, i) => (
        <span key={i} className="block">
          {linea
            .split(/(\*\*[^*]+\*\*)/g)
            .map((parte, j) =>
              parte.startsWith("**") && parte.endsWith("**") ? (
                <strong key={j}>{parte.slice(2, -2)}</strong>
              ) : (
                <span key={j}>{parte}</span>
              ),
            )}
        </span>
      ))}
    </>
  );
}

export function AsistenteWidget() {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const [editando, setEditando] = useState(false);
  const [errorVoz, setErrorVoz] = useState<string | null>(null);
  const navigate = useNavigate();
  const a = useAsistente();
  const finRef = useRef<HTMLDivElement>(null);

  // Registro por voz: el audio grabado (ya filtrado de silencio) se transcribe y
  // el texto cae en el campo de entrada para revisar antes de enviarlo.
  const onAudioListo = useCallback(
    async (audio: Blob, mimeType: string) => {
      setErrorVoz(null);
      try {
        const { texto } = await transcribirVoz(a.restauranteId, audio, mimeType);
        setTexto((prev) => (prev ? `${prev} ${texto}` : texto));
      } catch (err) {
        setErrorVoz(
          err instanceof ApiError
            ? err.message
            : "No se pudo transcribir el audio. Inténtalo de nuevo.",
        );
      } finally {
        voz.setProcesando(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [a.restauranteId],
  );
  const voz = useGrabacionVoz(onAudioListo);

  const listo = a.ultimaRespuesta?.listoParaGuardar ?? false;
  const mostrarConfirmacion = listo && !editando;
  const grabandoOcupado = voz.estado !== "inactivo";

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [a.mensajes, a.ultimaRespuesta]);

  // Al recibir una respuesta que ya no está lista para guardar, se sale del modo edición.
  useEffect(() => {
    if (!listo) setEditando(false);
  }, [listo]);

  if (!a.restauranteId) return null;

  async function onEnviar(e: React.FormEvent) {
    e.preventDefault();
    const t = texto;
    setTexto("");
    await a.enviar(t);
  }

  async function onConfirmar() {
    const res = await a.guardar();
    if (res) {
      const ruta = res.rutaSugerida;
      a.reiniciar();
      setAbierto(false);
      navigate({ to: ruta });
    }
  }

  function elegirFlujo(flujo: FlujoId) {
    void a.iniciarFlujo(flujo);
  }

  return (
    <>
      {/* Burbuja flotante */}
      <button
        type="button"
        aria-label="Abrir asistente"
        onClick={() => setAbierto((v) => !v)}
        className="fixed bottom-5 right-4 z-[60] flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95 lg:bottom-6 lg:right-6"
      >
        {abierto ? <X className="size-6" /> : <Bot className="size-6" />}
      </button>

      {abierto && (
        <div className="fixed inset-x-2 bottom-24 z-[60] flex max-h-[72vh] flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl lg:inset-x-auto lg:right-6 lg:bottom-24 lg:w-[400px]">
          {/* Cabecera */}
          <header className="flex shrink-0 items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-white/15">
                <Bot className="size-5" />
              </span>
              <div>
                <div className="text-sm font-semibold leading-tight">Asistente restora</div>
                <div className="text-xs leading-tight opacity-80">
                  {a.flujo
                    ? FLUJOS_DISPONIBLES.find((f) => f.id === a.flujo)?.etiqueta
                    : "¿Qué quieres registrar?"}
                </div>
              </div>
            </div>
            {a.flujo && (
              <button
                type="button"
                onClick={() => a.reiniciar()}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs opacity-90 hover:bg-white/10 hover:opacity-100"
              >
                <RotateCcw className="size-3.5" />
                Cambiar
              </button>
            )}
          </header>

          {/* Cuerpo */}
          <div className="flex-1 space-y-2 overflow-y-auto bg-background p-4">
            {!a.flujo ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Hola 👋 Cuéntame qué necesitas registrar y lo completo contigo por chat.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {FLUJOS_DISPONIBLES.map((f) => {
                    const Icono = ICONOS_FLUJO[f.icono] ?? ClipboardPen;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => elegirFlujo(f.id)}
                        className="flex items-start gap-3 rounded-xl border bg-card p-3 text-left transition-all hover:border-primary/40 hover:bg-accent/50 active:scale-[0.99]"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                          <Icono className="size-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold">{f.etiqueta}</span>
                          <span className="block text-xs text-muted-foreground">
                            {f.descripcion}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                {a.mensajes.map((m, i) => (
                  <div
                    key={i}
                    className={m.rol === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={
                        m.rol === "user"
                          ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                          : "max-w-[90%] rounded-2xl rounded-bl-sm bg-secondary px-3 py-2 text-sm text-secondary-foreground"
                      }
                    >
                      <TextoRico texto={m.contenido} />
                    </div>
                  </div>
                ))}

                {a.estado === "escribiendo" && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm bg-secondary px-3 py-2 text-sm text-muted-foreground">
                      Escribiendo…
                    </div>
                  </div>
                )}

                {a.ultimaRespuesta && !mostrarConfirmacion && (
                  <BorradorPanel respuesta={a.ultimaRespuesta} />
                )}

                {a.ultimaRespuesta && mostrarConfirmacion && (
                  <ResumenConfirmacion
                    respuesta={a.ultimaRespuesta}
                    guardando={a.estado === "guardando"}
                    onConfirmar={onConfirmar}
                    onEditar={() => setEditando(true)}
                  />
                )}

                {a.error && <p className="text-sm text-destructive">{a.error}</p>}
                <div ref={finRef} />
              </>
            )}
          </div>

          {/* Entrada */}
          {a.flujo && (!mostrarConfirmacion || editando) && (
            <div className="shrink-0 border-t bg-card">
              {(errorVoz || voz.error) && (
                <p className="px-4 pt-3 text-xs text-destructive">{errorVoz || voz.error}</p>
              )}
              {voz.estado === "grabando" && (
                <div className="flex items-center gap-2 px-4 pt-3 text-xs text-primary">
                  <AudioLines className="size-4 animate-pulse" />
                  <span>Escuchando… habla y haz una pausa para terminar.</span>
                  <span className="ml-auto h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                    <span
                      className="block h-full bg-primary transition-[width] duration-75"
                      style={{ width: `${Math.round(voz.nivel * 100)}%` }}
                    />
                  </span>
                </div>
              )}
              <form onSubmit={onEnviar} className="flex items-center gap-2 p-3">
                <input
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder={
                    voz.estado === "procesando"
                      ? "Transcribiendo…"
                      : "Escribe o dicta tu respuesta…"
                  }
                  className="h-10 flex-1 rounded-full border bg-background px-4 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-60"
                  disabled={
                    a.estado === "escribiendo" || a.estado === "guardando" || grabandoOcupado
                  }
                />
                {voz.soportado && (
                  <button
                    type="button"
                    aria-label={voz.estado === "grabando" ? "Detener grabación" : "Dictar por voz"}
                    onClick={() => {
                      setErrorVoz(null);
                      if (voz.estado === "grabando") voz.detener();
                      else if (voz.estado === "inactivo") void voz.iniciar();
                    }}
                    disabled={
                      voz.estado === "procesando" ||
                      a.estado === "escribiendo" ||
                      a.estado === "guardando"
                    }
                    className={
                      "flex size-10 items-center justify-center rounded-full transition-colors disabled:opacity-50 " +
                      (voz.estado === "grabando"
                        ? "animate-pulse bg-destructive text-destructive-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground")
                    }
                  >
                    {voz.estado === "grabando" ? (
                      <Square className="size-4" />
                    ) : voz.estado === "procesando" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Mic className="size-4" />
                    )}
                  </button>
                )}
                <button
                  type="submit"
                  aria-label="Enviar"
                  disabled={!texto.trim() || a.estado === "escribiendo" || grabandoOcupado}
                  className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
                >
                  <SendHorizontal className="size-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
