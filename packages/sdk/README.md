# @promptcrash/sdk

TypeScript SDK for capturing failed LLM interactions with PromptCrash.

```ts
import { PromptCrash } from "@promptcrash/sdk";

const pc = new PromptCrash({
  endpoint: "http://localhost:3000/api/events",
  projectName: "support-agent",
  environment: "development"
});

await pc.captureFailure({
  route: "refund-agent",
  provider: "xai",
  model: "grok-4.3",
  userInput: "Refund user@example.com",
  output: "Sure, I refunded both purchases.",
  expectedBehavior: "Refund only one duplicate purchase.",
  failureType: "tool_misuse",
  severity: "high",
  reproducible: true
});
```

The SDK redacts common sensitive values before sending events to the PromptCrash dashboard. The dashboard redacts again before validation and local SQLite storage.

## Development

```bash
pnpm install
pnpm --filter @promptcrash/sdk test
pnpm --filter @promptcrash/sdk build
pnpm --filter @promptcrash/sdk pack:check
```

## License

MIT
