import { cn } from "@/lib/utils";

export function CodeBlock({ value, className }: { value: unknown; className?: string }) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? null, null, 2);
  return (
    <pre
      className={cn(
        "max-h-[420px] overflow-auto rounded-md border border-slate-800 bg-slate-950/90 p-4 font-mono text-xs leading-5 text-slate-100 shadow-inner",
        className
      )}
    >
      <code>{text}</code>
    </pre>
  );
}
