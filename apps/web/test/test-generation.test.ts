import { describe, expect, it } from "vitest";
import { generateDeterministicVitest } from "../lib/test-generation";
import type { CrashPayload } from "../lib/schemas";

describe("deterministic test generation", () => {
  it("creates a self-contained Vitest regression", () => {
    const crash: CrashPayload = {
      projectName: "support-agent",
      environment: "development",
      route: "refund-agent",
      provider: "xai",
      model: "grok-4.3",
      output: "Sure, I refunded both purchases.",
      expectedBehavior: "Refund only one duplicate purchase.",
      failureType: "tool_misuse",
      severity: "high",
      reproducible: true
    };

    const result = generateDeterministicVitest(crash);

    expect(result.source).toBe("fallback");
    expect(result.code).toContain('import { describe, expect, it } from "vitest";');
    expect(result.code).toContain("runPromptCrashReplay");
    expect(result.code).toContain("does not repeat the captured bad output");
    expect(result.code).toContain("refund-agent");
    expect(result.code).toContain("tool_misuse");
  });
});
