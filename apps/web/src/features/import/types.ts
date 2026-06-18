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

export interface ImportSummary {
  batch_id: number;
  filename: string;
  file_hash: string;
  total_rows: number;
  imported_rows: number;
  duplicate_file: boolean;
  duplicate_row_skipped: number;
  parse_failed_count: number;
  failed_rows_sample: Array<Record<string, string>>;
  status: string;
  elapsed_ms: number;
}
