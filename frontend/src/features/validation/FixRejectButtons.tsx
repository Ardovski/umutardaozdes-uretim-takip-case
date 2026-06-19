"use client";

import { useState } from "react";
import { Badge, severityTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { useAcceptRecord, useFixRecord, useRejectRecord } from "./useValidation";

export interface FixRejectButtonsProps {
  recordId: number;
  onAfterAction?: () => void;
}

export function FixRejectButtons({ recordId, onAfterAction }: FixRejectButtonsProps) {
  const t = useT();
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
        <label className="block text-xs font-medium text-muted-foreground">{t("validation.fixRejectButtons.patchLabel")}</label>
        <textarea
          value={patchJson}
          onChange={(e) => setPatchJson(e.target.value)}
          className="mt-1 h-24 w-full rounded-md border bg-background p-2 font-mono text-xs"
          spellCheck={false}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {t("validation.fixRejectButtons.example")} <code>{'{"produced_qty": 12}'}</code>
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onFix} disabled={busy} size="sm">
          {t("validation.fixRejectButtons.fix")}
        </Button>
        <Button onClick={onReject} disabled={busy} size="sm" variant="destructive">
          {t("validation.fixRejectButtons.reject")}
        </Button>
        <Button onClick={onAccept} disabled={busy} size="sm" variant="outline">
          {t("validation.fixRejectButtons.accept")}
        </Button>
      </div>
      {fix.isError || reject.isError || accept.isError ? (
        <Badge tone="destructive">{t("validation.fixRejectButtons.actionFailed")}</Badge>
      ) : null}
    </div>
  );
}

export { severityTone };
