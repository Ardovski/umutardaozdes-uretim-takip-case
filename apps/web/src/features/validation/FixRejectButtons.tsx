"use client";

import { useState } from "react";
import { Badge, severityTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAcceptRecord, useFixRecord, useRejectRecord } from "./useValidation";

export interface FixRejectButtonsProps {
  recordId: number;
  onAfterAction?: () => void;
}

export function FixRejectButtons({ recordId, onAfterAction }: FixRejectButtonsProps) {
  const fix = useFixRecord();
  const reject = useRejectRecord();
  const accept = useAcceptRecord();
  const [patchJson, setPatchJson] = useState('{"field": "value"}');

  const onFix = () => {
    try {
      const patch = JSON.parse(patchJson) as Record<string, unknown>;
      fix.mutate(
        { recordId, patch },
        {
          onSuccess: () => onAfterAction?.(),
        },
      );
    } catch {
      return;
    }
  };

  const onReject = () =>
    reject.mutate(
      { recordId },
      { onSuccess: () => onAfterAction?.() },
    );

  const onAccept = () =>
    accept.mutate(
      { recordId },
      { onSuccess: () => onAfterAction?.() },
    );

  const busy = fix.isPending || reject.isPending || accept.isPending;

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-muted-foreground">Düzeltme patch (JSON)</label>
        <textarea
          value={patchJson}
          onChange={(e) => setPatchJson(e.target.value)}
          className="mt-1 h-24 w-full rounded-md border bg-background p-2 font-mono text-xs"
          spellCheck={false}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Örn: <code>{'{"produced_qty": 12}'}</code>
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onFix} disabled={busy} size="sm">
          Düzelt
        </Button>
        <Button onClick={onReject} disabled={busy} size="sm" variant="destructive">
          Reddet
        </Button>
        <Button onClick={onAccept} disabled={busy} size="sm" variant="outline">
          Onayla
        </Button>
      </div>
      {fix.isError || reject.isError || accept.isError ? (
        <Badge tone="destructive">İşlem başarısız</Badge>
      ) : null}
    </div>
  );
}

export { severityTone };
