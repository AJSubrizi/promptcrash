export type PromptCrashEnvironment = "development" | "staging" | "production";

export type PromptCrashProvider = "xai" | "openai" | "anthropic" | "local" | "other";

export type FailureType =
  | "hallucination"
  | "tool_misuse"
  | "schema_violation"
  | "json_mode_error"
  | "bad_refusal"
  | "unsafe_output"
  | "pii_leakage"
  | "latency"
  | "cost_spike"
  | "retrieval_failure"
  | "context_overflow"
  | "rate_limit"
  | "provider_error"
  | "other";

export type Severity = "low" | "medium" | "high" | "critical";

export type ToolCall = {
  name: string;
  input?: unknown;
  output?: unknown;
  error?: string;
  durationMs?: number;
};

export type PromptCrashConfig = {
  endpoint: string;
  projectName: string;
  environment: PromptCrashEnvironment;
  headers?: Record<string, string>;
  redactionPatterns?: Array<{ name: string; pattern: RegExp | string }>;
  fetch?: typeof fetch;
};

export type CaptureFailureInput = {
  route: string;
  provider: PromptCrashProvider;
  model: string;
  promptVersion?: string;
  systemPrompt?: string;
  userInput?: unknown;
  retrievedContext?: unknown;
  toolCalls?: ToolCall[];
  output?: unknown;
  expectedBehavior?: string;
  failureType?: FailureType;
  severity?: Severity;
  reproducible?: boolean;
  metadata?: Record<string, unknown>;
};

export type PromptCrashPayload = CaptureFailureInput & {
  projectName: string;
  environment: PromptCrashEnvironment;
};

export type CaptureFailureResult = {
  id: string;
};
