"use client";

import { useState } from "react";
import { useSubmitSync, useSyncPreview } from "./useSync";
import type { SyncGroupPreview } from "./types";

const SHIFT_LABELS: Record<number, string> = { 1: "Sabah", 2: "Öğle", 3: "Gece" };

function fmt(n: number): string {
  return new Intl.NumberFormat("tr-TR").format(n);
}

export function SyncPage() {
  const preview = useSyncPreview();
  const submit = useSubmitSync();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [force, setForce] = useState(false);

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const selectAll = () => {
    if (!preview.data) return;
    setSelected(new Set(preview.data.groups.map((g) => g.idempotency_key)));
  };

  const clearAll = () => setSelected(new Set());

  const onSubmit = () => {
    const groups = preview.data?.groups ?? [];
    const targets: Array<{ production_date: string; shift: number }> = [];
    for (const key of selected) {
      const g = groups.find((x) => x.idempotency_key === key);
      if (g) targets.push({ production_date: g.production_date, shift: g.shift });
    }
    if (targets.length === 1) {
      submit.mutate({
        production_date: targets[0].production_date,
        shift: targets[0].shift,
        force,
      });
    } else {
      submit.mutate({ force });
    }
  };

  return (
    <main className="container mx-auto py-8">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="font-mono text-sm text-muted-foreground">MAGNA · Hedef API Senkronizasyonu</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Sync</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sadece <span className="text-oee-good">valid</span> kayıtlar (gün, vardiya) agrege edilerek
            gönderilir. Hatalı kayıt <strong>asla</strong> gitmez.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={force} onChange={(e) => setForce(e.target.checked)} />
            Force (hash değiştiyse yeni submission)
          </label>
          <button
            type="button"
            className="rounded-md border bg-background px-3 py-1 text-sm text-foreground"
            onClick={selectAll}
          >
            Tümünü seç
          </button>
          <button
            type="button"
            className="rounded-md border bg-background px-3 py-1 text-sm text-foreground"
            onClick={clearAll}
          >
            Temizle
          </button>
          <button
            type="button"
            disabled={selected.size === 0 || submit.isPending}
            onClick={onSubmit}
            className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {submit.isPending ? "Gönderiliyor…" : `Gönder (${selected.size})`}
          </button>
        </div>
      </header>

      {submit.data ? (
        <section className="mb-4 rounded-lg border bg-card p-4 text-sm text-card-foreground">
          <div>
            <strong>Kabul:</strong> {submit.data.accepted.length} ·{" "}
            <strong>Zaten başarılı:</strong> {submit.data.skipped_already_success.length} ·{" "}
            <strong>Hash çakışması:</strong> {submit.data.rejected_due_to_hash_conflict.length}
          </div>
        </section>
      ) : null}

      <section className="rounded-lg border bg-card text-card-foreground">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="p-2"></th>
              <th className="p-2">Tarih</th>
              <th className="p-2">Vardiya</th>
              <th className="p-2 text-right">Makine</th>
              <th className="p-2 text-right">Üretim</th>
              <th className="p-2 text-right">OEE</th>
              <th className="p-2 text-right">Kayıt</th>
              <th className="p-2">Idempotency</th>
            </tr>
          </thead>
          <tbody>
            {preview.isLoading ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-muted-foreground">
                  Yükleniyor…
                </td>
              </tr>
            ) : (preview.data?.groups ?? []).length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-muted-foreground">
                  Gönderilecek geçerli kayıt yok. Önce import + validation çalıştırın.
                </td>
              </tr>
            ) : (
              (preview.data?.groups ?? []).map((g) => (
                <PreviewRow
                  key={g.idempotency_key}
                  group={g}
                  selected={selected.has(g.idempotency_key)}
                  onToggle={() => toggle(g.idempotency_key)}
                />
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}

function PreviewRow({
  group,
  selected,
  onToggle,
}: {
  group: SyncGroupPreview;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="p-2">
        <input type="checkbox" checked={selected} onChange={onToggle} />
      </td>
      <td className="p-2 font-mono">{group.production_date}</td>
      <td className="p-2">{SHIFT_LABELS[group.shift] ?? group.shift}</td>
      <td className="p-2 text-right tabular-nums">{fmt(group.machine_count)}</td>
      <td className="p-2 text-right tabular-nums">{fmt(group.total_production_units)}</td>
      <td className="p-2 text-right tabular-nums">
        {group.oe_value === null ? "—" : `${group.oe_value.toFixed(1)}%`}
      </td>
      <td className="p-2 text-right tabular-nums">{fmt(group.source_record_count)}</td>
      <td className="p-2 font-mono text-xs text-muted-foreground">{group.idempotency_key}</td>
    </tr>
  );
}
