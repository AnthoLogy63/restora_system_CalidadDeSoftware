import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Tone = "default" | "primary" | "success" | "warning" | "danger";

const TONES: Record<Tone, string> = {
  default: "bg-secondary text-muted-foreground",
  primary: "bg-accent text-primary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/10 text-destructive",
};

/** Tarjeta de indicador (KPI): etiqueta, valor, ayuda opcional e icono. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  loading,
  children,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: LucideIcon;
  tone?: Tone;
  loading?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("p-4 sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={cn("flex size-9 items-center justify-center rounded-lg", TONES[tone])}>
          <Icon className="size-[18px]" />
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold sm:mt-3 sm:text-3xl tracking-tight tabular-nums">
        {loading ? <Skeleton className="h-9 w-28" /> : value}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {children}
    </Card>
  );
}
