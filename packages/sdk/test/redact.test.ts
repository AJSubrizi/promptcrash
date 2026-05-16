import { describe, expect, it } from "vitest";
import { buildPatterns, redactString, redactValue } from "../src/redact";

describe("SDK redaction", () => {
  it("redacts emails, phone numbers, secrets, and cards", () => {
    const input =
      "Email user@example.com, phone +1 415-555-2671, key sk_test_1234567890abcdef, card 4242 4242 4242 4242";

    expect(redactString(input)).toContain("[REDACTED_EMAIL]");
    expect(redactString(input)).toContain("[REDACTED_PHONE]");
    expect(redactString(input)).toContain("[REDACTED_SECRET]");
    expect(redactString(input)).toContain("[REDACTED_CARD]");
  });

  it("redacts common provider tokens and authorization headers", () => {
    const input = [
      "Authorization: Bearer xai_1234567890abcdef1234567890abcdef",
      "GitHub token ghp_1234567890abcdef1234567890abcdef",
      "AWS key AKIA1234567890ABCDEF",
      "JWT eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature"
    ].join("\n");

    expect(redactString(input)).not.toContain("xai_1234567890abcdef1234567890abcdef");
    expect(redactString(input)).not.toContain("ghp_1234567890abcdef1234567890abcdef");
    expect(redactString(input)).not.toContain("AKIA1234567890ABCDEF");
    expect(redactString(input)).not.toContain("eyJhbGciOiJIUzI1NiJ9");
  });

  it("redacts real-world short and multi-segment API keys", () => {
    const input = [
      "OpenAI key sk-abc123def456",
      "Anthropic key sk-ant-api03-abc",
      "xAI key xai-short-key",
      "Stripe pk_live_abc123",
      "Custom api_v2_token_abc"
    ].join("\n");

    const output = redactString(input);

    expect(output).not.toContain("sk-abc123def456");
    expect(output).not.toContain("sk-ant-api03-abc");
    expect(output).not.toContain("xai-short-key");
    expect(output).not.toContain("pk_live_abc123");
    expect(output).not.toContain("api_v2_token_abc");
    expect(output).toContain("[REDACTED_SECRET]");
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

  it("redacts values for sensitive object keys", () => {
    const output = redactValue({
      password: "correct-horse-battery-staple",
      apiKey: "plain-key-that-does-not-match-a-token-pattern",
      nested: {
        authorization: "Bearer local-dev-token"
      },
      visible: "safe diagnostic metadata"
    });

    expect(output).toEqual({
      password: "[REDACTED_SECRET]",
      apiKey: "[REDACTED_SECRET]",
      nested: {
        authorization: "[REDACTED_SECRET]"
      },
      visible: "safe diagnostic metadata"
    });
  });

  it("handles circular objects without throwing", () => {
    const input: { email: string; self?: unknown } = { email: "person@example.com" };
    input.self = input;

    expect(redactValue(input)).toEqual({
      email: "[REDACTED_EMAIL]",
      self: "[REDACTED_CIRCULAR]"
    });
  });

  it("redacts maps and sets", () => {
    const output = redactValue({
      headers: new Map([
        ["authorization", "Bearer local-dev-token"],
        ["x-user", "admin@example.com"]
      ]),
      values: new Set(["tenant_alpha", "owner@example.com"])
    });

    expect(output).toEqual({
      headers: {
        authorization: "[REDACTED_SECRET]",
        "x-user": "[REDACTED_EMAIL]"
      },
      values: ["tenant_alpha", "[REDACTED_EMAIL]"]
    });
  });

  it("stops at the configured max depth", () => {
    const output = redactValue({ level1: { level2: { email: "person@example.com" } } }, undefined, {
      maxDepth: 1
    });

    expect(output).toEqual({
      level1: {
        level2: "[REDACTED_MAX_DEPTH]"
      }
    });
  });
});
