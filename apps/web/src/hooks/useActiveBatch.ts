"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export interface ActiveBatch {
  id: number;
  filename: string;
  file_hash: string;
  uploaded_at: string;
  total_rows: number;
  imported_rows: number;
  status: string;
  is_active: boolean;
}

export function useActiveBatch() {
  return useQuery({
    queryKey: queryKeys.imports.activeBatch,
    queryFn: () => api.get<ActiveBatch | null>("/api/v1/imports/batches/active"),
  });
}
