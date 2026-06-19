"use client";

import { AlertTriangle, Clock, Gauge, Package } from "lucide-react";
import { format, subDays } from "date-fns";
import { KpiCard, oeeTone, type KpiTrend, type TrendDirection } from "./KpiCard";
import { useKpis, useKpisPeriod } from "./useDashboardData";
import { useT } from "@/lib/i18n";

const fmtPct = (v: number | null | undefined): string =>
  v === null || v === undefined ? "—" : `${v.toFixed(1)}%`;

const fmtNumber = (v: number | null | undefined): string =>
  v === null || v === undefined ? "—" : v.toLocaleString("tr-TR");

const fmtHours = (minutes: number | null | undefined): string => {
  if (minutes === null || minutes === undefined) return "—";
  return `${(minutes / 60).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} sa`;
};

function pctChange(
  current: number | null | undefined,
  previous: number | null | undefined,
): KpiTrend | null {
  if (current === null || current === undefined) return null;
  if (previous === null || previous === undefined || previous === 0) return null;
  const change = ((current - previous) / previous) * 100;
  const direction: TrendDirection =
    Math.abs(change) < 0.1 ? "flat" : change > 0 ? "up" : "down";
  return { value: change, direction };
}

export function KpiCardGrid() {
  const t = useT();
  const kpis = useKpis();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const last7Str = format(subDays(today, 7), "yyyy-MM-dd");
  const prev7Str = format(subDays(today, 14), "yyyy-MM-dd");
  const prev7EndStr = format(subDays(today, 7), "yyyy-MM-dd");

  const kpisCurrent = useKpisPeriod(last7Str, todayStr);
  const kpisPrevious = useKpisPeriod(prev7Str, prev7EndStr);

  const oeeTrend = pctChange(kpisCurrent.data?.avg_oee, kpisPrevious.data?.avg_oee);
  const productionTrend = pctChange(
    kpisCurrent.data?.total_production,
    kpisPrevious.data?.total_production,
  );
  const scrapTrend = pctChange(kpisCurrent.data?.total_scrap, kpisPrevious.data?.total_scrap);
  const downtimeTrend = pctChange(
    kpisCurrent.data?.total_down_time_minutes,
    kpisPrevious.data?.total_down_time_minutes,
  );

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label={t("dashboard.kpiCardGrid.avgOee")}
        value={fmtPct(kpis.data?.avg_oee)}
        icon={<Gauge className="h-4 w-4" />}
        tone={oeeTone(kpis.data?.avg_oee)}
        trend={oeeTrend}
        hint={t("dashboard.kpiCardGrid.avgOeeHint")}
        loading={kpis.isLoading}
      />
      <KpiCard
        label={t("dashboard.kpiCardGrid.totalProduction")}
        value={fmtNumber(kpis.data?.total_production)}
        icon={<Package className="h-4 w-4" />}
        trend={productionTrend}
        hint={t("dashboard.kpiCardGrid.unitHint")}
        loading={kpis.isLoading}
      />
      <KpiCard
        label={t("dashboard.kpiCardGrid.totalScrap")}
        value={fmtNumber(kpis.data?.total_scrap)}
        icon={<AlertTriangle className="h-4 w-4" />}
        tone="low"
        trend={scrapTrend}
        inverted
        hint={t("dashboard.kpiCardGrid.unitHint")}
        loading={kpis.isLoading}
      />
      <KpiCard
        label={t("dashboard.kpiCardGrid.totalDowntime")}
        value={fmtHours(kpis.data?.total_down_time_minutes)}
        icon={<Clock className="h-4 w-4" />}
        tone="low"
        trend={downtimeTrend}
        inverted
        hint={t("dashboard.kpiCardGrid.hourHint")}
        loading={kpis.isLoading}
      />
    </section>
  );
}
