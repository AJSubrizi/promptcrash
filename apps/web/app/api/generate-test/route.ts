import { NextResponse } from "next/server";
import { generateTestRequestSchema } from "@/lib/schemas";
import { redactCrashPayload } from "@/lib/redaction";
import { generateVitest } from "@/lib/test-generation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const redacted = redactCrashPayload(raw);
  const parsed = generateTestRequestSchema.safeParse(redacted);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid test-generation request",
        message: "Send a valid PromptCrash event payload to generate a regression test.",
        issues: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const generated = await generateVitest(parsed.data);
  return NextResponse.json(generated);
}
