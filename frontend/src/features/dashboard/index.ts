export { DashboardPage } from "./pages/DashboardPage";
export { DashboardHeader } from "./components/DashboardHeader";
export { KpiCardGrid } from "./components/KpiCardGrid";
export { OeeTrendChart } from "./components/OeeTrendChart";
export { ShiftComparisonChart } from "./components/ShiftComparisonChart";
export { StationRankingChart } from "./components/StationRankingChart";
export { QualityDistributionChart } from "./components/QualityDistributionChart";
export { RecentRecordsTable } from "./components/RecentRecordsTable";
export { TopStationsTable } from "./components/TopStationsTable";
export { ProblemShiftsTable } from "./components/ProblemShiftsTable";
export {
  useKpis,
  useKpisPeriod,
  useOeeTrend,
  useShiftComparison,
  useStationRanking,
  useQualityDistribution,
  useRecentRecords,
  useTopStations,
  useProblemShifts,
} from "./hooks/useDashboardData";
export type {
  KpiCards,
  OeeTrendPoint,
  ShiftComparisonRow,
  StationRankingRow,
  QualityDistributionBucket,
  RecentRecordRow,
  TopStationRow,
  ProblemShiftRow,
} from "./types";
