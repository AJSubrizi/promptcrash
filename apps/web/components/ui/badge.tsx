import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "low" | "medium" | "high" | "critical";
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        tone === "default" && "bg-muted text-muted-foreground",
        tone === "low" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        tone === "medium" && "border-amber-200 bg-amber-50 text-amber-700",
        tone === "high" && "border-orange-200 bg-orange-50 text-orange-700",
        tone === "critical" && "border-red-200 bg-red-50 text-red-700",
        className
      )}
      {...props}
    />
  );
}
