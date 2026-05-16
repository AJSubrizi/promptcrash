import { CodeBlock } from "@/components/code-block";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ToolCallViewer({ toolCalls }: { toolCalls?: unknown }) {
  const calls = Array.isArray(toolCalls) ? toolCalls : [];
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Tool calls</CardTitle>
          <span className="font-mono text-xs text-muted-foreground">{calls.length} captured</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-4 md:pt-5">
        {calls.length === 0 ? (
          <p className="rounded-md border border-dashed bg-background/30 p-4 text-sm text-muted-foreground">
            No tool calls captured.
          </p>
        ) : (
          calls.map((call, index) => <CodeBlock key={index} value={call} />)
        )}
      </CardContent>
    </Card>
  );
}
