"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useFilterOptions } from "./useRecords";
import { useRecordsFilterStore } from "@/stores/filters";
import { useT } from "@/lib/i18n";

const SHIFT_VALUES = [1, 2, 3] as const;

const STATUS_VALUES = ["valid", "suspect", "rejected"] as const;

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function FilterPanel() {
  const t = useT();
  const filter = useRecordsFilterStore();
  const options = useFilterOptions();

  return (
    <aside className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground">
      <h2 className="text-sm font-medium text-muted-foreground">{t("records.filterPanel.title")}</h2>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-muted-foreground">{t("records.filterPanel.startDate")}</label>
          <Input
            type="date"
            value={filter.dateRange.start ?? ""}
            onChange={(e) => filter.setDateRange({ ...filter.dateRange, start: e.target.value || null })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground">{t("records.filterPanel.endDate")}</label>
          <Input
            type="date"
            value={filter.dateRange.end ?? ""}
            onChange={(e) => filter.setDateRange({ ...filter.dateRange, end: e.target.value || null })}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground">{t("records.filterPanel.shift")}</label>
        <div className="mt-1 flex gap-2">
          {SHIFT_VALUES.map((value) => (
            <Checkbox
              key={value}
              checked={filter.shifts.includes(value)}
              onChange={() => filter.setShifts(toggle(filter.shifts, value))}
              label={t(`shift.${value}`)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground">{t("records.filterPanel.station")}</label>
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
        <label className="block text-xs font-medium text-muted-foreground">{t("records.filterPanel.stockName")}</label>
        <Input
          type="text"
          value={filter.stockName ?? ""}
          onChange={(e) => filter.setStockName(e.target.value || null)}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground">
          {t("records.filterPanel.oeeMin", { n: filter.oeeRange.min ?? 0 })}
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
          {t("records.filterPanel.oeeMax", { n: filter.oeeRange.max ?? 100 })}
        </label>
        <Slider
          value={filter.oeeRange.max ?? 100}
          min={0}
          max={100}
          onChange={(v) => filter.setOeeRange({ ...filter.oeeRange, max: v })}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground">{t("records.filterPanel.validationStatus")}</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {STATUS_VALUES.map((value) => (
            <Checkbox
              key={value}
              checked={filter.validationStatus.includes(value)}
              onChange={() =>
                filter.setValidationStatus(toggle(filter.validationStatus, value))
              }
              label={t(`status.${value}`)}
            />
          ))}
        </div>
      </div>

      <div>
        <Checkbox
          checked={filter.onlyProblematic}
          onChange={(v) => filter.setOnlyProblematic(v)}
          label={t("records.filterPanel.onlyProblematic")}
        />
      </div>

      <Button variant="outline" size="sm" onClick={() => filter.reset()}>
        {t("records.filterPanel.reset")}
      </Button>
    </aside>
  );
}
