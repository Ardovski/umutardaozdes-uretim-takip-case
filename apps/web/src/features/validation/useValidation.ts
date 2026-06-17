"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { IssueFilter, RecordEdit, ValidationIssue, ValidationSummary } from "./types";

export function useIssues(filter: IssueFilter) {
  const p = new URLSearchParams();
  if (filter.category) p.set("category", filter.category);
  if (filter.severity) p.set("severity", filter.severity);
  if (filter.rule_id) p.set("rule_id", filter.rule_id);
  const q = p.toString();
  return useQuery({
    queryKey: [...queryKeys.validation.issues(filter), q] as const,
    queryFn: () => api.get<ValidationIssue[]>(`/api/v1/validation/issues${q ? `?${q}` : ""}`),
  });
}

export function useValidationSummary() {
  return useQuery({
    queryKey: queryKeys.validation.summary,
    queryFn: () => api.get<ValidationSummary>("/api/v1/validation/summary"),
  });
}

export function useRecordEdits(recordId: number) {
  return useQuery({
    queryKey: queryKeys.records.detail(recordId),
    queryFn: () => api.get<RecordEdit[]>(`/api/v1/validation/records/${recordId}/edits`),
    enabled: recordId > 0,
  });
}

export interface FixPayload {
  patch: Record<string, unknown>;
}

export function useFixRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ recordId, patch }: { recordId: number; patch: Record<string, unknown> }) =>
      api.post<{ record_id: number; status: string }>(
        `/api/v1/validation/records/${recordId}/fix`,
        patch,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.validation.issues({}) });
      qc.invalidateQueries({ queryKey: queryKeys.validation.summary });
    },
  });
}

export function useRejectRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ recordId, reason }: { recordId: number; reason?: string }) =>
      api.post<{ record_id: number; status: string }>(
        `/api/v1/validation/records/${recordId}/reject`,
        { reason: reason ?? null },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.validation.issues({}) });
      qc.invalidateQueries({ queryKey: queryKeys.validation.summary });
    },
  });
}

export function useAcceptRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ recordId, reason }: { recordId: number; reason?: string }) =>
      api.post<{ record_id: number; status: string }>(
        `/api/v1/validation/records/${recordId}/accept`,
        { reason: reason ?? null },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.validation.issues({}) });
      qc.invalidateQueries({ queryKey: queryKeys.validation.summary });
    },
  });
}

export function useRunValidation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<{ record_count: number }>("/api/v1/validation/run"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.validation.summary });
      qc.invalidateQueries({ queryKey: queryKeys.validation.issues({}) });
    },
  });
}
