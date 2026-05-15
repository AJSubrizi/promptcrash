import { buildPatterns, redactValue } from "@promptcrash/sdk";

export function redactCrashPayload<T>(payload: T): T {
  return redactValue(payload, buildPatterns());
}
