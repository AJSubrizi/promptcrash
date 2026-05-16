import { seedDemoCrashesAction } from "@/app/actions";
import { CrashClusters } from "@/components/crash-clusters";
import { CrashList, type CrashListItem } from "@/components/crash-list";
import { DashboardStats } from "@/components/dashboard-stats";
import { Badge } from "@/components/ui/badge";
import { buildCrashClusters } from "@/lib/clustering";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const pipeline = [
  ["01", "Capture", "Record failed prompts, model output, route, and trace context."],
  ["02", "Redact", "Strip secrets and sensitive values before local persistence."],
  ["03", "Replay", "Export a portable JSON payload for deterministic reproduction."],
  ["04", "Test", "Generate a Vitest regression that locks the failure down."]
] as const;

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
    <div className="space-y-6">
      <section className="rounded-lg border bg-card/80 p-4 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.04)] md:p-5">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1.4fr] lg:items-end">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="low">PromptCrash</Badge>
              <span className="font-mono text-xs text-muted-foreground">
                local-first incident console
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-normal md:text-4xl">
                Turn bad LLM outputs into reproducible bugs.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                Capture failed interactions, redact secrets before storage, classify failure modes,
                export replay JSON, and generate regression tests without requiring an LLM call.
              </p>
            </div>
          </div>

          <ol className="grid gap-2 sm:grid-cols-2">
            {pipeline.map(([step, title, description]) => (
              <li key={step} className="rounded-md border bg-background/35 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-primary">{step}</span>
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-sm font-medium">{title}</span>
                </div>
                <p className="text-xs leading-5 text-muted-foreground">{description}</p>
              </li>
            ))}
          </ol>
        </div>
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
