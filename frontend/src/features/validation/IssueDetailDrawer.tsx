"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge, severityTone } from "@/components/ui/badge";
import { FixRejectButtons } from "./FixRejectButtons";
import { useRecordEdits } from "./useValidation";
import type { ValidationIssue } from "./types";

export interface IssueDetailDrawerProps {
  issue: ValidationIssue | null;
  onClose: () => void;
}

export function IssueDetailDrawer({ issue, onClose }: IssueDetailDrawerProps) {
  const edits = useRecordEdits(issue?.record_id ?? 0);
  if (issue === null) return null;
  return (
    // Okunabilirlik: koyu + blur arka plan paneli net ayırır. İçeride etiketler
    // muted, değerler `text-foreground` → düşük kontrast/"belirsiz" görünüm giderildi.
    <div
      className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l bg-card p-4 text-card-foreground shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Issue #{issue.id} · Record #{issue.record_id}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Kapat
          </Button>
        </div>

        <Card className="mb-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge tone={severityTone(issue.severity)}>{issue.severity}</Badge>
              <span className="font-mono text-sm">{issue.rule_id}</span>
              <Badge tone="outline">{issue.category}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-card-foreground">
            <p>
              <span className="font-medium text-muted-foreground">Mesaj:</span>{" "}
              <span className="text-foreground">{issue.message}</span>
            </p>
            <p>
              <span className="font-medium text-muted-foreground">Alanlar:</span>{" "}
              <span className="font-mono text-xs text-foreground">{issue.fields ?? "—"}</span>
            </p>
            <p>
              <span className="font-medium text-muted-foreground">Öneri:</span>{" "}
              <Badge tone="outline">{issue.suggested_action}</Badge>
            </p>
            <p>
              <span className="font-medium text-muted-foreground">Durum:</span>{" "}
              <Badge tone="outline">{issue.status}</Badge>
            </p>
            <p className="text-xs text-muted-foreground">
              Tespit: {issue.detected_at ?? "—"}
              {issue.fixed_at ? ` · Çözüm: ${issue.fixed_at}` : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-3">
          <CardHeader>
            <CardTitle>Aksiyon</CardTitle>
          </CardHeader>
          <CardContent>
            <FixRejectButtons recordId={issue.record_id} onAfterAction={onClose} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Trail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {edits.isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (edits.data ?? []).length === 0 ? (
              <p className="text-muted-foreground">Henüz edit yok.</p>
            ) : (
              (edits.data ?? []).map((e) => (
                <div key={e.id} className="rounded border bg-background p-2">
                  <div className="flex justify-between font-medium">
                    <span>{e.reason ?? e.field}</span>
                    <span className="text-muted-foreground">{e.edited_at}</span>
                  </div>
                  <div className="text-muted-foreground">{e.edited_by}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
