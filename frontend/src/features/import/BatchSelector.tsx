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

  const list = batches.data ?? [];
  const confirmTarget = list.find((b) => b.id === confirmDelete) ?? null;

  const onActivate = (id: number) => {
    activate.mutate(id, {
      onSuccess: (b) => {
        toast.push({
          tone: "success",
          title: "Aktif batch güncellendi",
          description: b.filename,
        });
        setOpen(false);
      },
      onError: () =>
        toast.push({ tone: "destructive", title: "Aktif batch güncellenemedi" }),
    });
  };

  const onConfirmDelete = () => {
    if (!confirmTarget) return;
    const name = confirmTarget.filename;
    remove.mutate(confirmTarget.id, {
      onSuccess: () =>
        toast.push({ tone: "success", title: "Batch silindi", description: name }),
      onError: () => toast.push({ tone: "destructive", title: "Batch silinemedi" }),
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
              <span className="text-muted-foreground">Batch seçin</span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Batch ara…" />
            <CommandList>
              {list.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Henüz batch yok
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
                              Aktif
                            </Badge>
                          ) : null}
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">
                          {b.imported_rows}/{b.total_rows} satır · {b.status}
                        </span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(b.id);
                        }}
                        aria-label="Sil"
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
            <AlertDialogTitle>Batch silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-mono">{confirmTarget?.filename ?? ""}</span> ve
              tüm kayıtları (validasyon/düzeltme dahil) kalıcı olarak silinir. Bu
              işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete}>Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
