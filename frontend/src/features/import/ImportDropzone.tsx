"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

/** CSV seçimi (drag-and-drop + file picker). Çoklu dosya desteklenir. */
export function ImportDropzone({
  onFiles,
  disabled = false,
}: {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}) {
  const t = useT();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Card
      onDragOver={(e) => {
        e.preventDefault();
        if (!dragging && !disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (disabled) return;
        const files = Array.from(e.dataTransfer.files ?? []);
        if (files.length) onFiles(files);
      }}
      className={cn(
        "border-dashed transition-colors",
        dragging ? "border-primary bg-accent" : "border-border",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <CardContent className="flex flex-col items-center justify-center gap-3 py-10">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium">{t("import.importDropzone.title")}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("import.importDropzone.hint")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          {t("import.importDropzone.selectFile")}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) onFiles(files);
            e.target.value = "";
          }}
        />
      </CardContent>
    </Card>
  );
}
