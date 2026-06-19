"use client";

import { FileSpreadsheet, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT } from "@/lib/i18n";
import type { ImportPreview } from "./types";

const COLS: Array<{ key: keyof PreviewCols; labelKey: string | null; raw?: string }> = [
  { key: "record_id_src", labelKey: null, raw: "record_id" },
  { key: "prod_date", labelKey: "import.importPreviewPanel.colDate" },
  { key: "shift", labelKey: "import.importPreviewPanel.colShift" },
  { key: "station_name", labelKey: "import.importPreviewPanel.colStation" },
  { key: "stock_name", labelKey: "import.importPreviewPanel.colStock" },
  { key: "oee", labelKey: null, raw: "OEE" },
  { key: "produced_qty", labelKey: "import.importPreviewPanel.colProduced" },
  { key: "scrap_qty", labelKey: "import.importPreviewPanel.colScrap" },
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
  const t = useT();
  const shown = preview.sample.length;
  return (
    <Card data-testid="import-preview">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            {t("import.importPreviewPanel.title")} — {preview.filename}
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("import.importPreviewPanel.meta", {
              rows: preview.total_rows,
              cols: preview.detected_columns.length,
              encoding: preview.encoding,
              shown,
            })}
          </p>
        </div>
        <Badge tone="outline">{t("import.importPreviewPanel.notImported")}</Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                {COLS.map((c) => (
                  <th key={c.key} className="whitespace-nowrap px-3 py-2 font-medium">
                    {c.labelKey ? t(c.labelKey) : c.raw}
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
          {t("import.importPreviewPanel.hint")}
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={busy}>
            {t("import.importPreviewPanel.cancel")}
          </Button>
          <Button size="sm" onClick={onConfirm} disabled={busy}>
            {busy && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            {t("import.importPreviewPanel.confirm", { rows: preview.total_rows })}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
