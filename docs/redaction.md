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

## Example

Input:

```json
{
  "userInput": "Refund user@example.com. Call me at +1 415-555-2671.",
  "toolCalls": [
    {
      "name": "lookupCustomer",
      "input": {
        "apiKey": "sk_test_1234567890abcdef",
        "card": "4242 4242 4242 4242"
      }
    }
  ]
}
```

Stored redacted trace:

```json
{
  "userInput": "Refund [REDACTED_EMAIL]. Call me at [REDACTED_PHONE].",
  "toolCalls": [
    {
      "name": "lookupCustomer",
      "input": {
        "apiKey": "[REDACTED_SECRET]",
        "card": "[REDACTED_CARD]"
      }
    }
  ]
}
```

## Limitations

Redaction is best effort. PromptCrash catches common sensitive patterns, but no regex-based redactor can guarantee removal of every secret, identifier, or proprietary value. Treat redaction as a defense-in-depth layer: keep captures local by default, add custom patterns for your domain, and avoid sending unnecessary sensitive context.
