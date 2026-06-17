"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import {
  filtersToQuery,
  type DashboardFilters,
  type FilterOptions,
  type KpiCards,
  type OeeTrendPoint,
  type QualityDistributionBucket,
  type ShiftComparisonRow,
  type StationRankingRow,
} from "./types";

export function useKpis(filters: DashboardFilters) {
  return useQuery({
    queryKey: queryKeys.analytics.kpis(filters),
    queryFn: () => api.get<KpiCards>(`/api/v1/analytics/kpis?${filtersToQuery(filters)}`),
  });
}

export function useOeeTrend(filters: DashboardFilters, days: number = 21) {
  return useQuery({
    queryKey: [...queryKeys.analytics.oeeTrend(filters), days] as const,
    queryFn: () =>
      api.get<OeeTrendPoint[]>(
        `/api/v1/analytics/oee-trend?${filtersToQuery(filters)}&days=${days}`,
      ),
  });
}

export function useShiftComparison(filters: DashboardFilters) {
  return useQuery({
    queryKey: queryKeys.analytics.shiftComparison(filters),
    queryFn: () =>
      api.get<ShiftComparisonRow[]>(
        `/api/v1/analytics/shift-comparison?${filtersToQuery(filters)}`,
      ),
  });
}

export function useStationRanking(filters: DashboardFilters, limit: number = 10) {
  return useQuery({
    queryKey: [...queryKeys.analytics.stationRanking(filters), limit] as const,
    queryFn: () =>
      api.get<StationRankingRow[]>(
        `/api/v1/analytics/station-ranking?${filtersToQuery(filters)}&limit=${limit}`,
      ),
  });
}

export function useQualityDistribution(filters: DashboardFilters) {
  return useQuery({
    queryKey: queryKeys.analytics.qualityDistribution(filters),
    queryFn: () =>
      api.get<QualityDistributionBucket[]>(
        `/api/v1/analytics/quality-distribution?${filtersToQuery(filters)}`,
      ),
  });
}

export function useFilterOptions() {
  return useQuery({
    queryKey: ["analytics", "filter-options"] as const,
    queryFn: () => api.get<FilterOptions>(`/api/v1/analytics/filter-options`),
    staleTime: 5 * 60_000,
  });
}

export function useDashboardData(filters: DashboardFilters) {
  const kpis = useKpis(filters);
  const trend = useOeeTrend(filters);
  const shifts = useShiftComparison(filters);
  const stations = useStationRanking(filters);
  const quality = useQualityDistribution(filters);
  return { kpis, trend, shifts, stations, quality };
}
