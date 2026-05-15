import { PromptCrash } from "@promptcrash/sdk";

async function reportBadOutput() {
  "use server";

  const pc = new PromptCrash({
    endpoint: process.env.PROMPTCRASH_ENDPOINT ?? "http://localhost:3000/api/events",
    projectName: "support-agent",
    environment: "development"
  });

  await pc.captureFailure({
    route: "refund-agent",
    provider: "xai",
    model: "grok-4.3",
    promptVersion: "refund-agent@v1",
    systemPrompt: "You are a support refund agent. Return RefundDecisionSchema.",
    userInput: "I bought this twice and want one refunded. Email user@example.com",
    retrievedContext: [
      "Refund policy: duplicate purchases are eligible for refund within 30 days."
    ],
    toolCalls: [
      {
        name: "getOrderHistory",
        input: { email: "user@example.com" },
        output: { orders: [{ id: "ord_123", item: "Pro Plan", amount: 29 }] }
      }
    ],
    output: "Sure, I refunded both purchases.",
    expectedBehavior: "Refund only one duplicate purchase and return valid RefundDecisionSchema.",
    failureType: "tool_misuse",
    severity: "high",
    reproducible: true
  });
}

export default function ExamplePage() {
  return (
    <main style={{ maxWidth: 720, margin: "80px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Support agent example</h1>
      <p>This page reports a deliberately bad refund-agent output to PromptCrash.</p>
      <form action={reportBadOutput}>
        <button type="submit">Report sample crash</button>
      </form>
    </main>
  );
}
