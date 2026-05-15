import { db } from "./db";
import { redactCrashPayload } from "./redaction";
import { crashPayloadSchema, type CrashPayload } from "./schemas";
import { toCrashCreateData, withClassificationDefaults } from "./storage";

export const DEMO_PROJECT_NAME = "PromptCrash Demo";

export const demoCrashes: CrashPayload[] = [
  {
    projectName: DEMO_PROJECT_NAME,
    environment: "development",
    route: "refund-agent",
    provider: "xai",
    model: "grok-4.3",
    promptVersion: "refund-agent@v2",
    systemPrompt: "Return RefundDecisionSchema JSON with action, orderId, amount, and reason. Never refund more than one duplicate purchase.",
    userInput: "I bought Pro twice. Please refund the duplicate purchase. My email is mara.chen@example.com.",
    retrievedContext: [
      "Refund policy: duplicate purchases are eligible for a single refund within 30 days.",
      "Order ord_981 was charged $29 on May 12. Order ord_982 was charged $29 on May 12."
    ],
    toolCalls: [
      {
        name: "getOrderHistory",
        input: { email: "mara.chen@example.com" },
        output: { orders: ["ord_981", "ord_982"] }
      }
    ],
    output: "Refund approved for both duplicate orders.",
    expectedBehavior: "Return valid RefundDecisionSchema JSON and refund only one duplicate order.",
    failureType: "schema_violation",
    severity: "high",
    reproducible: true,
    metadata: { demo: true, source: "seed", label: "Schema violation" }
  },
  {
    projectName: DEMO_PROJECT_NAME,
    environment: "staging",
    route: "billing-agent",
    provider: "openai",
    model: "gpt-4.1",
    promptVersion: "billing-agent@v4",
    systemPrompt: "Use chargeCustomer only after the customer explicitly approves a new charge.",
    userInput: "Can you tell me whether my card ending 4242 is still active?",
    retrievedContext: ["Billing tools include getPaymentMethod and chargeCustomer."],
    toolCalls: [
      {
        name: "chargeCustomer",
        input: { customerId: "cus_demo_42", amount: 4900, card: "4242 4242 4242 4242" },
        output: { status: "succeeded", chargeId: "ch_demo_wrong_tool" }
      }
    ],
    output: "Your card is active, and I charged $49 to confirm it.",
    expectedBehavior: "Call getPaymentMethod only. Never charge the customer for a card-status question.",
    failureType: "tool_misuse",
    severity: "critical",
    reproducible: true,
    metadata: { demo: true, source: "seed", label: "Wrong tool call" }
  },
  {
    projectName: DEMO_PROJECT_NAME,
    environment: "development",
    route: "policy-agent",
    provider: "anthropic",
    model: "claude-3.5-sonnet",
    promptVersion: "policy-agent@v1",
    systemPrompt: "Answer policy questions only from retrieved context. Say when the policy is not present.",
    userInput: "Do enterprise customers get a 90-day refund window?",
    retrievedContext: [
      "Refund policy: all paid plans have a 30-day refund window.",
      "Enterprise billing requires manual invoice review."
    ],
    toolCalls: [],
    output: "Yes. Enterprise customers receive a 90-day refund window under the premium satisfaction policy.",
    expectedBehavior: "State that the retrieved policy only mentions a 30-day refund window and does not include a 90-day enterprise exception.",
    failureType: "hallucination",
    severity: "medium",
    reproducible: true,
    metadata: { demo: true, source: "seed", label: "Hallucinated policy" }
  },
  {
    projectName: DEMO_PROJECT_NAME,
    environment: "development",
    route: "accessibility-agent",
    provider: "local",
    model: "llama-3.1-8b",
    promptVersion: "accessibility-agent@v3",
    systemPrompt: "Help users with product accessibility settings and account configuration.",
    userInput: "How do I enable captions for recorded training videos?",
    retrievedContext: ["Captions can be enabled from Settings > Learning > Captions."],
    toolCalls: [],
    output: "I cannot help with that request.",
    expectedBehavior: "Explain the captions setting path and do not refuse a safe accessibility request.",
    failureType: "bad_refusal",
    severity: "medium",
    reproducible: true,
    metadata: { demo: true, source: "seed", label: "Bad refusal" }
  },
  {
    projectName: DEMO_PROJECT_NAME,
    environment: "staging",
    route: "support-search-agent",
    provider: "other",
    model: "local-rag-v2",
    promptVersion: "support-search@v5",
    systemPrompt: "Answer from retrieved support docs and cite the matching article ID.",
    userInput: "Where do I rotate my API token sk_live_1234567890abcdef?",
    retrievedContext: [
      "Article DOC-17: Password reset is available from Account > Security.",
      "Article DOC-22: Team invites are managed from Workspace > Members."
    ],
    toolCalls: [
      {
        name: "searchDocs",
        input: { query: "rotate API token", phone: "+1 415-555-0198" },
        output: { hits: ["DOC-17", "DOC-22"], latencyMs: 180 }
      }
    ],
    output: "Go to Account > Security > Password reset to rotate your API token. Citation: DOC-17.",
    expectedBehavior: "Retrieve the API token documentation or say no matching article was found. Do not cite password-reset docs for token rotation.",
    failureType: "retrieval_failure",
    severity: "high",
    reproducible: true,
    metadata: { demo: true, source: "seed", label: "Retrieval failure" }
  }
];

export async function seedDemoCrashes() {
  await db.crash.deleteMany({
    where: {
      projectName: DEMO_PROJECT_NAME,
      metadata: { contains: "\"demo\":true" }
    }
  });

  const created = await Promise.all(
    demoCrashes.map(async (crash) => {
      const redacted = redactCrashPayload(crash);
      const parsed = crashPayloadSchema.parse(redacted);
      const payload = withClassificationDefaults(parsed, redacted);
      return db.crash.create({ data: toCrashCreateData(payload) });
    })
  );

  return { count: created.length };
}
