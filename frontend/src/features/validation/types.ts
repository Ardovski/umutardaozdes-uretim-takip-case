export interface ValidationIssue {
  id: number;
  record_id: number;
  rule_id: string;
  category: string;
  severity: string;
  fields: string | null;
  message: string;
  suggested_action: string;
  detected_at: string | null;
  fixed_at: string | null;
  status: string;
}

export interface ValidationSummary {
  total_records: number;
  by_status: Record<string, number>;
  by_category: Record<string, number>;
  by_severity: Record<string, number>;
  by_rule: Record<string, number>;
}

export interface RecordEdit {
  id: number;
  field: string;
  old_value: string | null;
  new_value: string | null;
  reason: string | null;
  edited_by: string;
  edited_at: string | null;
}

export interface IssueFilter {
  category?: string;
  severity?: string;
  rule_id?: string;
  record_status?: string;
}
