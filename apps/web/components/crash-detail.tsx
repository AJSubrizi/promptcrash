import { CodeBlock } from "@/components/code-block";
import { GeneratedTest } from "@/components/generated-test";
import { ReplayJson } from "@/components/replay-json";
import { ToolCallViewer } from "@/components/tool-call-viewer";
import { TraceTimeline } from "@/components/trace-timeline";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Severity } from "@/lib/schemas";

export type CrashDetailData = {
  id: string;
  projectName: string;
  environment: string;
  route: string;
  provider: string;
  model: string;
  promptVersion?: string | null;
  systemPrompt?: string | null;
  userInput?: unknown;
  retrievedContext?: unknown;
  toolCalls?: unknown;
  output?: unknown;
  expectedBehavior?: string | null;
  failureType: string;
  severity: Severity;
  reproducible: boolean;
  metadata?: unknown;
  createdAt: string;
};

export function CrashDetail({
  crash,
  replay,
  generatedTest
}: {
  crash: CrashDetailData;
  replay: unknown;
  generatedTest: { code: string; source: "fallback" | "xai" };
}) {
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>{crash.route}</CardTitle>
              <CardDescription>
                {crash.projectName} · {crash.provider}/{crash.model} · {new Date(crash.createdAt).toLocaleString()}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{crash.failureType}</Badge>
              <Badge tone={crash.severity}>{crash.severity}</Badge>
              {crash.reproducible ? <Badge tone="low">reproducible</Badge> : null}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TraceTimeline
            items={[
              { label: "Environment", value: crash.environment },
              { label: "Prompt version", value: crash.promptVersion ?? "unversioned" },
              { label: "Expected behavior", value: crash.expectedBehavior ?? "not provided" }
            ]}
          />
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="System prompt" value={crash.systemPrompt ?? ""} />
        <Section title="User input" value={crash.userInput} />
        <Section title="Retrieved context" value={crash.retrievedContext} />
        <Section title="Model output" value={crash.output} />
      </div>

      <ToolCallViewer toolCalls={crash.toolCalls} />
      <Section title="Metadata" value={crash.metadata} />
      <ReplayJson replay={replay} />
      <GeneratedTest code={generatedTest.code} source={generatedTest.source} />
    </div>
  );
}

function Section({ title, value }: { title: string; value: unknown }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CodeBlock value={value} />
      </CardContent>
    </Card>
  );
}
