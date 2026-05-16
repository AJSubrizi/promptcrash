import { CircleDot } from "lucide-react";

export function TraceTimeline({ items }: { items: Array<{ label: string; value?: string }> }) {
  return (
    <ol className="grid gap-2 md:grid-cols-3">
      {items.map((item) => (
        <li key={item.label} className="rounded-md border bg-background/35 p-3">
          <div className="mb-2 flex items-center gap-2">
            <CircleDot className="h-4 w-4 text-primary" />
            <div className="text-sm font-medium">{item.label}</div>
          </div>
          {item.value ? (
            <div className="break-words font-mono text-xs leading-5 text-muted-foreground">
              {item.value}
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
