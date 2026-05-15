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
    { label: "Total crashes", value: stats.total, icon: Bug },
    { label: "High severity", value: stats.highSeverity, icon: Flame },
    { label: "Reproducible", value: stats.reproducible, icon: CheckCircle2 },
    { label: "Common failure", value: stats.commonFailureType || "none", icon: AlertTriangle }
  ];

  return (
    <div className="grid gap-3 md:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-normal">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
