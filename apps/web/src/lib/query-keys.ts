/** TanStack Query key fabrikası — tutarlı cache invalidation için tek kaynak. */
export const queryKeys = {
  imports: {
    all: ["imports"] as const,
    summary: (id: number) => ["imports", id, "summary"] as const,
  },
  records: {
    all: ["records"] as const,
    list: (filters: unknown) => ["records", "list", filters] as const,
    detail: (id: number) => ["records", id] as const,
  },
  validation: {
    issues: (filters?: unknown) => ["validation", "issues", filters] as const,
    summary: ["validation", "summary"] as const,
  },
  analytics: {
    kpis: (filters?: unknown) => ["analytics", "kpis", filters] as const,
    oeeTrend: (filters?: unknown) => ["analytics", "oee-trend", filters] as const,
    shiftComparison: (filters?: unknown) => ["analytics", "shift-comparison", filters] as const,
    stationRanking: (filters?: unknown) => ["analytics", "station-ranking", filters] as const,
    qualityDistribution: (filters?: unknown) =>
      ["analytics", "quality-distribution", filters] as const,
  },
  sync: {
    preview: ["sync", "preview"] as const,
    history: ["sync", "history"] as const,
  },
} as const;
