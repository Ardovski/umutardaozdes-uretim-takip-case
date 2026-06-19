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

// Açık/koyu temada da okunur: her zaman katı `bg-card` + ton-renkli kenarlık;
// gövde `text-card-foreground`, başlık ton rengi. (Eski hata: `bg-*/10` (beyaz
// temada ~beyaz) üzerine `text-*-foreground` (beyaz) → açık temada görünmezdi.)
const toneClass: Record<NonNullable<Toast["tone"]>, string> = {
  default: "border-border bg-card text-card-foreground",
  success: "border-success bg-card text-card-foreground",
  destructive: "border-destructive bg-card text-card-foreground",
  warning: "border-warning bg-card text-card-foreground",
};

const titleToneClass: Record<NonNullable<Toast["tone"]>, string> = {
  default: "text-foreground",
  success: "text-success",
  destructive: "text-destructive",
  warning: "text-warning",
};

export function Toaster() {
  const ctx = React.useContext(ToastCtx);
  if (!ctx) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {ctx.toasts.map((t) => {
        const tone = t.tone ?? "default";
        return (
          <div
            key={t.id}
            className={cn(
              "min-w-[260px] max-w-sm rounded-md border-l-4 border p-3 shadow-md",
              toneClass[tone],
            )}
            role="status"
          >
            {t.title ? (
              <div className={cn("text-sm font-semibold", titleToneClass[tone])}>{t.title}</div>
            ) : null}
            {t.description ? (
              <div className="mt-0.5 text-xs text-muted-foreground">{t.description}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
