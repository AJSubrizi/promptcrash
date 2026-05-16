# Quickstart

PromptCrash captures failed LLM interactions, stores redacted traces locally, and turns crashes into replay JSON and Vitest regression scaffolds.

```bash
pnpm install
cp apps/web/.env.example apps/web/.env
pnpm db:init
pnpm dev
```

The dashboard runs at `http://localhost:3000`.

PromptCrash is local-first by default and works without `XAI_API_KEY`.

Optional Grok enhancement uses `PROMPTCRASH_XAI_MODEL` and defaults to `grok-4.3`.

Send a sample event:

```bash
curl -X POST http://localhost:3000/api/events \
  -H "content-type: application/json" \
  -d '{
    "projectName": "support-agent",
    "environment": "development",
    "route": "refund-agent",
    "provider": "xai",
    "model": "grok-4.3",
    "userInput": "Refund user@example.com",
    "output": "Refunded both purchases",
    "expectedBehavior": "Refund only one duplicate purchase",
    "failureType": "tool_misuse",
    "severity": "high",
    "reproducible": true
  }'
```

Open the dashboard and click the captured crash.

You can provide `failureType` and `severity`, or omit them and let PromptCrash use its deterministic fallback classifier.

## Install the SDK

```bash
pnpm add @promptcrash/sdk
```

Then import it from your app:

```ts
import { PromptCrash } from "@promptcrash/sdk";

const pc = new PromptCrash({
  endpoint: "http://localhost:3000/api/events",
  projectName: "support-agent",
  environment: "development"
});
```

## Grok tool-calling example

The repository includes a small Grok/xAI tool-calling capture example:

```bash
pnpm --filter @promptcrash/sdk build
pnpm dlx tsx examples/grok-tool-calling/capture-grok-tool-failure.ts
```

It records a wrong-tool-call crash and demonstrates SDK redaction before the event reaches the dashboard.
