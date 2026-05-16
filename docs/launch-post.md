# Launch Post Draft

Shipping PromptCrash 0.1.

PromptCrash turns bad LLM outputs into reproducible bugs.

It is a local-first crash reporter for LLM apps: capture the failed interaction, redact sensitive values, classify the failure, export replay JSON, and generate a Vitest regression scaffold.

Why this matters:

- LLM failures usually are not stack traces.
- The bug often lives across prompts, retrieved context, tool calls, schema expectations, provider metadata, and the model output.
- If that context is scattered across logs and screenshots, the failure is hard to reproduce and almost impossible to test.

PromptCrash keeps the debugging artifact together:

```text
bad output -> redacted crash -> replay JSON -> regression scaffold
```

It works offline with SQLite and deterministic fallbacks. No hosted account. No paid model provider required.

It also works with Grok: if `XAI_API_KEY` is configured, PromptCrash can use `@ai-sdk/xai` to enhance classification and generated test scaffolds.

Repo: https://github.com/AJSubrizi/promptcrash

Built for AI engineers who want LLM bugs to behave more like software bugs.

@xai @grok
