import { CodeBlock } from "@/components/code-block";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ToolCallViewer({ toolCalls }: { toolCalls?: unknown }) {
  const calls = Array.isArray(toolCalls) ? toolCalls : [];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tool calls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {calls.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tool calls captured.</p>
        ) : (
          calls.map((call, index) => <CodeBlock key={index} value={call} />)
        )}
      </CardContent>
    </Card>
  );
}
