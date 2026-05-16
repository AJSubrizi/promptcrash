import { describe, expect, it } from "vitest";
import { deterministicClassify } from "../lib/classification";

describe("deterministic classification", () => {
  it("classifies schema violations", () => {
    const result = deterministicClassify({
      output: "The response failed Zod parsing because JSON was invalid",
      expectedBehavior: "Return valid RefundDecisionSchema"
    });

    expect(result).toMatchObject({ failureType: "schema_violation", source: "fallback" });
  });

  it("raises severity for customer-impacting tool misuse", () => {
    const result = deterministicClassify({
      output: "Refunded both purchases after tool call",
      expectedBehavior: "Refund only one purchase"
    });

    expect(result.failureType).toBe("tool_misuse");
    expect(result.severity).toBe("high");
  });

  it("classifies Grok/xAI-specific failure shapes", () => {
    expect(deterministicClassify({ output: "JSON mode returned malformed JSON" }).failureType).toBe(
      "json_mode_error"
    );
    expect(
      deterministicClassify({ output: "Context length exceeded max tokens" }).failureType
    ).toBe("context_overflow");
    expect(deterministicClassify({ output: "The answer exposed email PII" }).failureType).toBe(
      "pii_leakage"
    );
  });
});
