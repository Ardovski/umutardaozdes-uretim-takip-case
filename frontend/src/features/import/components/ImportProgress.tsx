"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * İçe aktarma ilerlemesi. value < 100 → yükleme yüzdesi (XHR upload progress);
 * value === 100 → sunucu işleme/doğrulama fazı (belirsiz, animasyonlu).
 */
export function ImportProgress({ value, filename }: { value: number; filename?: string }) {
  const t = useT();
  const processing = value >= 100;
  return (
    <Card data-testid="import-progress">
      <CardContent className="space-y-3 py-6">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 font-medium">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            {processing ? t("import.importProgress.processing") : t("common.loading")}
            {filename && <span className="font-mono text-xs text-muted-foreground">{filename}</span>}
          </span>
          <span className="tabular-nums text-muted-foreground">
            {processing ? "%100" : `%${value}`}
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full bg-primary transition-all duration-200",
              processing && "animate-pulse",
            )}
            style={{ width: processing ? "100%" : `${value}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          {processing
            ? t("import.importProgress.processingDetail")
            : t("import.importProgress.uploadingDetail")}
        </p>
      </CardContent>
    </Card>
  );
}
