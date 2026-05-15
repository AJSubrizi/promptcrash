import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CrashDetail, type CrashDetailData } from "@/components/crash-detail";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { crashToPayload } from "@/lib/storage";
import { generateVitest, toReplayJson } from "@/lib/test-generation";

export const dynamic = "force-dynamic";

export default async function CrashPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const crash = await db.crash.findUnique({ where: { id } });

  if (!crash) {
    notFound();
  }

  const payload = crashToPayload(crash);
  const replay = toReplayJson(payload);
  const generatedTest = await generateVitest(payload);
  const detail: CrashDetailData = {
    ...payload,
    promptVersion: payload.promptVersion,
    systemPrompt: payload.systemPrompt,
    expectedBehavior: payload.expectedBehavior
  };

  return (
    <div className="space-y-5">
      <Button asChild variant="ghost" className="px-0">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to crashes
        </Link>
      </Button>
      <CrashDetail crash={detail} replay={replay} generatedTest={generatedTest} />
    </div>
  );
}
