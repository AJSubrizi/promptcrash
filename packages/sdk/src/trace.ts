import type { CaptureFailureInput, ToolCall } from "./types";

export function createTrace(input: CaptureFailureInput): CaptureFailureInput {
  return {
    ...input,
    toolCalls: input.toolCalls?.map(normalizeToolCall)
  };
}

function normalizeToolCall(call: ToolCall): ToolCall {
  return {
    name: call.name,
    input: call.input,
    output: call.output,
    error: call.error,
    durationMs: call.durationMs
  };
}
