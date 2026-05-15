import { NextResponse } from "next/server";
import { classifyCrash } from "@/lib/classification";
import { redactCrashPayload } from "@/lib/redaction";
import { classifyRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const redacted = redactCrashPayload(raw);
  const parsed = classifyRequestSchema.safeParse(redacted);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid classification request",
        message: "Send any PromptCrash event fields you want classified.",
        issues: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const classification = await classifyCrash(parsed.data);
  return NextResponse.json(classification);
}
