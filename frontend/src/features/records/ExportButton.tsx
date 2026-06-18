"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useExportCsv } from "./useRecords";

export function ExportButton() {
  const exp = useExportCsv();
  const toast = useToast();
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={exp.isPending}
      onClick={() =>
        exp.mutate(undefined, {
          onSuccess: () =>
            toast.push({ tone: "success", title: "CSV indirildi" }),
          onError: () =>
            toast.push({ tone: "destructive", title: "CSV indirilemedi" }),
        })
      }
    >
      {exp.isPending ? "İndiriliyor…" : "CSV indir"}
    </Button>
  );
}
