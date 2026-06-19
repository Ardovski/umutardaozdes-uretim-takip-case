"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useT } from "@/lib/i18n";
import { DashboardHeader } from "../components/DashboardHeader";
import { KpiCardGrid } from "../components/KpiCardGrid";
import { OeeTrendChart } from "../components/OeeTrendChart";
import { ProblemShiftsTable } from "../components/ProblemShiftsTable";
import { QualityDistributionChart } from "../components/QualityDistributionChart";
import { RecentRecordsTable } from "../components/RecentRecordsTable";
import { ShiftComparisonChart } from "../components/ShiftComparisonChart";
import { StationRankingChart } from "../components/StationRankingChart";
import { TopStationsTable } from "../components/TopStationsTable";

export function DashboardPage() {
  // Tüm dashboard (KPI + grafikler) aktif batch'e bakmaz; aşağıdaki 3 tablo da
  // aynı veri kümesini göstermeli. batchId=null → tüm kayıtlar (tutarlı görünüm).
  const batchId: number | null = null;
  const [tab, setTab] = useState("recent");
  const t = useT();

  return (
    <main className="container mx-auto space-y-6 py-8">
      <DashboardHeader />

      <KpiCardGrid />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <OeeTrendChart />
        <ShiftComparisonChart />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StationRankingChart />
        <QualityDistributionChart />
      </section>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="recent">{t("dashboard.dashboardPage.recentRecords")}</TabsTrigger>
          <TabsTrigger value="top">{t("dashboard.dashboardPage.topStations")}</TabsTrigger>
          <TabsTrigger value="problems">{t("dashboard.dashboardPage.problemShifts")}</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <RecentRecordsTable batchId={batchId} />
        </TabsContent>
        <TabsContent value="top">
          <TopStationsTable batchId={batchId} />
        </TabsContent>
        <TabsContent value="problems">
          <ProblemShiftsTable batchId={batchId} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
