import type { CrashCluster } from "@/components/crash-clusters";
import type { Severity } from "./schemas";

export type ClusterableCrash = {
  failureType: string;
  route: string;
  promptVersion: string | null;
  severity: string;
};

export function buildCrashClusters(crashes: ClusterableCrash[]): CrashCluster[] {
  const clusters = new Map<string, CrashCluster>();

  for (const crash of crashes) {
    const promptVersion = crash.promptVersion ?? "unversioned";
    const key = `${crash.failureType}:${crash.route}:${promptVersion}`;
    const existing = clusters.get(key) ?? {
      key,
      failureType: crash.failureType,
      route: crash.route,
      promptVersion,
      count: 0,
      severity: { low: 0, medium: 0, high: 0, critical: 0 }
    };

    existing.count += 1;
    if (isSeverity(crash.severity)) {
      existing.severity[crash.severity] += 1;
    }
    clusters.set(key, existing);
  }

  return [...clusters.values()].sort((a, b) => b.count - a.count || a.route.localeCompare(b.route));
}

function isSeverity(value: string): value is Severity {
  return value === "low" || value === "medium" || value === "high" || value === "critical";
}
