"use client";

import { cn } from "@/lib/utils";
import type { DashboardFilters, FilterOptions } from "./types";

export interface DashboardFiltersProps {
  filters: DashboardFilters;
  onChange: (next: DashboardFilters) => void;
  options?: FilterOptions;
}

const STATUSES: Array<{ value: string; label: string }> = [
  { value: "valid", label: "Geçerli" },
  { value: "suspect", label: "Şüpheli" },
  { value: "rejected", label: "Reddedildi" },
];

const SHIFTS: Array<{ value: number; label: string }> = [
  { value: 1, label: "Sabah" },
  { value: 2, label: "Öğle" },
  { value: 3, label: "Gece" },
];

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function DashboardFiltersPanel({ filters, onChange, options }: DashboardFiltersProps) {
  const set = <K extends keyof DashboardFilters>(k: K, v: DashboardFilters[K]) =>
    onChange({ ...filters, [k]: v });

  return (
    <aside className="rounded-lg border bg-card p-4 text-card-foreground">
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">Filtreler</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground">Tarih başlangıç</label>
          <input
            type="date"
            value={filters.start ?? ""}
            onChange={(e) => set("start", e.target.value || null)}
            className="mt-1 w-full rounded-md border bg-background px-2 py-1 text-sm text-foreground"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground">Tarih bitiş</label>
          <input
            type="date"
            value={filters.end ?? ""}
            onChange={(e) => set("end", e.target.value || null)}
            className="mt-1 w-full rounded-md border bg-background px-2 py-1 text-sm text-foreground"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground">Vardiya</label>
          <div className="mt-1 flex gap-2">
            {SHIFTS.map((s) => {
              const active = filters.shift.includes(s.value);
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set("shift", toggle(filters.shift, s.value))}
                  className={cn(
                    "rounded-md border px-2 py-1 text-xs",
                    active ? "bg-primary text-primary-foreground" : "bg-background text-foreground",
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground">İstasyon</label>
          <select
            multiple
            value={filters.station_name}
            onChange={(e) =>
              set(
                "station_name",
                Array.from(e.target.selectedOptions).map((o) => o.value),
              )
            }
            className="mt-1 h-24 w-full rounded-md border bg-background px-2 py-1 text-sm text-foreground"
          >
            {(options?.stations ?? []).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground">Stok adı (LIKE)</label>
          <input
            type="text"
            value={filters.stock_name ?? ""}
            onChange={(e) => set("stock_name", e.target.value || null)}
            className="mt-1 w-full rounded-md border bg-background px-2 py-1 text-sm text-foreground"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-muted-foreground">OEE min</label>
            <input
              type="number"
              min={0}
              max={100}
              value={filters.oee_min ?? ""}
              onChange={(e) =>
                set("oee_min", e.target.value === "" ? null : Number(e.target.value))
              }
              className="mt-1 w-full rounded-md border bg-background px-2 py-1 text-sm text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground">OEE max</label>
            <input
              type="number"
              min={0}
              max={100}
              value={filters.oee_max ?? ""}
              onChange={(e) =>
                set("oee_max", e.target.value === "" ? null : Number(e.target.value))
              }
              className="mt-1 w-full rounded-md border bg-background px-2 py-1 text-sm text-foreground"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground">Validasyon durumu</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {STATUSES.map((s) => {
              const active = filters.validation_status.includes(s.value);
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set("validation_status", toggle(filters.validation_status, s.value))}
                  className={cn(
                    "rounded-md border px-2 py-1 text-xs",
                    active ? "bg-primary text-primary-foreground" : "bg-background text-foreground",
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground">Sadece sorunlu</label>
          <div className="mt-1 flex gap-2">
            {[
              { v: null, l: "Tümü" },
              { v: true, l: "Sorunlu" },
              { v: false, l: "Sorunsuz" },
            ].map((opt) => {
              const active = filters.has_issues === opt.v;
              return (
                <button
                  key={String(opt.v)}
                  type="button"
                  onClick={() => set("has_issues", opt.v as boolean | null)}
                  className={cn(
                    "rounded-md border px-2 py-1 text-xs",
                    active ? "bg-primary text-primary-foreground" : "bg-background text-foreground",
                  )}
                >
                  {opt.l}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
