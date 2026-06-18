"use client";

import { useRetrySync, useSyncHistory } from "./useSync";
import type { SubmissionOut } from "./types";

const SHIFT_LABELS: Record<number, string> = { 1: "Sabah", 2: "Öğle", 3: "Gece" };

function fmtDate(s: string | null): string {
  if (!s) return "—";
  return s.replace("T", " ").slice(0, 19);
}

function statusClass(status: string): string {
  switch (status) {
    case "success":
      return "bg-success text-success-foreground";
    case "failed":
      return "bg-destructive text-destructive-foreground";
    case "retrying":
      return "bg-warning text-warning-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function HistoryTable() {
  const history = useSyncHistory();
  const retry = useRetrySync();

  return (
    <section className="rounded-lg border bg-card text-card-foreground">
      <div className="border-b p-3 text-sm font-medium text-muted-foreground">
        Gönderim Geçmişi (auto-refresh 3s)
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="p-2">#</th>
            <th className="p-2">Tarih</th>
            <th className="p-2">Vardiya</th>
            <th className="p-2">Durum</th>
            <th className="p-2 text-right">HTTP</th>
            <th className="p-2 text-right">Deneme</th>
            <th className="p-2">Son deneme</th>
            <th className="p-2">Hedef ID</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {history.isLoading ? (
            <tr>
              <td colSpan={9} className="p-4 text-center text-muted-foreground">
                Yükleniyor…
              </td>
            </tr>
          ) : (history.data ?? []).length === 0 ? (
            <tr>
              <td colSpan={9} className="p-4 text-center text-muted-foreground">
                Henüz gönderim yok.
              </td>
            </tr>
          ) : (
            (history.data ?? []).map((s) => (
              <tr key={s.id} className="border-b hover:bg-muted/50">
                <td className="p-2 font-mono">{s.id}</td>
                <td className="p-2 font-mono">{s.prod_date}</td>
                <td className="p-2">{SHIFT_LABELS[s.shift] ?? s.shift}</td>
                <td className="p-2">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusClass(s.status)}`}>
                    {s.status}
                  </span>
                </td>
                <td className="p-2 text-right tabular-nums">{s.http_status ?? "—"}</td>
                <td className="p-2 text-right tabular-nums">{s.attempts}</td>
                <td className="p-2 font-mono text-xs">{fmtDate(s.last_attempt_at)}</td>
                <td className="p-2 font-mono">{s.target_submission_id ?? "—"}</td>
                <td className="p-2">
                  {s.status === "failed" || s.status === "retrying" ? (
                    (() => {
                      // Pending state'i yalnız tıklanan satıra bağla — aksi halde
                      // tek retry tüm satırların butonunu "…" yapardı.
                      const isThisRetrying = retry.isPending && retry.variables === s.id;
                      return (
                        <button
                          type="button"
                          className="rounded-md border bg-background px-2 py-1 text-xs text-foreground disabled:opacity-50"
                          disabled={isThisRetrying}
                          onClick={() => retry.mutate(s.id)}
                        >
                          {isThisRetrying ? "…" : "Retry"}
                        </button>
                      );
                    })()
                  ) : null}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
