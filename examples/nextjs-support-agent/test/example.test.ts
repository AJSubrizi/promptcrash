import { describe, expect, it } from "vitest";

describe("nextjs-support-agent example", () => {
  it("documents the PromptCrash endpoint used by the sample app", () => {
    expect(process.env.PROMPTCRASH_ENDPOINT ?? "http://localhost:3000/api/events").toContain(
      "/api/events"
    );
  });
});
