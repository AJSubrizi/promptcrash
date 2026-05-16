import { z } from "zod";

export const environmentSchema = z.enum(["development", "staging", "production"]);
export const providerSchema = z.enum(["xai", "openai", "anthropic", "local", "other"]);
export const failureTypeSchema = z.enum([
  "hallucination",
  "tool_misuse",
  "schema_violation",
  "json_mode_error",
  "bad_refusal",
  "unsafe_output",
  "pii_leakage",
  "latency",
  "cost_spike",
  "retrieval_failure",
  "context_overflow",
  "rate_limit",
  "provider_error",
  "other"
]);
export const severitySchema = z.enum(["low", "medium", "high", "critical"]);

export const jsonValueSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(jsonValueSchema)
  ])
);

export const toolCallSchema = z.object({
  name: z.string().min(1),
  input: jsonValueSchema.optional(),
  output: jsonValueSchema.optional(),
  error: z.string().optional(),
  durationMs: z.number().nonnegative().optional()
});

export const crashPayloadSchema = z.object({
  projectName: z.string().min(1),
  environment: environmentSchema,
  route: z.string().min(1),
  provider: providerSchema,
  model: z.string().min(1),
  promptVersion: z.string().optional(),
  systemPrompt: z.string().optional(),
  userInput: jsonValueSchema.optional(),
  retrievedContext: jsonValueSchema.optional(),
  toolCalls: z.array(toolCallSchema).optional(),
  output: jsonValueSchema.optional(),
  expectedBehavior: z.string().optional(),
  failureType: failureTypeSchema.default("other"),
  severity: severitySchema.default("medium"),
  reproducible: z.boolean().default(false),
  metadata: z.record(jsonValueSchema).optional()
});

export const classifyRequestSchema = crashPayloadSchema.partial().extend({
  output: jsonValueSchema.optional(),
  expectedBehavior: z.string().optional()
});

export const generateTestRequestSchema = crashPayloadSchema.extend({
  id: z.string().optional(),
  createdAt: z.string().optional()
});

export type CrashPayload = z.infer<typeof crashPayloadSchema>;
export type FailureType = z.infer<typeof failureTypeSchema>;
export type Severity = z.infer<typeof severitySchema>;
