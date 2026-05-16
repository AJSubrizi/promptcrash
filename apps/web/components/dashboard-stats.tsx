import { AlertTriangle, Bug, CheckCircle2, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Stats = {
  total: number;
  highSeverity: number;
  reproducible: number;
  commonFailureType: string;
};

export function DashboardStats({ stats }: { stats: Stats }) {
  const items = [
    { label: "Total crashes", value: stats.total, icon: Bug, detail: "stored locally" },
    { label: "High severity", value: stats.highSeverity, icon: Flame, detail: "high or critical" },
    {
      label: "Reproducible",
      value: stats.reproducible,
      icon: CheckCircle2,
      detail: "ready for replay"
    },
    {
      label: "Common failure",
      value: stats.commonFailureType || "none",
      icon: AlertTriangle,
      detail: "largest cluster"
    }
  ];

  return (
    <div className="grid gap-3 md:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
            <item.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="min-h-8 truncate font-mono text-2xl font-semibold tracking-normal">
              {item.value}
            </div>
            <div className="mt-2 border-t pt-3 font-mono text-[11px] uppercase text-muted-foreground">
              {item.detail}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
