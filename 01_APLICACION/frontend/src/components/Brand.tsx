import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

/** Marca RESTORA: isotipo + wordmark. */
export function Brand({
  size = "md",
  showWordmark = true,
  className,
}: {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
}) {
  const box = size === "lg" ? "size-11" : size === "sm" ? "size-7" : "size-9";
  const icon = size === "lg" ? "size-6" : size === "sm" ? "size-4" : "size-5";
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm",
          box,
        )}
      >
        <Leaf className={icon} strokeWidth={2.2} />
      </span>
      {showWordmark && (
        <span className={cn("font-display font-bold tracking-tight text-primary", text)}>
          restora
        </span>
      )}
    </span>
  );
}
