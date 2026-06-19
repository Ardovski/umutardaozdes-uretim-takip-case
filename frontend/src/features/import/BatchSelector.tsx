"use client";

import { useState } from "react";
import { Check, ChevronDown, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/toast";
import { useT } from "@/lib/i18n";
import {
  useActiveBatch,
  useBatches,
  useActivateBatch,
  useDeleteBatch,
} from "./useBatch";

export function BatchSelector() {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const batches = useBatches();
  const active = useActiveBatch();
  const activate = useActivateBatch();
  const remove = useDeleteBatch();
  const toast = useToast();
  const t = useT();

  const list = batches.data ?? [];
  const confirmTarget = list.find((b) => b.id === confirmDelete) ?? null;

  const onActivate = (id: number) => {
    activate.mutate(id, {
      onSuccess: (b) => {
        toast.push({
          tone: "success",
          title: t("import.batchSelector.activateSuccess"),
          description: b.filename,
        });
        setOpen(false);
      },
      onError: () =>
        toast.push({ tone: "destructive", title: t("import.batchSelector.activateError") }),
    });
  };

  const onConfirmDelete = () => {
    if (!confirmTarget) return;
    const name = confirmTarget.filename;
    remove.mutate(confirmTarget.id, {
      onSuccess: () =>
        toast.push({ tone: "success", title: t("import.batchSelector.deleteSuccess"), description: name }),
      onError: () => toast.push({ tone: "destructive", title: t("import.batchSelector.deleteError") }),
    });
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger variant="outline" className="w-[300px] justify-between gap-2">
          <span className="flex items-center gap-2 truncate">
            {active.data ? (
              <>
                <Check className="h-3.5 w-3.5 shrink-0 text-oee-good" />
                <span className="truncate">{active.data.filename}</span>
              </>
            ) : (
              <span className="text-muted-foreground">{t("import.batchSelector.selectPlaceholder")}</span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder={t("import.batchSelector.searchPlaceholder")} />
            <CommandList>
              {list.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  {t("import.batchSelector.empty")}
                </div>
              ) : (
                list.map((b) => (
                  <CommandItem
                    key={b.id}
                    value={`${b.filename} ${b.id}`}
                    onSelect={() => onActivate(b.id)}
                  >
                    <div className="flex w-full items-center gap-2">
                      <div className="flex flex-1 flex-col items-start overflow-hidden">
                        <div className="flex w-full items-center gap-2">
                          <span className="truncate text-sm font-medium">
                            {b.filename}
                          </span>
                          {b.is_active ? (
                            <Badge tone="success" className="shrink-0">
                              {t("import.batchSelector.activeBadge")}
                            </Badge>
                          ) : null}
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">
                          {b.imported_rows}/{b.total_rows} {t("import.batchSelector.rows")} · {t(`status.${b.status}`)}
                        </span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(b.id);
                        }}
                        aria-label={t("import.batchSelector.deleteAria")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CommandItem>
                ))
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <AlertDialog
        open={confirmDelete !== null}
        onOpenChange={(next) => {
          if (!next) setConfirmDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("import.batchSelector.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-mono">{confirmTarget?.filename ?? ""}</span>{" "}
              {t("import.batchSelector.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("import.batchSelector.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete}>{t("import.batchSelector.confirmDelete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
