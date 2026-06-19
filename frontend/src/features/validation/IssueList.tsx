"use client";

import { useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Badge, severityTone } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/lib/i18n";
import { useIssues } from "./useValidation";
import type { ValidationIssue } from "./types";

export interface IssueListProps {
  recordStatus?: string;
  onSelect: (issue: ValidationIssue) => void;
}

export function IssueList({ recordStatus, onSelect }: IssueListProps) {
  const t = useT();
  const filter = useMemo(() => ({ record_status: recordStatus }), [recordStatus]);
  const issues = useIssues(filter);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<ValidationIssue>[]>(
    () => [
      {
        accessorKey: "record_id",
        header: "Record",
        cell: (info) => <span className="font-mono text-xs">#{info.getValue<number>()}</span>,
      },
      {
        accessorKey: "rule_id",
        header: t("validation.issueList.rule"),
        cell: (info) => <span className="font-mono text-xs">{info.getValue<string>()}</span>,
      },
      {
        accessorKey: "severity",
        header: t("validation.issueList.severity"),
        cell: (info) => {
          const s = info.getValue<string>();
          return <Badge tone={severityTone(s)}>{t(`severity.${s}`)}</Badge>;
        },
      },
      {
        accessorKey: "category",
        header: t("validation.issueList.category"),
        cell: (info) => <Badge tone="outline">{info.getValue<string>()}</Badge>,
      },
      {
        accessorKey: "fields",
        header: t("validation.issueList.fields"),
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">
            {info.getValue<string | null>() ?? t("common.none")}
          </span>
        ),
      },
      {
        accessorKey: "message",
        header: t("validation.issueList.message"),
        cell: (info) => <span className="line-clamp-2">{info.getValue<string>()}</span>,
      },
      {
        accessorKey: "suggested_action",
        header: t("validation.issueList.action"),
        cell: (info) => <Badge tone="outline">{info.getValue<string>()}</Badge>,
      },
    ],
    [t],
  );

  const table = useReactTable({
    data: issues.data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
          {issues.isLoading ? (
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
                {t("validation.issueList.empty")}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="cursor-pointer border-b hover:bg-muted/50"
                onClick={() => onSelect(row.original)}
              >
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
    </div>
  );
}
