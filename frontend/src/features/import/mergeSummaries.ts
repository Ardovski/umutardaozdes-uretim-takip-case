import type { ImportSummary, ImportValidation } from "./types";

function mergeCounts(target: Record<string, number>, src: Record<string, number>) {
  for (const [k, v] of Object.entries(src)) target[k] = (target[k] ?? 0) + v;
}

/** Çoklu CSV import sonuçlarını tek birleşik özete indirger (sayısal alanlar toplanır). */
export function mergeSummaries(parts: ImportSummary[]): ImportSummary {
  const validations = parts.map((p) => p.validation).filter((v): v is ImportValidation => !!v);
  const validation: ImportValidation | null = validations.length
    ? validations.reduce(
        (acc, v) => {
          acc.validated_records += v.validated_records;
          acc.valid += v.valid;
          acc.suspect += v.suspect;
          acc.rejected += v.rejected;
          acc.total_issues += v.total_issues;
          mergeCounts(acc.by_severity, v.by_severity);
          mergeCounts(acc.by_category, v.by_category);
          return acc;
        },
        {
          validated_records: 0,
          valid: 0,
          suspect: 0,
          rejected: 0,
          total_issues: 0,
          by_severity: {} as Record<string, number>,
          by_category: {} as Record<string, number>,
        },
      )
    : null;

  return {
    batch_id: parts[parts.length - 1].batch_id,
    filename: `${parts.length} dosya`,
    file_hash: "",
    total_rows: parts.reduce((n, p) => n + p.total_rows, 0),
    imported_rows: parts.reduce((n, p) => n + p.imported_rows, 0),
    duplicate_file: parts.some((p) => p.duplicate_file),
    duplicate_row_skipped: parts.reduce((n, p) => n + p.duplicate_row_skipped, 0),
    parse_failed_count: parts.reduce((n, p) => n + p.parse_failed_count, 0),
    failed_rows_sample: parts.flatMap((p) => p.failed_rows_sample).slice(0, 10),
    status: "completed",
    elapsed_ms: parts.reduce((n, p) => n + p.elapsed_ms, 0),
    validation,
  };
}
