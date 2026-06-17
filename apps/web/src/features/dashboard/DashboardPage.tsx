"use client";

import { useMemo, useState } from "react";
import { DashboardFiltersPanel } from "./DashboardFilters";
import { KpiCard, oeeTone } from "./KpiCard";
import { OeeTrendChart } from "./OeeTrendChart";
import { QualityDistributionChart } from "./QualityDistributionChart";
import { ShiftComparisonChart } from "./ShiftComparisonChart";
import { StationRankingChart } from "./StationRankingChart";
import { EMPTY_FILTERS, type DashboardFilters } from "./types";
import { useDashboardData, useFilterOptions } from "./useDashboardData";

const fmtNumber = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("tr-TR").format(n);
};

const fmtHours = (minutes: number | null | undefined): string => {
  if (minutes === null || minutes === undefined) return "—";
  const h = minutes / 60;
  return `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format(h)} sa`;
};

const fmtPct = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return "—";
  return `${n.toFixed(1)}%`;
};

export function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFilters>(EMPTY_FILTERS);
  const { kpis, trend, shifts, stations, quality } = useDashboardData(filters);
  const options = useFilterOptions();

  const kpiTone = useMemo(() => oeeTone(kpis.data?.avg_oee ?? null), [kpis.data]);

  return (
    <main className="container mx-auto py-8">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="font-mono text-sm text-muted-foreground">MAGNA · Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Üretim Performansı</h1>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>
            <span className="font-mono">{kpis.data?.record_count ?? 0}</span> kayıt
          </div>
          <div>
            <span className="text-oee-good">{kpis.data?.valid_count ?? 0}</span> /{" "}
            <span className="text-oee-mid">{kpis.data?.suspect_count ?? 0}</span> /{" "}
            <span className="text-oee-low">{kpis.data?.rejected_count ?? 0}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <DashboardFiltersPanel
          filters={filters}
          onChange={setFilters}
          options={options.data}
        />

        <div className="space-y-6">
          <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <KpiCard
              label="Ortalama OEE"
              value={fmtPct(kpis.data?.avg_oee)}
              hint="A·P·Q formülünden yeniden hesap"
              tone={kpiTone}
              loading={kpis.isLoading}
            />
            <KpiCard
              label="Toplam Üretim"
              value={fmtNumber(kpis.data?.total_production)}
              hint="adet"
              loading={kpis.isLoading}
            />
            <KpiCard
              label="Toplam Fire"
              value={fmtNumber(kpis.data?.total_scrap)}
              hint="adet"
              tone="low"
              loading={kpis.isLoading}
            />
            <KpiCard
              label="Toplam Duruş"
              value={fmtHours(kpis.data?.total_down_time_minutes)}
              hint="saat"
              loading={kpis.isLoading}
            />
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-4 text-card-foreground">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">OEE Trendi (21 gün)</h2>
              <OeeTrendChart data={trend.data ?? []} loading={trend.isLoading} />
            </div>
            <div className="rounded-lg border bg-card p-4 text-card-foreground">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">Vardiya Karşılaştırma</h2>
              <ShiftComparisonChart data={shifts.data ?? []} loading={shifts.isLoading} />
            </div>
            <div className="rounded-lg border bg-card p-4 text-card-foreground">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">İstasyon Sıralaması (Top 10)</h2>
              <StationRankingChart data={stations.data ?? []} loading={stations.isLoading} />
            </div>
            <div className="rounded-lg border bg-card p-4 text-card-foreground">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">Kalite Dağılımı</h2>
              <QualityDistributionChart data={quality.data ?? []} loading={quality.isLoading} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
