/**
 * Paylaşılan domain tipleri (frontend sözleşmesi).
 *
 * NOT: Backend JSON'u camelCase serialize eder (Pydantic alias) → bu tipler camelCase.
 * Kaynak alanlar: .docs/shared/domain/data-dictionary.md · .docs/api/database.md
 */
import type {
  RecordStatus,
  Severity,
  SuggestedAction,
  ValidationCategory,
} from "@/lib/constants";

export interface ProductionRecord {
  id: number;
  recordIdSrc: number | null;
  prodDate: string | null; // ISO YYYY-MM-DD
  workOrderNo: string | null;
  workCenterNo: string | null;
  workCenterName: string | null;
  stationName: string | null;
  stockName: string | null;
  shift: number | null;
  availability: number | null;
  performance: number | null;
  quality: number | null;
  oee: number | null;
  runTime: number | null;
  downTime: number | null;
  plannedDown: number | null;
  unplannedDown: number | null;
  producedQty: number | null;
  scrapQty: number | null;
  oeeRecomputed: number | null;
  status: RecordStatus;
}

export interface ValidationIssue {
  id: number;
  recordId: number;
  ruleId: string; // örn. V-C01
  category: ValidationCategory;
  severity: Severity;
  fields: string[];
  message: string;
  suggestedAction: SuggestedAction;
  status: "open" | "fixed" | "rejected" | "accepted";
}

export interface ImportSummary {
  batchId: number;
  total: number;
  imported: number;
  suspect: number;
  rejected: number;
  qualityBreakdown: Partial<Record<ValidationCategory, number>>;
}

export interface Kpis {
  avgOee: number;
  totalProduction: number;
  totalScrap: number;
  totalDowntime: number;
}

export interface SyncSubmission {
  id: number;
  prodDate: string;
  shift: number;
  status: "pending" | "success" | "failed";
  httpStatus: number | null;
  targetSubmissionId: number | null;
  attempts: number;
}

/** Filtre durumu (records + dashboard ortak). */
export interface RecordFilters {
  dateFrom?: string;
  dateTo?: string;
  shifts?: number[];
  stations?: string[];
  stock?: string;
  oeeMin?: number;
  oeeMax?: number;
  onlyProblematic?: boolean;
}
