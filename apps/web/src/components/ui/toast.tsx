"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  tone?: "default" | "success" | "destructive" | "warning";
}

interface ToastContextValue {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastCtx = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const push = React.useCallback((t: Omit<Toast, "id">) => {
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4000);
  }, []);
  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);
  return (
    <ToastCtx.Provider value={{ toasts, push, dismiss }}>{children}</ToastCtx.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastCtx);
  if (!ctx) throw new Error("useToast <ToastProvider> içinde kullanılmalı");
  return ctx;
}

const toneClass: Record<NonNullable<Toast["tone"]>, string> = {
  default: "border bg-card text-card-foreground",
  success: "border-success/40 bg-success/10 text-success-foreground",
  destructive: "border-destructive/40 bg-destructive/10 text-destructive-foreground",
  warning: "border-warning/40 bg-warning/10 text-warning-foreground",
};

export function Toaster() {
  const ctx = React.useContext(ToastCtx);
  if (!ctx) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {ctx.toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "min-w-[260px] max-w-sm rounded-md border p-3 shadow-md",
            toneClass[t.tone ?? "default"],
          )}
          role="status"
        >
          {t.title ? <div className="text-sm font-medium">{t.title}</div> : null}
          {t.description ? <div className="mt-0.5 text-xs opacity-90">{t.description}</div> : null}
        </div>
      ))}
    </div>
  );
}
