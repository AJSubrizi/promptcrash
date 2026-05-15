import { describe, expect, it } from "vitest";
import { redactCrashPayload } from "../lib/redaction";
import { crashPayloadSchema } from "../lib/schemas";
import { toCrashCreateData, withClassificationDefaults } from "../lib/storage";

describe("crash storage preparation", () => {
  it("redacts before serialization for storage", () => {
    const redacted = redactCrashPayload({
      projectName: "support-agent",
      environment: "development",
      route: "refund-agent",
      provider: "xai",
      model: "grok-4.3",
      systemPrompt: "secret sk_test_1234567890abcdef",
      userInput: "email user@example.com phone +1 415-555-2671",
      output: "refunded both purchases",
      expectedBehavior: "Refund only one purchase"
    });

    const parsed = crashPayloadSchema.parse(redacted);
    const data = toCrashCreateData(parsed);

    expect(data.systemPrompt).toContain("[REDACTED_SECRET]");
    expect(data.userInput).toContain("[REDACTED_EMAIL]");
    expect(data.userInput).toContain("[REDACTED_PHONE]");
    expect(data.userInput).not.toContain("user@example.com");
  });

  it("classifies events when clients omit failure type and severity", () => {
    const parsed = crashPayloadSchema.parse({
      projectName: "support-agent",
      environment: "development",
      route: "refund-agent",
      provider: "xai",
      model: "grok-4.3",
      output: "The tool refunded both purchases",
      expectedBehavior: "Refund only one duplicate purchase"
    });

    const classified = withClassificationDefaults(parsed, {
      projectName: "support-agent",
      environment: "development",
      route: "refund-agent",
      provider: "xai",
      model: "grok-4.3"
    });

    expect(classified.failureType).toBe("tool_misuse");
    expect(classified.severity).toBe("high");
  });
});
