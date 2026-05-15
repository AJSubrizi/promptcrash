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
