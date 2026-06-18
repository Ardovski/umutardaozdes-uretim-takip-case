"use client";

import { FileSpreadsheet, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ImportPreview } from "./types";

const COLS: Array<{ key: keyof PreviewCols; label: string }> = [
  { key: "record_id_src", label: "record_id" },
  { key: "prod_date", label: "Tarih" },
  { key: "shift", label: "Vardiya" },
  { key: "station_name", label: "İstasyon" },
  { key: "stock_name", label: "Stok" },
  { key: "oee", label: "OEE" },
  { key: "produced_qty", label: "Üretilen" },
  { key: "scrap_qty", label: "Hatalı" },
];

type PreviewCols = ImportPreview["sample"][number];

function cell(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}

export function ImportPreviewPanel({
  preview,
  onConfirm,
  onCancel,
  busy = false,
}: {
  preview: ImportPreview;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  const shown = preview.sample.length;
  return (
    <Card data-testid="import-preview">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            Önizleme — {preview.filename}
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            {preview.total_rows} satır · {preview.detected_columns.length} kolon ·{" "}
            {preview.encoding} · ilk {shown} satır gösteriliyor
          </p>
        </div>
        <Badge tone="outline">içe aktarılmadı</Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                {COLS.map((c) => (
                  <th key={c.key} className="whitespace-nowrap px-3 py-2 font-medium">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.sample.map((row, i) => (
                <tr key={i} className="border-t">
                  {COLS.map((c) => (
                    <td key={c.key} className="whitespace-nowrap px-3 py-1.5 tabular-nums">
                      {cell(row[c.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground">
          Bu yalnız bir önizlemedir; veri henüz içe aktarılmadı. Onaylarsan tüm satırlar
          import edilip otomatik doğrulanır.
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={busy}>
            Vazgeç
          </Button>
          <Button size="sm" onClick={onConfirm} disabled={busy}>
            {busy && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            İçe Aktar ({preview.total_rows} satır)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
