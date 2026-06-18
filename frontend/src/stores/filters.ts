"use client";

import { create } from "zustand";

export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface OeeRange {
  min: number | null;
  max: number | null;
}

export interface RecordsFilterState {
  dateRange: DateRange;
  shifts: number[];
  stations: string[];
  stockName: string | null;
  oeeRange: OeeRange;
  validationStatus: string[];
  hasIssues: boolean | null;
  onlyProblematic: boolean;
  setDateRange: (r: DateRange) => void;
  setShifts: (s: number[]) => void;
  setStations: (s: string[]) => void;
  setStockName: (s: string | null) => void;
  setOeeRange: (r: OeeRange) => void;
  setValidationStatus: (s: string[]) => void;
  setHasIssues: (v: boolean | null) => void;
  setOnlyProblematic: (v: boolean) => void;
  reset: () => void;
  hydrate: (s: Partial<RecordsFilterState>) => void;
}

const initial = {
  dateRange: { start: null, end: null },
  shifts: [] as number[],
  stations: [] as string[],
  stockName: null as string | null,
  oeeRange: { min: null, max: null },
  validationStatus: [] as string[],
  hasIssues: null as boolean | null,
  onlyProblematic: false,
};

export const useRecordsFilterStore = create<RecordsFilterState>((set) => ({
  ...initial,
  setDateRange: (dateRange) => set({ dateRange }),
  setShifts: (shifts) => set({ shifts }),
  setStations: (stations) => set({ stations }),
  setStockName: (stockName) => set({ stockName }),
  setOeeRange: (oeeRange) => set({ oeeRange }),
  setValidationStatus: (validationStatus) => set({ validationStatus }),
  setHasIssues: (hasIssues) => set({ hasIssues }),
  setOnlyProblematic: (onlyProblematic) => set({ onlyProblematic, hasIssues: onlyProblematic ? true : null }),
  reset: () => set(initial),
  hydrate: (s) => set((prev) => ({ ...prev, ...s })),
}));

export function filterStateToQuery(state: RecordsFilterState): string {
  const p = new URLSearchParams();
  if (state.dateRange.start) p.set("start", state.dateRange.start);
  if (state.dateRange.end) p.set("end", state.dateRange.end);
  state.shifts.forEach((s) => p.append("shift", String(s)));
  state.stations.forEach((s) => p.append("station_name", s));
  if (state.stockName) p.set("stock_name", state.stockName);
  if (state.oeeRange.min !== null) p.set("oee_min", String(state.oeeRange.min));
  if (state.oeeRange.max !== null) p.set("oee_max", String(state.oeeRange.max));
  state.validationStatus.forEach((s) => p.append("validation_status", s));
  if (state.hasIssues !== null) p.set("has_issues", String(state.hasIssues));
  return p.toString();
}

export function queryToFilterState(q: URLSearchParams): Partial<RecordsFilterState> {
  const get = (k: string): string | null => q.get(k);
  const all = (k: string): string[] => q.getAll(k);
  const num = (k: string): number | null => {
    const v = q.get(k);
    if (v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const bool = (k: string): boolean | null => {
    const v = q.get(k);
    if (v === null) return null;
    return v === "true";
  };
  return {
    dateRange: { start: get("start"), end: get("end") },
    shifts: all("shift").map((x) => Number(x)).filter((x) => Number.isFinite(x) && [1, 2, 3].includes(x)),
    stations: all("station_name"),
    stockName: get("stock_name"),
    oeeRange: { min: num("oee_min"), max: num("oee_max") },
    validationStatus: all("validation_status"),
    hasIssues: bool("has_issues"),
    onlyProblematic: (q.get("has_issues") ?? "") === "true",
  };
}
