import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Problem } from "@shared/schema";

const STATUS_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

const chartConfig = {
  solved: {
    label: "Solved",
    color: "hsl(var(--chart-2))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface DashboardChartsProps {
  problems: Problem[];
}

export function DashboardCharts({ problems }: DashboardChartsProps) {
  const solvedCount = problems.filter((p) => p.status === "solved").length;
  const pendingCount = problems.filter((p) => p.status !== "solved").length;

  const statusData = [
    { name: "Solved", value: solvedCount, fill: "hsl(var(--chart-2))" },
    { name: "Pending", value: pendingCount, fill: "hsl(var(--chart-1))" },
  ].filter((d) => d.value > 0);

  const categoryCounts = problems.reduce<Record<string, number>>((acc, p) => {
    const cat = (p as Problem & { category?: string }).category || "other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryCounts)
    .map(([name, value]) => ({
      name: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value,
    }))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    .slice(0, 6);

  if (problems.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 min-w-0">
      {statusData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Problems by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[180px] w-full">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={statusData[index].fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {categoryData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="h-[180px] w-full [&_.recharts-cartesian-grid]:opacity-20"
            >
              <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  width={90}
                  tickLine={false}
                />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="hsl(var(--chart-1))" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
