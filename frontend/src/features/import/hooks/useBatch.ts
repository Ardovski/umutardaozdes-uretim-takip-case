"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useActiveBatch, type ActiveBatch } from "@/hooks/useActiveBatch";
import type { BatchOut, ImportPreview, ImportSummary } from "../types";

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

/** Yükleme öncesi önizleme — ilk satırlar + tespit edilen kolonlar (import etmez). */
export function useImportPreview() {
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return api.uploadWithProgress<ImportPreview>("/api/v1/imports/preview", form);
    },
  });
}

export function useImportCsv() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (p: number) => void }) => {
      const form = new FormData();
      form.append("file", file);
      return api.uploadWithProgress<ImportSummary>("/api/v1/imports/import", form, onProgress);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.imports.all });
    },
  });
}
