"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { SubmitRequest, SubmitResponse, SubmissionOut, SyncPreview } from "./types";

export function useSyncPreview() {
  return useQuery({
    queryKey: queryKeys.sync.preview,
    queryFn: () => api.get<SyncPreview>("/api/v1/sync/preview"),
  });
}

export function useSyncHistory(status?: string) {
  const q = status ? `?status=${encodeURIComponent(status)}&limit=100` : "?limit=100";
  return useQuery({
    queryKey: [...queryKeys.sync.history, status ?? "all"] as const,
    queryFn: () => api.get<SubmissionOut[]>(`/api/v1/sync/history${q}`),
    refetchInterval: 3_000,
  });
}

export function useSubmitSync() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: SubmitRequest) => api.post<SubmitResponse>("/api/v1/sync/submit", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sync.preview });
      qc.invalidateQueries({ queryKey: queryKeys.sync.history });
    },
  });
}

export function useRetrySync() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (submissionId: number) =>
      api.post<SubmissionOut>(`/api/v1/sync/${submissionId}/retry`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sync.history });
    },
  });
}

export function useRetryAll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<{ queued: number }>("/api/v1/sync/retry-all"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sync.history });
    },
  });
}
