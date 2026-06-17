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
import { useRecords } from "./useRecords";
import type { RecordOut } from "./types";

const SHIFT_LABELS: Record<number, string> = { 1: "Sabah", 2: "Öğle", 3: "Gece" };

export interface RecordsTableProps {
  page: number;
  size: number;
  onPageChange: (p: number) => void;
}

export function RecordsTable({ page, size, onPageChange }: RecordsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const sort = sorting[0] ? `${sorting[0].id}:${sorting[0].desc ? "desc" : "asc"}` : undefined;
  const records = useRecords(page, size, sort);

  const columns = useMemo<ColumnDef<RecordOut>[]>(
    () => [
      {
        accessorKey: "prod_date",
        header: "Tarih",
        cell: (info) => <span className="font-mono text-xs">{info.getValue<string | null>() ?? "—"}</span>,
      },
      {
        accessorKey: "shift",
        header: "Vardiya",
        cell: (info) => {
          const v = info.getValue<number | null>();
          return v === null ? "—" : SHIFT_LABELS[v] ?? v;
        },
      },
      {
        accessorKey: "station_name",
        header: "İstasyon",
        cell: (info) => info.getValue<string | null>() ?? "—",
      },
      {
        accessorKey: "work_order_no",
        header: "İş Emri",
        cell: (info) => <span className="font-mono text-xs">{info.getValue<string | null>() ?? "—"}</span>,
      },
      {
        accessorKey: "produced_qty",
        header: "Üretim",
        cell: (info) => (
          <span className="tabular-nums">{info.getValue<number | null>() ?? 0}</span>
        ),
      },
      {
        accessorKey: "scrap_qty",
        header: "Fire",
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
        header: "Durum",
        cell: (info) => {
          const s = info.getValue<string>();
          return <Badge tone={statusTone(s)}>{s}</Badge>;
        },
      },
      {
        accessorKey: "issue_count",
        header: "Issue",
        cell: (info) => {
          const n = info.getValue<number>();
          return n > 0 ? <Badge tone="destructive">{n}</Badge> : <span className="text-muted-foreground">0</span>;
        },
      },
    ],
    [],
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
                Filtreye uyan kayıt yok.
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
          Toplam: <strong className="text-foreground">{total}</strong> · Sayfa {page} / {totalPages}
        </span>
        <span className="flex gap-2">
          <button
            type="button"
            className="rounded border bg-background px-2 py-1 text-foreground disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Önceki
          </button>
          <button
            type="button"
            className="rounded border bg-background px-2 py-1 text-foreground disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Sonraki
          </button>
        </span>
      </div>
    </div>
  );
}
