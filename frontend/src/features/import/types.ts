export interface BatchOut {
  id: number;
  filename: string;
  file_hash: string;
  uploaded_at: string;
  total_rows: number;
  imported_rows: number;
  status: string;
  is_active: boolean;
}

export interface PreviewRow {
  record_id_src: number | null;
  prod_date: string | null;
  work_order_no: string | null;
  station_name: string | null;
  stock_name: string | null;
  shift: number | null;
  oee: number | null;
  produced_qty: number | null;
  scrap_qty: number | null;
  parse_warnings: string[];
}

export interface ImportPreview {
  filename: string;
  file_hash: string;
  total_rows: number;
  sample: PreviewRow[];
  detected_columns: string[];
  encoding: string;
}

export interface ImportValidation {
  validated_records: number;
  valid: number;
  suspect: number;
  rejected: number;
  total_issues: number;
  by_severity: Record<string, number>; // error|warning|info
  by_category: Record<string, number>; // missing|range|consistency|duplicate|format|domain
}

export interface FailedRowSample {
  reason?: string;
  row?: Record<string, string>;
}

export interface ImportSummary {
  batch_id: number;
  filename: string;
  file_hash: string;
  total_rows: number;
  imported_rows: number;
  duplicate_file: boolean;
  duplicate_row_skipped: number;
  parse_failed_count: number;
  failed_rows_sample: FailedRowSample[];
  status: string;
  elapsed_ms: number;
  validation: ImportValidation | null;
}
