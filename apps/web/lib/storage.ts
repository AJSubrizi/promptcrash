import type { Crash } from "@prisma/client";
import { deterministicClassify } from "./classification";
import type { CrashPayload } from "./schemas";

export function withClassificationDefaults(
  payload: CrashPayload,
  originalInput: unknown
): CrashPayload {
  const input = isRecord(originalInput) ? originalInput : {};
  const needsFailureType = typeof input.failureType !== "string";
  const needsSeverity = typeof input.severity !== "string";

  if (!needsFailureType && !needsSeverity) {
    return payload;
  }

  const fallback = deterministicClassify(payload);

  return {
    ...payload,
    failureType: needsFailureType ? fallback.failureType : payload.failureType,
    severity: needsSeverity ? fallback.severity : payload.severity
  };
}

export function toCrashCreateData(payload: CrashPayload) {
  return {
    projectName: payload.projectName,
    environment: payload.environment,
    route: payload.route,
    provider: payload.provider,
    model: payload.model,
    promptVersion: payload.promptVersion,
    systemPrompt: payload.systemPrompt,
    userInput: serializeJson(payload.userInput),
    retrievedContext: serializeJson(payload.retrievedContext),
    toolCalls: serializeJson(payload.toolCalls),
    output: serializeJson(payload.output),
    expectedBehavior: payload.expectedBehavior,
    failureType: payload.failureType,
    severity: payload.severity,
    reproducible: payload.reproducible,
    metadata: serializeJson(payload.metadata)
  };
}

export function crashToPayload(crash: Crash): CrashPayload & { id: string; createdAt: string } {
  return {
    id: crash.id,
    projectName: crash.projectName,
    environment: crash.environment as CrashPayload["environment"],
    route: crash.route,
    provider: crash.provider as CrashPayload["provider"],
    model: crash.model,
    promptVersion: crash.promptVersion ?? undefined,
    systemPrompt: crash.systemPrompt ?? undefined,
    userInput: parseJson(crash.userInput),
    retrievedContext: parseJson(crash.retrievedContext),
    toolCalls: parseJson(crash.toolCalls) as CrashPayload["toolCalls"],
    output: parseJson(crash.output),
    expectedBehavior: crash.expectedBehavior ?? undefined,
    failureType: crash.failureType as CrashPayload["failureType"],
    severity: crash.severity as CrashPayload["severity"],
    reproducible: crash.reproducible,
    metadata: parseJson(crash.metadata) as Record<string, unknown> | undefined,
    createdAt: crash.createdAt.toISOString()
  };
}

export function serializeJson(value: unknown): string | undefined {
  return value === undefined ? undefined : JSON.stringify(value);
}

export function parseJson(value: string | null): unknown {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
