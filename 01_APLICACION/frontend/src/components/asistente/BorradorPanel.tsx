import { ClipboardCheck, Clock } from "lucide-react";
import type { RespuestaAsistente } from "@/lib/asistente";

/**
 * Vista viva del borrador que el asistente va completando: resumen de lo
 * capturado y los campos que todavía faltan. Da transparencia al usuario antes
 * de confirmar.
 */
export function BorradorPanel({ respuesta }: { respuesta: RespuestaAsistente }) {
  const tieneContenido = respuesta.resumen.lineas.length > 0;
  if (!tieneContenido && respuesta.camposFaltantes.length === 0) return null;

  return (
    <div className="rounded-xl border bg-card p-3 text-sm">
      <div className="mb-1.5 flex items-center gap-2">
        <ClipboardCheck className="size-4 text-success" />
        <span className="text-sm font-semibold">{respuesta.resumen.titulo}</span>
      </div>

      {tieneContenido && (
        <ul className="space-y-0.5 text-muted-foreground">
          {respuesta.resumen.lineas.map((linea, i) => (
            <li key={i} className="whitespace-pre-wrap leading-snug">
              {linea}
            </li>
          ))}
        </ul>
      )}

      {respuesta.camposFaltantes.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {respuesta.camposFaltantes.map((c) => (
            <span
              key={c.clave}
              className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning"
            >
              <Clock className="size-3" />
              Falta: {c.etiqueta}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
