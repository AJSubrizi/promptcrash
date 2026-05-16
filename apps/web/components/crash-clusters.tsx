import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Severity } from "@/lib/schemas";

export type CrashCluster = {
  key: string;
  failureType: string;
  route: string;
  promptVersion: string;
  count: number;
  severity: Record<Severity, number>;
};

const severityOrder: Severity[] = ["critical", "high", "medium", "low"];

export function CrashClusters({ clusters }: { clusters: CrashCluster[] }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Crash clusters</CardTitle>
        <CardDescription>Grouped by failure type, route, and prompt version.</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 md:pt-5">
        {clusters.length === 0 ? (
          <p className="rounded-md border border-dashed bg-background/30 p-4 text-sm text-muted-foreground">
            Clusters appear after crashes are captured or seeded.
          </p>
        ) : (
          <div className="divide-y rounded-md border">
            {clusters.map((cluster) => (
              <div key={cluster.key} className="grid gap-3 px-3 py-3 md:grid-cols-[1fr_auto]">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{cluster.failureType}</Badge>
                    <span className="font-medium">{cluster.route}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {cluster.promptVersion}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {severityOrder.map((severity) =>
                      cluster.severity[severity] ? (
                        <Badge key={severity} tone={severity}>
                          {severity}: {cluster.severity[severity]}
                        </Badge>
                      ) : null
                    )}
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="font-mono text-2xl font-semibold">{cluster.count}</div>
                  <div className="font-mono text-[11px] uppercase text-muted-foreground">
                    occurrences
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
