import { describe, expect, it } from "vitest";
import { crashPayloadSchema } from "../lib/schemas";

describe("crash payload validation", () => {
  it("accepts the MVP event shape", () => {
    const parsed = crashPayloadSchema.parse({
      projectName: "support-agent",
      environment: "development",
      route: "refund-agent",
      provider: "xai",
      model: "grok-4.3",
      userInput: "refund one duplicate purchase",
      output: "refunded both purchases",
      expectedBehavior: "Refund only one duplicate purchase.",
      failureType: "tool_misuse",
      severity: "high",
      reproducible: true
    });

    expect(parsed.route).toBe("refund-agent");
  });

  it("rejects unknown failure types", () => {
    const parsed = crashPayloadSchema.safeParse({
      projectName: "support-agent",
      environment: "development",
      route: "refund-agent",
      provider: "xai",
      model: "grok-4.3",
      failureType: "angry_llm"
    });

    expect(parsed.success).toBe(false);
  });
});
