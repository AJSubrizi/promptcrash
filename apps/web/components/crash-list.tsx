import Link from "next/link";
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
      <CardHeader>
        <CardTitle>Recent crashes</CardTitle>
        <CardDescription>Captured failed LLM interactions, newest first.</CardDescription>
      </CardHeader>
      <CardContent>
        {crashes.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center">
            <div className="text-base font-medium">No crashes yet</div>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Seed a polished local dataset, send a crash directly to the API, or wire the TypeScript SDK into an app.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <form action={seedDemoAction}>
                <Button type="submit">Seed demo crashes</Button>
              </form>
              <Button asChild variant="outline">
                <Link href="/quickstart#send-your-first-crash">Send your first crash</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/quickstart#sdk-quickstart">Read the SDK quickstart</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {crashes.map((crash) => (
              <Link key={crash.id} href={`/crashes/${crash.id}`} className="block py-4 hover:bg-muted/50">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{crash.route}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {crash.projectName} · {crash.model} · {new Date(crash.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{crash.failureType}</Badge>
                    <Badge tone={crash.severity}>{crash.severity}</Badge>
                    {crash.reproducible ? <Badge tone="low">reproducible</Badge> : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
