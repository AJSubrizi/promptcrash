import { seedDemoCrashesAction } from "@/app/actions";
import { CrashClusters } from "@/components/crash-clusters";
import { CrashList, type CrashListItem } from "@/components/crash-list";
import { DashboardStats } from "@/components/dashboard-stats";
import { buildCrashClusters } from "@/lib/clustering";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [crashes, allCrashes, total, highSeverity, reproducible, grouped] = await Promise.all([
    db.crash.findMany({
      orderBy: { createdAt: "desc" },
      take: 10
    }),
    db.crash.findMany({
      select: {
        failureType: true,
        route: true,
        promptVersion: true,
        severity: true
      },
      orderBy: { createdAt: "desc" },
      take: 500
    }),
    db.crash.count(),
    db.crash.count({ where: { severity: { in: ["high", "critical"] } } }),
    db.crash.count({ where: { reproducible: true } }),
    db.crash.groupBy({
      by: ["failureType"],
      _count: { failureType: true },
      orderBy: { _count: { failureType: "desc" } },
      take: 1
    })
  ]);

  const items: CrashListItem[] = crashes.map((crash) => ({
    id: crash.id,
    projectName: crash.projectName,
    route: crash.route,
    model: crash.model,
    failureType: crash.failureType,
    severity: crash.severity as CrashListItem["severity"],
    reproducible: crash.reproducible,
    createdAt: crash.createdAt.toISOString()
  }));

  const clusters = buildCrashClusters(allCrashes);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="text-sm font-medium uppercase tracking-wide text-primary">PromptCrash</div>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-normal md:text-5xl">
          Turn bad LLM outputs into reproducible bugs.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Capture failed interactions, redact secrets before storage, classify failure modes, export
          replay JSON, and generate regression tests without requiring an LLM call.
        </p>
      </section>

      <DashboardStats
        stats={{
          total,
          highSeverity,
          reproducible,
          commonFailureType: grouped[0]?.failureType ?? "none"
        }}
      />
      <CrashClusters clusters={clusters} />
      <CrashList crashes={items} seedDemoAction={seedDemoCrashesAction} />
    </div>
  );
}
