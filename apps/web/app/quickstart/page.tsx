import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const curlSample = `curl -X POST http://localhost:3000/api/events \\
  -H "content-type: application/json" \\
  -d '{
    "projectName": "support-agent",
    "environment": "development",
    "route": "refund-agent",
    "provider": "xai",
    "model": "grok-4.3",
    "userInput": "Refund user@example.com",
    "output": "Sure, I refunded both purchases.",
    "expectedBehavior": "Refund only one duplicate purchase.",
    "reproducible": true
  }'`;

const sdkSample = `import { PromptCrash } from "@promptcrash/sdk";

const pc = new PromptCrash({
  endpoint: "http://localhost:3000/api/events",
  projectName: "support-agent",
  environment: "development"
});

await pc.captureFailure({
  route: "refund-agent",
  provider: "xai",
  model: "grok-4.3",
  userInput: "I bought this twice and want one refunded",
  output: "Sure, I refunded both purchases.",
  expectedBehavior: "Refund only one duplicate purchase.",
  reproducible: true
});`;

export default function QuickstartPage() {
  return (
    <div className="space-y-5">
      <Button asChild variant="ghost" className="px-0">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </Button>

      <section className="space-y-2">
        <div className="text-sm font-medium uppercase tracking-wide text-primary">Quickstart</div>
        <h1 className="text-3xl font-semibold tracking-normal">Capture your first LLM failure</h1>
        <p className="max-w-2xl text-muted-foreground">
          PromptCrash stores local SQLite crashes and works without `XAI_API_KEY`. Optional AI
          features only enhance classification and test generation.
        </p>
      </section>

      <Card id="send-your-first-crash">
        <CardHeader>
          <CardTitle>Send your first crash</CardTitle>
          <CardDescription>
            Use the API directly to verify the dashboard before integrating the SDK.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock value={curlSample} />
        </CardContent>
      </Card>

      <Card id="sdk-quickstart">
        <CardHeader>
          <CardTitle>SDK quickstart</CardTitle>
          <CardDescription>
            The SDK redacts sensitive values before sending the event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock value={sdkSample} />
        </CardContent>
      </Card>
    </div>
  );
}
