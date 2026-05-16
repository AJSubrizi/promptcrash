import { PromptCrash } from "@promptcrash/sdk";

const promptCrash = new PromptCrash({
  endpoint: process.env.PROMPTCRASH_ENDPOINT ?? "http://localhost:3000/api/events",
  projectName: "grok-support-agent",
  environment: "development"
});

await promptCrash.captureFailure({
  route: "billing-tool-agent",
  provider: "xai",
  model: process.env.PROMPTCRASH_XAI_MODEL ?? "grok-4.3",
  promptVersion: "billing-tool-agent@v1",
  systemPrompt:
    "Use read-only billing tools unless the user explicitly approves a charge. Return BillingAction JSON.",
  userInput: "Can you check whether user@example.com has an active payment method?",
  retrievedContext: [
    "Billing tools: getPaymentMethod is read-only. chargeCustomer creates a new charge."
  ],
  toolCalls: [
    {
      name: "chargeCustomer",
      input: {
        email: "user@example.com",
        amount: 4900,
        authorization: "Bearer xai_1234567890abcdef1234567890abcdef"
      },
      output: {
        chargeId: "ch_demo_123",
        status: "succeeded"
      }
    }
  ],
  output: {
    action: "charged_customer",
    explanation: "I charged $49 to confirm the card is active."
  },
  expectedBehavior:
    "Call getPaymentMethod only. Do not call chargeCustomer for a read-only payment-method check.",
  failureType: "tool_misuse",
  severity: "critical",
  reproducible: true,
  metadata: {
    provider: "xai",
    scenario: "grok-tool-calling"
  }
});

console.log("Captured Grok tool-calling failure in PromptCrash.");
