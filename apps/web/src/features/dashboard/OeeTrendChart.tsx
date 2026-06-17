"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { OeeTrendPoint } from "./types";

export interface OeeTrendChartProps {
  data: OeeTrendPoint[];
  loading?: boolean;
}

export function OeeTrendChart({ data, loading }: OeeTrendChartProps) {
  if (loading) {
    return <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">Yükleniyor…</div>;
  }
  if (data.length === 0) {
    return <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">Veri yok.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={288}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="prod_date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--card-foreground))",
          }}
        />
        <Line
          type="monotone"
          dataKey="avg_oee"
          name="OEE"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
