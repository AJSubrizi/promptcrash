import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GeneratedTest({ code, source }: { code: string; source: "fallback" | "xai" }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Generated Vitest regression</CardTitle>
            <CardDescription>
              Deterministic by default, optionally enhanced by Grok.
            </CardDescription>
          </div>
          <Badge tone={source === "xai" ? "low" : "default"}>{source}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 md:pt-5">
        <CodeBlock value={code} />
      </CardContent>
    </Card>
  );
}
