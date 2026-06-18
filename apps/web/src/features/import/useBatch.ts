"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useActiveBatch, type ActiveBatch } from "@/hooks/useActiveBatch";
import type { BatchOut, ImportSummary } from "./types";

export { useActiveBatch };
export type { ActiveBatch };

export function useBatches() {
  return useQuery({
    queryKey: queryKeys.imports.batches,
    queryFn: () => api.get<BatchOut[]>("/api/v1/imports/batches"),
  });
}

export function useActivateBatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (batchId: number) =>
      api.post<BatchOut>(`/api/v1/imports/batches/${batchId}/activate`),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.imports.all });
    },
  });
}

export function useDeleteBatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (batchId: number) =>
      api.delete<void>(`/api/v1/imports/batches/${batchId}`),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.imports.all });
    },
  });
}

export function useImportCsv() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) =>
      api.upload<ImportSummary>("/api/v1/imports/import", form),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.imports.all });
    },
  });
}
