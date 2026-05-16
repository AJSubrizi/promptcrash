# Grok Tool Calling Example

This example shows the shape of a Grok/xAI tool-calling failure that PromptCrash is designed to capture.

It does not call Grok directly. The goal is to show how to report a bad output after your app has already detected the failure.

```bash
pnpm --filter @promptcrash/sdk build
pnpm dlx tsx examples/grok-tool-calling/capture-grok-tool-failure.ts
```

Before running the example, start the dashboard:

```bash
pnpm db:init
pnpm dev
```

PromptCrash works without `XAI_API_KEY`. If a key is configured in the dashboard, Grok may enhance classification and generated test scaffolds.
