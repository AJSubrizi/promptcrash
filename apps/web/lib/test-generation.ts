import { generateText } from "ai";
import { xai } from "@ai-sdk/xai";
import type { CrashPayload } from "./schemas";

export type TestGenerationResult = {
  code: string;
  source: "fallback" | "xai";
};

function stringify(value: unknown): string {
  return JSON.stringify(value ?? null, null, 2);
}

export function generateDeterministicVitest(crash: CrashPayload & { id?: string }): TestGenerationResult {
  const name = `${crash.route} ${crash.failureType} regression`.replace(/`/g, "'");

  return {
    source: "fallback",
    code: `import { describe, expect, it } from "vitest";

const replay = ${stringify(crash)};

describe("PromptCrash regression: ${name}", () => {
  it("does not repeat the captured bad output", async () => {
    const actual = await runPromptCrashReplay(replay);
    const badOutput = replay.output === undefined ? undefined : JSON.stringify(replay.output);

    expect(actual).not.toEqual(replay.output);
    if (badOutput) {
      expect(JSON.stringify(actual)).not.toContain(badOutput.slice(0, 80));
    }
  });

  it("keeps the expected behavior visible for reviewers", () => {
    expect(replay.expectedBehavior).toContain(${JSON.stringify(crash.expectedBehavior?.slice(0, 40) ?? "")});
  });
});

async function runPromptCrashReplay(crash: typeof replay): Promise<unknown> {
  throw new Error(
    [
      "Connect runPromptCrashReplay to your app's LLM wrapper.",
      "Use crash.systemPrompt, crash.userInput, crash.retrievedContext, and crash.toolCalls as fixtures.",
      "Do not call a production provider from CI; use a stub, local model, or recorded response."
    ].join(" ")
  );
}`
  };
}

export async function generateVitest(crash: CrashPayload & { id?: string }): Promise<TestGenerationResult> {
  if (!process.env.XAI_API_KEY) {
    return generateDeterministicVitest(crash);
  }

  try {
    const result = await generateText({
      model: xai(process.env.PROMPTCRASH_XAI_MODEL ?? "grok-3"),
      prompt: [
        "Generate a concise Vitest regression test for this captured failed LLM interaction.",
        "The test should be deterministic, self-contained, and should not call a real LLM provider.",
        "Return only TypeScript test code.",
        JSON.stringify(crash, null, 2)
      ].join("\n\n")
    });

    return { code: result.text.trim(), source: "xai" };
  } catch {
    return generateDeterministicVitest(crash);
  }
}

export function toReplayJson(crash: CrashPayload & { id?: string; createdAt?: string | Date }) {
  return {
    schema: "promptcrash.replay.v1",
    id: crash.id,
    createdAt: crash.createdAt,
    projectName: crash.projectName,
    environment: crash.environment,
    route: crash.route,
    provider: crash.provider,
    model: crash.model,
    promptVersion: crash.promptVersion,
    systemPrompt: crash.systemPrompt,
    userInput: crash.userInput,
    retrievedContext: crash.retrievedContext,
    toolCalls: crash.toolCalls,
    output: crash.output,
    expectedBehavior: crash.expectedBehavior,
    failureType: crash.failureType,
    severity: crash.severity,
    reproducible: crash.reproducible,
    metadata: crash.metadata
  };
}
