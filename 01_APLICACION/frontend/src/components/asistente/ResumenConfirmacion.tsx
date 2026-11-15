import { CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RespuestaAsistente } from "@/lib/asistente";

/**
 * Paso final: muestra el resumen y pide confirmación explícita antes de
 * guardar. "Editar" devuelve el control al chat para corregir por conversación.
 */
export function ResumenConfirmacion({
  respuesta,
  guardando,
  onConfirmar,
  onEditar,
}: {
  respuesta: RespuestaAsistente;
  guardando: boolean;
  onConfirmar: () => void;
  onEditar: () => void;
}) {
  return (
    <div className="rounded-xl border-2 border-primary/30 bg-accent/60 p-4">
      <div className="mb-3 flex items-center gap-2">
        <CheckCircle2 className="size-5 text-primary" />
        <span className="text-base font-semibold">Confirma para guardar</span>
      </div>

      <ul className="mb-4 space-y-0.5 text-sm">
        {respuesta.resumen.lineas.map((linea, i) => (
          <li key={i} className="whitespace-pre-wrap leading-snug">
            {linea}
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <Button type="button" onClick={onConfirmar} disabled={guardando} className="flex-1">
          <Save /> {guardando ? "Guardando…" : "Confirmar y guardar"}
        </Button>
        <Button type="button" variant="outline" onClick={onEditar} disabled={guardando}>
          Editar
        </Button>
      </div>
    </div>
  );
}
