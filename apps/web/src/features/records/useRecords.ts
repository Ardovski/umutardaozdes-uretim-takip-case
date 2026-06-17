"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { env } from "@/lib/env";
import { queryKeys } from "@/lib/query-keys";
import {
  filterStateToQuery,
  useRecordsFilterStore,
  type RecordsFilterState,
} from "@/stores/filters";
import type { FilterOptions, PaginatedRecords } from "./types";

export function useRecords(page: number, size: number, sort?: string) {
  const filter = useRecordsFilterStore();
  const q = filterStateToQuery(filter);
  const sortParam = sort ? `&sort=${encodeURIComponent(sort)}` : "";
  return useQuery({
    queryKey: [...queryKeys.records.list(filter), page, size, sort ?? null] as const,
    queryFn: () =>
      api.get<PaginatedRecords>(`/api/v1/records/list?${q}${sortParam}&page=${page}&size=${size}`),
    placeholderData: (prev) => prev,
  });
}

export function useFilterOptions() {
  return useQuery({
    queryKey: ["records", "filter-options"] as const,
    queryFn: () => api.get<FilterOptions>("/api/v1/analytics/filter-options"),
    staleTime: 5 * 60_000,
  });
}

export function useExportCsv() {
  const filter = useRecordsFilterStore();
  return useMutation({
    mutationFn: async () => {
      const q = filterStateToQuery(filter);
      const res = await fetch(`${env.apiUrl}/api/v1/records/export?${q}`, { method: "GET" });
      if (!res.ok) throw new Error(`export failed: ${res.status}`);
      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition") ?? "";
      const m = cd.match(/filename="?([^";]+)"?/);
      const filename = m?.[1] ?? `records_${Date.now()}.csv`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
  });
}

export function useDebouncedFilter(filter: RecordsFilterState, ms: number = 300): RecordsFilterState {
  const [debounced, setDebounced] = useState<RecordsFilterState>(filter);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(filter), ms);
    return () => clearTimeout(id);
  }, [filter, ms]);
  return debounced;
}
