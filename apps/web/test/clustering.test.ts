import { describe, expect, it } from "vitest";
import { buildCrashClusters } from "../lib/clustering";

describe("crash clustering", () => {
  it("groups by failure type, route, and prompt version with severity distribution", () => {
    const clusters = buildCrashClusters([
      { failureType: "tool_misuse", route: "refund-agent", promptVersion: "v1", severity: "high" },
      { failureType: "tool_misuse", route: "refund-agent", promptVersion: "v1", severity: "critical" },
      { failureType: "tool_misuse", route: "refund-agent", promptVersion: "v2", severity: "low" },
      { failureType: "hallucination", route: "policy-agent", promptVersion: null, severity: "medium" }
    ]);

    expect(clusters).toHaveLength(3);
    expect(clusters[0]).toMatchObject({
      failureType: "tool_misuse",
      route: "refund-agent",
      promptVersion: "v1",
      count: 2,
      severity: { high: 1, critical: 1 }
    });
  });
});
