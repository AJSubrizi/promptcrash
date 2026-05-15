import { CircleDot } from "lucide-react";

export function TraceTimeline({ items }: { items: Array<{ label: string; value?: string }> }) {
  return (
    <ol className="space-y-3">
      {items.map((item) => (
        <li key={item.label} className="flex gap-3">
          <CircleDot className="mt-0.5 h-4 w-4 text-primary" />
          <div>
            <div className="text-sm font-medium">{item.label}</div>
            {item.value ? <div className="text-sm text-muted-foreground">{item.value}</div> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
