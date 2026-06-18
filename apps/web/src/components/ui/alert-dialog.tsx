"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AlertDialogContextValue {
  open: boolean;
  setOpen: (next: boolean) => void;
}

const AlertDialogCtx = React.createContext<AlertDialogContextValue | null>(null);

function useAlertDialogCtx(): AlertDialogContextValue {
  const ctx = React.useContext(AlertDialogCtx);
  if (!ctx) throw new Error("AlertDialog bileşenleri <AlertDialog> içinde olmalı");
  return ctx;
}

export interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (next: boolean) => void;
  children: React.ReactNode;
}

export function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  const [internal, setInternal] = React.useState(false);
  const isControlled = open !== undefined;
  const current = isControlled ? open : internal;
  const setOpen = React.useCallback(
    (next: boolean) => {
      onOpenChange?.(next);
      if (!isControlled) setInternal(next);
    },
    [isControlled, onOpenChange],
  );
  return (
    <AlertDialogCtx.Provider value={{ open: current, setOpen }}>{children}</AlertDialogCtx.Provider>
  );
}

export function AlertDialogContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = useAlertDialogCtx();
  React.useEffect(() => {
    if (!ctx.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") ctx.setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [ctx]);
  if (!ctx.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" aria-hidden onClick={() => ctx.setOpen(false)} />
      <div
        role="alertdialog"
        aria-modal="true"
        className={cn(
          "relative z-10 w-full max-w-md rounded-lg border bg-card p-6 text-card-foreground shadow-lg",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function AlertDialogHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("mb-4 flex flex-col gap-1", className)}>{children}</div>;
}

export function AlertDialogTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>;
}

export function AlertDialogDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

export function AlertDialogFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("mt-4 flex justify-end gap-2", className)}>{children}</div>;
}

export function AlertDialogCancel({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const ctx = useAlertDialogCtx();
  return (
    <Button
      variant="outline"
      onClick={() => {
        onClick?.();
        ctx.setOpen(false);
      }}
    >
      {children}
    </Button>
  );
}

export function AlertDialogAction({
  children,
  onClick,
  variant = "destructive",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive";
}) {
  const ctx = useAlertDialogCtx();
  return (
    <Button
      variant={variant}
      onClick={() => {
        onClick?.();
        ctx.setOpen(false);
      }}
    >
      {children}
    </Button>
  );
}
