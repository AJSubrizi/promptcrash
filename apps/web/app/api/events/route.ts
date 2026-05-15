import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { redactCrashPayload } from "@/lib/redaction";
import { crashPayloadSchema } from "@/lib/schemas";
import { toCrashCreateData, withClassificationDefaults } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const redacted = redactCrashPayload(raw);
  const parsed = crashPayloadSchema.safeParse(redacted);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid PromptCrash event",
        message: "Check the `issues` field for invalid or missing fields.",
        issues: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const payload = withClassificationDefaults(parsed.data, redacted);
  const crash = await db.crash.create({
    data: toCrashCreateData(payload)
  });

  return NextResponse.json({ id: crash.id }, { status: 201 });
}
