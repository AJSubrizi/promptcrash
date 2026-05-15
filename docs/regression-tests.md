# Regression Scaffolds

PromptCrash turns a captured crash into a Vitest regression scaffold so failures can become part of normal CI.

The default generated test is intentionally deterministic:

- It does not call a real LLM.
- It embeds the captured crash as a replay fixture.
- It checks that your replayed behavior does not repeat the captured bad output.
- It keeps the expected behavior visible in the test review.
- It includes an explicit `runPromptCrashReplay` adapter for your app-specific LLM wrapper, stub, local model, or recorded response.

When `XAI_API_KEY` is present, PromptCrash may ask Grok to generate a richer scaffold. If the AI call fails, PromptCrash falls back to the deterministic template.

The generated scaffold is a starting point. Wire `runPromptCrashReplay` to your app-specific runner or schema validator to make the regression executable against your own LLM wrapper.

## Example

```ts
import { describe, expect, it } from "vitest";

const replay = {
  route: "refund-agent",
  output: "Sure, I refunded both purchases.",
  expectedBehavior: "Refund only one duplicate purchase.",
  failureType: "tool_misuse",
  severity: "high"
};

describe("PromptCrash regression: refund-agent tool_misuse regression", () => {
  it("does not repeat the captured bad output", async () => {
    const actual = await runPromptCrashReplay(replay);
    const badOutput = replay.output === undefined ? undefined : JSON.stringify(replay.output);

    expect(actual).not.toEqual(replay.output);
    if (badOutput) {
      expect(JSON.stringify(actual)).not.toContain(badOutput.slice(0, 80));
    }
  });

  it("keeps the expected behavior visible for reviewers", () => {
    expect(replay.expectedBehavior).toContain("Refund only one duplicate purchase");
  });
});

async function runPromptCrashReplay(crash: typeof replay): Promise<unknown> {
  throw new Error("Connect this adapter to your app's LLM wrapper, stub, or recorded response.");
}
```

The scaffold intentionally avoids calling a paid provider from CI. Your project decides whether replay runs against a stub, recorded response, local model, or application-level wrapper.
