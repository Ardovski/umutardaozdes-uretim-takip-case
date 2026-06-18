export interface SyncGroupPreview {
  production_date: string;
  shift: number;
  machine_count: number;
  total_production_units: number;
  oe_value: number | null;
  idempotency_key: string;
  payload_hash: string;
  source_record_count: number;
}

export interface SyncPreview {
  groups: SyncGroupPreview[];
  total_groups: number;
}

export interface SubmissionOut {
  id: number;
  prod_date: string;
  shift: number;
  idempotency_key: string;
  payload_hash: string;
  status: string;
  http_status: number | null;
  target_submission_id: number | null;
  attempts: number;
  last_attempt_at: string | null;
  created_at: string | null;
  error_message: string | null;
  response_body: string | null;
}

/** UI'da seçilen tek bir (gün, vardiya) grubu — `SubmitRequest.targets` elemanı. */
export interface SubmitTarget {
  production_date: string;
  shift: number;
}

export interface SubmitRequest {
  production_date?: string | null;
  shift?: number | null;
  /** Çoklu seçim: doluysa yalnız bu grup(lar) gönderilir (boşsa eski tek/all davranışı). */
  targets?: SubmitTarget[];
  force?: boolean;
}

export interface SubmitResponse {
  accepted: string[];
  skipped_already_success: string[];
  rejected_due_to_hash_conflict: string[];
  submission_ids: number[];
}
