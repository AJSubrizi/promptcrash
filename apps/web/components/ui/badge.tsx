import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "low" | "medium" | "high" | "critical";
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium uppercase leading-5 tracking-normal",
        tone === "default" && "border-slate-700 bg-slate-800/80 text-slate-300",
        tone === "low" && "border-emerald-500/35 bg-emerald-500/12 text-emerald-300",
        tone === "medium" && "border-amber-400/35 bg-amber-400/12 text-amber-200",
        tone === "high" && "border-orange-400/40 bg-orange-400/14 text-orange-200",
        tone === "critical" && "border-red-400/45 bg-red-500/15 text-red-200",
        className
      )}
      {...props}
    />
  );
}
