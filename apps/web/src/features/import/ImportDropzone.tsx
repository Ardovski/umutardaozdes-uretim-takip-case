"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { useActivateBatch, useImportCsv } from "./useBatch";

export function ImportDropzone() {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useImportCsv();
  const activate = useActivateBatch();
  const toast = useToast();

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.push({ tone: "warning", title: "Sadece CSV dosyaları desteklenir" });
      return;
    }
    const form = new FormData();
    form.append("file", file);
    try {
      const result = await upload.mutateAsync(form);
      await activate.mutateAsync(result.batch_id);
      toast.push({
        tone: "success",
        title: "İçe aktarıldı",
        description: `${result.filename} · ${result.imported_rows}/${result.total_rows} satır · ${result.elapsed_ms}ms`,
      });
    } catch {
      toast.push({ tone: "destructive", title: "İçe aktarma başarısız" });
    }
  };

  const busy = upload.isPending || activate.isPending;

  return (
    <Card
      onDragOver={(e) => {
        e.preventDefault();
        if (!dragging) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) void handleFile(file);
      }}
      className={cn(
        "border-dashed transition-colors",
        dragging ? "border-primary bg-accent" : "border-border",
        busy && "pointer-events-none opacity-60",
      )}
    >
      <CardContent className="flex flex-col items-center justify-center gap-3 py-10">
        {busy ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="h-8 w-8 text-muted-foreground" />
        )}
        <div className="text-center">
          <p className="text-sm font-medium">CSV dosyasını sürükle ya da seç</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Yüklendikten sonra otomatik aktif batch olur.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          Dosya Seç
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
      </CardContent>
    </Card>
  );
}
