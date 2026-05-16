import { generateObject } from "ai";
import { xai } from "@ai-sdk/xai";
import { z } from "zod";
import {
  failureTypeSchema,
  severitySchema,
  type CrashPayload,
  type FailureType,
  type Severity
} from "./schemas";

export type ClassificationResult = {
  failureType: FailureType;
  severity: Severity;
  source: "fallback" | "xai";
};

const classificationSchema = z.object({
  failureType: failureTypeSchema,
  severity: severitySchema
});

export function deterministicClassify(input: Partial<CrashPayload>): ClassificationResult {
  const text = [
    input.failureType,
    input.expectedBehavior,
    input.output,
    input.metadata,
    input.toolCalls
  ]
    .map((value) => JSON.stringify(value ?? ""))
    .join(" ")
    .toLowerCase();

  let failureType: FailureType = input.failureType ?? "other";
  if (text.match(/context window|context length|context overflow|max tokens|token limit/))
    failureType = "context_overflow";
  else if (text.match(/json mode|structured output|invalid json|malformed json/))
    failureType = "json_mode_error";
  else if (text.match(/pii leak|leaked pii|exposed email|exposed phone|exposed secret/))
    failureType = "pii_leakage";
  else if (text.match(/rate.?limit|429|quota/)) failureType = "rate_limit";
  else if (text.match(/timeout|latency|slow|took \d/)) failureType = "latency";
  else if (text.match(/cost|token spike|expensive/)) failureType = "cost_spike";
  else if (text.match(/schema|json|zod|invalid format|parse/)) failureType = "schema_violation";
  else if (text.match(/tool|function|called|order history|refund/)) failureType = "tool_misuse";
  else if (text.match(/retrieval|context|rag|missing source/)) failureType = "retrieval_failure";
  else if (text.match(/unsafe|pii|secret|policy violation|harmful/)) failureType = "unsafe_output";
  else if (text.match(/refus|cannot help|can't help/)) failureType = "bad_refusal";
  else if (text.match(/hallucinat|fabricat|made up|not in context/)) failureType = "hallucination";
  else if (text.match(/provider|api error|5\d\d|unavailable/)) failureType = "provider_error";

  let severity: Severity = input.severity ?? "medium";
  if (text.match(/critical|data leak|production outage|charged|deleted|security/))
    severity = "critical";
  else if (text.match(/high|refund|unsafe|schema|customer impact/)) severity = "high";
  else if (text.match(/low|minor|cosmetic/)) severity = "low";

  return { failureType, severity, source: "fallback" };
}

export async function classifyCrash(input: Partial<CrashPayload>): Promise<ClassificationResult> {
  if (!process.env.XAI_API_KEY) {
    return deterministicClassify(input);
  }

  try {
    const result = await generateObject({
      model: xai(process.env.PROMPTCRASH_XAI_MODEL ?? "grok-4.3"),
      schema: classificationSchema,
      prompt: [
        "Classify this failed LLM interaction for a crash-reporting tool.",
        "Return only a failureType and severity.",
        JSON.stringify(input, null, 2)
      ].join("\n\n")
    });

    return { ...result.object, source: "xai" };
  } catch {
    return deterministicClassify(input);
  }
}
