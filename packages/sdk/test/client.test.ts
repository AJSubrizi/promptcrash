import { describe, expect, it, vi } from "vitest";
import { PromptCrash } from "../src/client";

describe("PromptCrash client", () => {
  it("redacts before sending", async () => {
    const fetcher = vi.fn(async () => Response.json({ id: "crash_123" }, { status: 201 }));
    const pc = new PromptCrash({
      endpoint: "http://localhost:3000/api/events",
      projectName: "support-agent",
      environment: "development",
      fetch: fetcher as typeof fetch
    });

    await pc.captureFailure({
      route: "refund-agent",
      provider: "xai",
      model: "grok-4.3",
      userInput: "user@example.com",
      output: "bad output"
    });

    const body = JSON.parse(String(fetcher.mock.calls[0]?.[1]?.body));
    expect(body.userInput).toBe("[REDACTED_EMAIL]");
  });

  it("throws an actionable error when the dashboard is unreachable", async () => {
    const pc = new PromptCrash({
      endpoint: "http://localhost:3000/api/events",
      projectName: "support-agent",
      environment: "development",
      fetch: vi.fn(async () => {
        throw new Error("ECONNREFUSED");
      }) as typeof fetch
    });

    await expect(
      pc.captureFailure({
        route: "refund-agent",
        provider: "xai",
        model: "grok-4.3"
      })
    ).rejects.toThrow("Is the dashboard running and is the endpoint correct?");
  });
});
