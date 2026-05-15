# Replay JSON

Replay JSON captures enough context to reproduce an LLM failure without depending on production logs.

Replay JSON can include:

- Project, environment, route, provider, model, and prompt version
- System prompt and user input
- Retrieved context
- Tool call inputs and outputs
- Model output and expected behavior
- Failure type, severity, reproducibility, and metadata

The dashboard renders replay JSON on each crash detail page. You can use it as a fixture in a local eval, a bug report attachment, or a regression scaffold.

## Example

```json
{
  "schema": "promptcrash.replay.v1",
  "id": "crash_demo_refund",
  "projectName": "support-agent",
  "environment": "development",
  "route": "refund-agent",
  "provider": "xai",
  "model": "grok-4.3",
  "promptVersion": "refund-agent@v1",
  "systemPrompt": "Return RefundDecisionSchema JSON.",
  "userInput": "Refund [REDACTED_EMAIL]",
  "retrievedContext": [
    "Refund policy: duplicate purchases are eligible for one refund within 30 days."
  ],
  "toolCalls": [
    {
      "name": "getOrderHistory",
      "input": {
        "email": "[REDACTED_EMAIL]"
      },
      "output": {
        "orders": ["ord_123", "ord_124"]
      }
    }
  ],
  "output": "Sure, I refunded both purchases.",
  "expectedBehavior": "Refund only one duplicate purchase.",
  "failureType": "tool_misuse",
  "severity": "high",
  "reproducible": true,
  "metadata": {
    "ticketId": "SUP-1042"
  }
}
```

Replay JSON is not a production log dump. Keep it focused on the minimum context needed to reproduce or explain the failure.
