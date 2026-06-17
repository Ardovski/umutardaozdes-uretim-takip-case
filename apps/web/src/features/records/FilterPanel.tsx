"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useFilterOptions } from "./useRecords";
import { useRecordsFilterStore } from "@/stores/filters";

const SHIFTS: Array<{ value: number; label: string }> = [
  { value: 1, label: "Sabah" },
  { value: 2, label: "Öğle" },
  { value: 3, label: "Gece" },
];

const STATUSES: Array<{ value: string; label: string }> = [
  { value: "valid", label: "Geçerli" },
  { value: "suspect", label: "Şüpheli" },
  { value: "rejected", label: "Reddedildi" },
];

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function FilterPanel() {
  const filter = useRecordsFilterStore();
  const options = useFilterOptions();

  return (
    <aside className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground">
      <h2 className="text-sm font-medium text-muted-foreground">Filtreler</h2>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-muted-foreground">Başlangıç</label>
          <Input
            type="date"
            value={filter.dateRange.start ?? ""}
            onChange={(e) => filter.setDateRange({ ...filter.dateRange, start: e.target.value || null })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground">Bitiş</label>
          <Input
            type="date"
            value={filter.dateRange.end ?? ""}
            onChange={(e) => filter.setDateRange({ ...filter.dateRange, end: e.target.value || null })}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground">Vardiya</label>
        <div className="mt-1 flex gap-2">
          {SHIFTS.map((s) => (
            <Checkbox
              key={s.value}
              checked={filter.shifts.includes(s.value)}
              onChange={() => filter.setShifts(toggle(filter.shifts, s.value))}
              label={s.label}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground">İstasyon</label>
        <Select
          multiple
          value={filter.stations}
          onChange={(e) =>
            filter.setStations(Array.from(e.target.selectedOptions).map((o) => o.value))
          }
          className="h-24"
        >
          {(options.data?.stations ?? []).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground">Stok adı (LIKE)</label>
        <Input
          type="text"
          value={filter.stockName ?? ""}
          onChange={(e) => filter.setStockName(e.target.value || null)}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground">
          OEE min: {filter.oeeRange.min ?? 0}
        </label>
        <Slider
          value={filter.oeeRange.min ?? 0}
          min={0}
          max={100}
          onChange={(v) => filter.setOeeRange({ ...filter.oeeRange, min: v })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-foreground">
          OEE max: {filter.oeeRange.max ?? 100}
        </label>
        <Slider
          value={filter.oeeRange.max ?? 100}
          min={0}
          max={100}
          onChange={(v) => filter.setOeeRange({ ...filter.oeeRange, max: v })}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground">Validasyon durumu</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Checkbox
              key={s.value}
              checked={filter.validationStatus.includes(s.value)}
              onChange={() =>
                filter.setValidationStatus(toggle(filter.validationStatus, s.value))
              }
              label={s.label}
            />
          ))}
        </div>
      </div>

      <div>
        <Checkbox
          checked={filter.onlyProblematic}
          onChange={(v) => filter.setOnlyProblematic(v)}
          label="Sadece sorunlu"
        />
      </div>

      <Button variant="outline" size="sm" onClick={() => filter.reset()}>
        Sıfırla
      </Button>
    </aside>
  );
}
