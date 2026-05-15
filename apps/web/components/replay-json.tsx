import { CodeBlock } from "@/components/code-block";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ReplayJson({ replay }: { replay: unknown }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Replay JSON</CardTitle>
        <CardDescription>
          Portable payload for reproducing the failure in a local harness.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CodeBlock value={replay} />
      </CardContent>
    </Card>
  );
}
