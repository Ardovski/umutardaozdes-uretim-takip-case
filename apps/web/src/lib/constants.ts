/** Domain sabitleri — tek kaynak. Backend ile uyumlu (bkz. .docs/validation + data-dictionary). */

export const SHIFTS = [
  { value: 1, label: "Sabah", token: "shift-1" },
  { value: 2, label: "Öğle", token: "shift-2" },
  { value: 3, label: "Gece", token: "shift-3" },
] as const;

export const SEVERITIES = ["error", "warning", "info"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const VALIDATION_CATEGORIES = [
  "missing",
  "range",
  "consistency",
  "duplicate",
  "format",
  "domain",
] as const;
export type ValidationCategory = (typeof VALIDATION_CATEGORIES)[number];

export const RECORD_STATUSES = ["valid", "suspect", "rejected", "fixed"] as const;
export type RecordStatus = (typeof RECORD_STATUSES)[number];

export const SUGGESTED_ACTIONS = ["reject", "warn", "fix"] as const;
export type SuggestedAction = (typeof SUGGESTED_ACTIONS)[number];

/** OEE bantları (yüzde): ≥85 good · 60–85 mid · <60 low. */
export const OEE_THRESHOLDS = { good: 85, mid: 60 } as const;

/** OEE çapraz kontrol toleransı (yüzde puan) — backend ile aynı olmalı. */
export const OEE_TOLERANCE = 1.0;

/** Severity → Tailwind semantic token eşlemesi (theme.md). */
export const SEVERITY_TOKEN: Record<Severity, string> = {
  error: "destructive",
  warning: "warning",
  info: "info",
};
