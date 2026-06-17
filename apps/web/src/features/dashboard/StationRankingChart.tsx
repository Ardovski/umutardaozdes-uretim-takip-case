"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StationRankingRow } from "./types";

export interface StationRankingChartProps {
  data: StationRankingRow[];
  loading?: boolean;
}

export function StationRankingChart({ data, loading }: StationRankingChartProps) {
  if (loading) {
    return <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">Yükleniyor…</div>;
  }
  if (data.length === 0) {
    return <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">Veri yok.</div>;
  }
  const shaped = data
    .slice()
    .sort((a, b) => (a.avg_oee ?? 0) - (b.avg_oee ?? 0))
    .map((r) => ({
      station_name: r.station_name,
      avg_oee: r.avg_oee ?? 0,
      total_production: r.total_production,
    }));
  return (
    <ResponsiveContainer width="100%" height={Math.max(288, shaped.length * 36)}>
      <BarChart layout="vertical" data={shaped} margin={{ top: 8, right: 16, bottom: 8, left: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis
          type="category"
          dataKey="station_name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          width={110}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--card-foreground))",
          }}
        />
        <Bar dataKey="avg_oee" name="OEE %" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
