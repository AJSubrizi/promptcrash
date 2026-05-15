import { describe, expect, it } from "vitest";
import { buildPatterns, redactString, redactValue } from "../src/redact";

describe("SDK redaction", () => {
  it("redacts emails, phone numbers, secrets, and cards", () => {
    const input = "Email user@example.com, phone +1 415-555-2671, key sk_test_1234567890abcdef, card 4242 4242 4242 4242";

    expect(redactString(input)).toContain("[REDACTED_EMAIL]");
    expect(redactString(input)).toContain("[REDACTED_PHONE]");
    expect(redactString(input)).toContain("[REDACTED_SECRET]");
    expect(redactString(input)).toContain("[REDACTED_CARD]");
  });

  it("recursively redacts nested values and supports custom patterns", () => {
    const patterns = buildPatterns([{ name: "tenant", pattern: /tenant_[a-z0-9]+/gi }]);
    const output = redactValue(
      { user: { email: "agent@example.com", tenant: "tenant_abc123" } },
      patterns
    );

    expect(output).toEqual({
      user: {
        email: "[REDACTED_EMAIL]",
        tenant: "[REDACTED_TENANT]"
      }
    });
  });
});
