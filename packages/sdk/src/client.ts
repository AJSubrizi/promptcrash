import { buildPatterns, redactValue } from "./redact";
import type { CaptureFailureInput, CaptureFailureResult, PromptCrashConfig, PromptCrashPayload } from "./types";

export class PromptCrash {
  private readonly config: PromptCrashConfig;

  constructor(config: PromptCrashConfig) {
    this.config = config;
  }

  async captureFailure(input: CaptureFailureInput): Promise<CaptureFailureResult> {
    const patterns = buildPatterns(this.config.redactionPatterns);
    const payload: PromptCrashPayload = redactValue({
      ...input,
      projectName: this.config.projectName,
      environment: this.config.environment
    }, patterns);

    const fetcher = this.config.fetch ?? fetch;
    let response: Response;

    try {
      response = await fetcher(this.config.endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...this.config.headers
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      throw new Error(
        `PromptCrash capture failed: could not reach ${this.config.endpoint}. Is the dashboard running and is the endpoint correct?`,
        { cause: error }
      );
    }

    if (!response.ok) {
      const message = await response.text().catch(() => response.statusText);
      throw new Error(
        `PromptCrash capture failed: ${response.status} ${response.statusText}. ${message}`.trim()
      );
    }

    return response.json() as Promise<CaptureFailureResult>;
  }
}
