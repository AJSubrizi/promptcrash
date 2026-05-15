# Redaction

PromptCrash fails closed: sensitive values are redacted before storage.

Built-in redactors cover:

- Emails: `[REDACTED_EMAIL]`
- Phone numbers: `[REDACTED_PHONE]`
- API keys and token-like secrets: `[REDACTED_SECRET]`
- Credit-card-like numbers: `[REDACTED_CARD]`

The SDK redacts before sending payloads to the dashboard. The server redacts again before validation and persistence. This double-pass approach keeps the stored crash as a redacted trace and protects apps that send raw events directly to `/api/events`.

Custom SDK patterns are supported:

```ts
new PromptCrash({
  endpoint: "http://localhost:3000/api/events",
  projectName: "support-agent",
  environment: "development",
  redactionPatterns: [{ name: "tenant", pattern: /tenant_[a-z0-9]+/gi }]
});
```

Custom matches are shown as `[REDACTED_TENANT]`.
