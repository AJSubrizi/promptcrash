import { describe, expect, it } from "vitest";
import { demoCrashes } from "../lib/demo-data";
import { redactCrashPayload } from "../lib/redaction";
import { crashPayloadSchema } from "../lib/schemas";

describe("demo dataset", () => {
  it("contains the five requested failure modes", () => {
    expect(demoCrashes.map((crash) => crash.failureType).sort()).toEqual([
      "bad_refusal",
      "hallucination",
      "retrieval_failure",
      "schema_violation",
      "tool_misuse"
    ]);
  });

  it("is valid after redaction", () => {
    for (const crash of demoCrashes) {
      const parsed = crashPayloadSchema.safeParse(redactCrashPayload(crash));
      expect(parsed.success).toBe(true);
    }
  });
});
