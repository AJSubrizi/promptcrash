import Link from "next/link";
import { ArrowRight, Database, FileCode2, PlugZap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Severity } from "@/lib/schemas";

export type CrashListItem = {
  id: string;
  projectName: string;
  route: string;
  model: string;
  failureType: string;
  severity: Severity;
  reproducible: boolean;
  createdAt: string;
};

export function CrashList({
  crashes,
  seedDemoAction
}: {
  crashes: CrashListItem[];
  seedDemoAction: () => Promise<void>;
}) {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <CardTitle>Recent crashes</CardTitle>
            <CardDescription>Captured failed LLM interactions, newest first.</CardDescription>
          </div>
          {crashes.length > 0 ? (
            <span className="font-mono text-xs text-muted-foreground">
              {crashes.length} visible
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="pt-4 md:pt-5">
        {crashes.length === 0 ? (
          <div className="rounded-md border border-dashed bg-background/30 p-5 text-center md:p-8">
            <div className="text-base font-medium">No crashes captured</div>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Seed a polished local dataset, send a crash directly to the API, or wire the
              TypeScript SDK into an app.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <form action={seedDemoAction}>
                <Button type="submit">
                  <Database className="h-4 w-4" />
                  Seed demo crashes
                </Button>
              </form>
              <Button asChild variant="outline">
                <Link href="/quickstart#send-your-first-crash">
                  <PlugZap className="h-4 w-4" />
                  Send first crash
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/quickstart#sdk-quickstart">
                  <FileCode2 className="h-4 w-4" />
                  SDK quickstart
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y rounded-md border">
            {crashes.map((crash) => (
              <Link
                key={crash.id}
                href={`/crashes/${crash.id}`}
                className="group block px-3 py-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{crash.route}</div>
                    <div className="mt-1 truncate font-mono text-xs text-muted-foreground">
                      {crash.projectName} / {crash.model} /{" "}
                      {new Date(crash.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Badge>{crash.failureType}</Badge>
                    <Badge tone={crash.severity}>{crash.severity}</Badge>
                    {crash.reproducible ? <Badge tone="low">reproducible</Badge> : null}
                  </div>
                  <ArrowRight className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary md:block" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
