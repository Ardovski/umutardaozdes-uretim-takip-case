"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ShiftComparisonRow } from "./types";

export interface ShiftComparisonChartProps {
  data: ShiftComparisonRow[];
  loading?: boolean;
}

const SHIFT_LABELS: Record<number, string> = { 1: "Sabah", 2: "Öğle", 3: "Gece" };
const SHIFT_COLORS: Record<number, string> = {
  1: "hsl(var(--shift-1, 217 91% 60%))",
  2: "hsl(var(--shift-2, 38 92% 50%))",
  3: "hsl(var(--shift-3, 271 81% 65%))",
};

export function ShiftComparisonChart({ data, loading }: ShiftComparisonChartProps) {
  if (loading) {
    return <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">Yükleniyor…</div>;
  }
  if (data.length === 0) {
    return <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">Veri yok.</div>;
  }
  const shaped = data.map((r) => ({
    label: SHIFT_LABELS[r.shift] ?? `Vardiya ${r.shift}`,
    shift: r.shift,
    avg_oee: r.avg_oee ?? 0,
    total_production: r.total_production,
    total_scrap: r.total_scrap,
  }));
  return (
    <ResponsiveContainer width="100%" height={288}>
      <BarChart data={shaped} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis yAxisId="oee" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis yAxisId="qty" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--card-foreground))",
          }}
        />
        <Legend />
        <Bar yAxisId="oee" dataKey="avg_oee" name="OEE %" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
        <Bar yAxisId="qty" dataKey="total_production" name="Üretim" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
        <Bar yAxisId="qty" dataKey="total_scrap" name="Fire" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export { SHIFT_LABELS, SHIFT_COLORS };
