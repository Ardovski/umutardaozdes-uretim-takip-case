"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Badge, statusTone } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { oeeColorClass } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { useRecords } from "./useRecords";
import type { RecordOut } from "./types";

export interface RecordsTableProps {
  page: number;
  size: number;
  onPageChange: (p: number) => void;
}

export function RecordsTable({ page, size, onPageChange }: RecordsTableProps) {
  const t = useT();
  const [sorting, setSorting] = useState<SortingState>([]);
  const sort = sorting[0] ? `${sorting[0].id}:${sorting[0].desc ? "desc" : "asc"}` : undefined;
  const records = useRecords(page, size, sort);

  const columns = useMemo<ColumnDef<RecordOut>[]>(
    () => [
      {
        accessorKey: "prod_date",
        header: t("records.recordsTable.colDate"),
        cell: (info) => <span className="font-mono text-xs">{info.getValue<string | null>() ?? "—"}</span>,
      },
      {
        accessorKey: "shift",
        header: t("records.recordsTable.colShift"),
        cell: (info) => {
          const v = info.getValue<number | null>();
          return v === null ? "—" : t(`shift.${v}`);
        },
      },
      {
        accessorKey: "station_name",
        header: t("records.recordsTable.colStation"),
        cell: (info) => info.getValue<string | null>() ?? "—",
      },
      {
        accessorKey: "work_order_no",
        header: t("records.recordsTable.colWorkOrder"),
        cell: (info) => <span className="font-mono text-xs">{info.getValue<string | null>() ?? "—"}</span>,
      },
      {
        accessorKey: "produced_qty",
        header: t("records.recordsTable.colProduced"),
        cell: (info) => (
          <span className="tabular-nums">{info.getValue<number | null>() ?? 0}</span>
        ),
      },
      {
        accessorKey: "scrap_qty",
        header: t("records.recordsTable.colScrap"),
        cell: (info) => (
          <span className="tabular-nums text-oee-low">{info.getValue<number | null>() ?? 0}</span>
        ),
      },
      {
        accessorKey: "oee",
        header: "OEE",
        cell: (info) => {
          const v = info.getValue<number | null>();
          return v === null ? "—" : (
            <span className={`tabular-nums ${oeeColorClass(v)}`}>{v.toFixed(1)}%</span>
          );
        },
      },
      {
        accessorKey: "validation_status",
        header: t("records.recordsTable.colStatus"),
        cell: (info) => {
          const s = info.getValue<string>();
          return <Badge tone={statusTone(s)}>{t(`status.${s}`)}</Badge>;
        },
      },
      {
        accessorKey: "issue_count",
        header: t("records.recordsTable.colIssue"),
        cell: (info) => {
          const n = info.getValue<number>();
          return n > 0 ? <Badge tone="destructive">{n}</Badge> : <span className="text-muted-foreground">0</span>;
        },
      },
    ],
    [t],
  );

  const table = useReactTable({
    data: records.data?.items ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const total = records.data?.total ?? 0;
  const totalPages = records.data?.total_pages ?? 1;

  return (
    <div className="rounded-lg border bg-card text-card-foreground">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b text-left text-muted-foreground">
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="cursor-pointer p-2 select-none"
                  onClick={h.column.getToggleSortingHandler()}
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                  {h.column.getIsSorted() === "asc" ? " ▲" : h.column.getIsSorted() === "desc" ? " ▼" : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {records.isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={`s_${i}`} className="border-b">
                <td colSpan={columns.length} className="p-2">
                  <Skeleton className="h-6 w-full" />
                </td>
              </tr>
            ))
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-muted-foreground">
                {t("records.recordsTable.emptyFiltered")}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-muted/50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t p-2 text-xs text-muted-foreground">
        <span>
          {t("records.recordsTable.total")}: <strong className="text-foreground">{total}</strong> ·{" "}
          {t("records.recordsTable.pageOf", { page, totalPages })}
        </span>
        <span className="flex gap-2">
          <button
            type="button"
            className="rounded border bg-background px-2 py-1 text-foreground disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            {t("records.recordsTable.prev")}
          </button>
          <button
            type="button"
            className="rounded border bg-background px-2 py-1 text-foreground disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            {t("records.recordsTable.next")}
          </button>
        </span>
      </div>
    </div>
  );
}
