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
import type { QualityDistributionBucket } from "./types";

export interface QualityDistributionChartProps {
  data: QualityDistributionBucket[];
  loading?: boolean;
}

export function QualityDistributionChart({ data, loading }: QualityDistributionChartProps) {
  if (loading) {
    return <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">Yükleniyor…</div>;
  }
  if (data.length === 0) {
    return <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">Veri yok.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={288}>
      <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="bucket_label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--card-foreground))",
          }}
        />
        <Bar dataKey="record_count" name="Kayıt" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="total_scrap" name="Toplam Fire" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
