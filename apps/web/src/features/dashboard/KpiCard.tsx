"use client";

import { cn } from "@/lib/utils";

type Tone = "good" | "mid" | "low" | "neutral";

function toneClass(t: Tone): string {
  switch (t) {
    case "good":
      return "text-oee-good";
    case "mid":
      return "text-oee-mid";
    case "low":
      return "text-oee-low";
    default:
      return "text-foreground";
  }
}

function oeeTone(v: number | null | undefined): Tone {
  if (v === null || v === undefined) return "neutral";
  if (v >= 85) return "good";
  if (v >= 60) return "mid";
  return "low";
}

export interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
  loading?: boolean;
}

export function KpiCard({ label, value, hint, tone, loading }: KpiCardProps) {
  const t = tone ?? "neutral";
  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn("mt-2 text-2xl font-semibold tabular-nums", toneClass(t))}>
        {loading ? "…" : value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export { oeeTone };
