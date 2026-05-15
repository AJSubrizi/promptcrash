# Concepts

## Crash

A crash is a failed LLM interaction captured as a structured debugging artifact: prompts, inputs, retrieved context, tool calls, model output, expected behavior, classification, severity, and metadata.

## Classification

PromptCrash classifies failures into stable buckets such as `hallucination`, `tool_misuse`, `schema_violation`, `retrieval_failure`, and `provider_error`.

Classification never blocks capture. If `XAI_API_KEY` is configured, PromptCrash may ask Grok for a better classification. If that call fails or is unavailable, the deterministic fallback is used.

## Replay JSON

Replay JSON is a portable snapshot of the captured interaction. It is designed for local harnesses, issue attachments, and regression fixtures.

## Regression Scaffold

Every crash can produce a Vitest regression scaffold. The default generator is deterministic and offline. Optional Grok generation can improve the scaffold, but is never required.

## Local-first

PromptCrash stores crashes in local SQLite by default. Core capture, redaction, replay JSON export, and deterministic regression scaffolds work without a hosted account or paid model provider.
