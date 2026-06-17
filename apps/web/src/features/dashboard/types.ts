export interface KpiCards {
  avg_oee: number | null;
  total_production: number;
  total_scrap: number;
  total_down_time_minutes: number;
  record_count: number;
  valid_count: number;
  suspect_count: number;
  rejected_count: number;
}

export interface OeeTrendPoint {
  prod_date: string;
  avg_oee: number | null;
  total_production: number;
  record_count: number;
}

export interface ShiftComparisonRow {
  shift: number;
  avg_oee: number | null;
  total_production: number;
  total_scrap: number;
  record_count: number;
}

export interface StationRankingRow {
  station_name: string;
  avg_oee: number | null;
  total_production: number;
  record_count: number;
}

export interface QualityDistributionBucket {
  bucket_label: string;
  bucket_start: number;
  bucket_end: number;
  record_count: number;
  total_scrap: number;
}

export interface FilterOptions {
  stations: string[];
  stock_names: string[];
  work_centers: string[];
}

export interface DashboardFilters {
  start: string | null;
  end: string | null;
  shift: number[];
  station_name: string[];
  stock_name: string | null;
  oee_min: number | null;
  oee_max: number | null;
  validation_status: string[];
  has_issues: boolean | null;
}

export const EMPTY_FILTERS: DashboardFilters = {
  start: null,
  end: null,
  shift: [],
  station_name: [],
  stock_name: null,
  oee_min: null,
  oee_max: null,
  validation_status: [],
  has_issues: null,
};

export function filtersToQuery(f: DashboardFilters): string {
  const p = new URLSearchParams();
  if (f.start) p.set("start", f.start);
  if (f.end) p.set("end", f.end);
  f.shift.forEach((s) => p.append("shift", String(s)));
  f.station_name.forEach((s) => p.append("station_name", s));
  if (f.stock_name) p.set("stock_name", f.stock_name);
  if (f.oee_min !== null) p.set("oee_min", String(f.oee_min));
  if (f.oee_max !== null) p.set("oee_max", String(f.oee_max));
  f.validation_status.forEach((s) => p.append("validation_status", s));
  if (f.has_issues !== null) p.set("has_issues", String(f.has_issues));
  return p.toString();
}
