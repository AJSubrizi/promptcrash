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
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-2 font-mono text-xs uppercase text-primary">Incident summary</div>
              <CardTitle className="break-words text-xl md:text-2xl">{crash.route}</CardTitle>
              <CardDescription className="mt-2 font-mono">
                {crash.projectName} / {crash.provider}/{crash.model} /{" "}
                {new Date(crash.createdAt).toLocaleString()}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{crash.failureType}</Badge>
              <Badge tone={crash.severity}>{crash.severity}</Badge>
              {crash.reproducible ? <Badge tone="low">reproducible</Badge> : null}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 md:pt-5">
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
        <Section
          title="System prompt"
          description="Instruction context at failure time."
          value={crash.systemPrompt ?? ""}
        />
        <Section
          title="User input"
          description="Captured user payload after redaction."
          value={crash.userInput}
        />
        <Section
          title="Retrieved context"
          description="RAG or tool context included in the run."
          value={crash.retrievedContext}
        />
        <Section
          title="Model output"
          description="Observed response that violated expectations."
          value={crash.output}
        />
      </div>

      <ToolCallViewer toolCalls={crash.toolCalls} />
      <Section
        title="Metadata"
        description="Additional diagnostic fields attached by the app."
        value={crash.metadata}
      />
      <ReplayJson replay={replay} />
      <GeneratedTest code={generatedTest.code} source={generatedTest.source} />
    </div>
  );
}

function Section({
  title,
  description,
  value
}: {
  title: string;
  description: string;
  value: unknown;
}) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 md:pt-5">
        <CodeBlock value={value} />
      </CardContent>
    </Card>
  );
}
