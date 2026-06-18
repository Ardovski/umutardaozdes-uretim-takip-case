"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PopoverContextValue {
  open: boolean;
  setOpen: (next: boolean) => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

const PopoverCtx = React.createContext<PopoverContextValue | null>(null);

function usePopoverCtx(): PopoverContextValue {
  const ctx = React.useContext(PopoverCtx);
  if (!ctx) throw new Error("Popover bileşenleri <Popover> içinde olmalı");
  return ctx;
}

export interface PopoverProps {
  open?: boolean;
  onOpenChange?: (next: boolean) => void;
  children: React.ReactNode;
}

export function Popover({ open, onOpenChange, children }: PopoverProps) {
  const [internal, setInternal] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);
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
    <PopoverCtx.Provider value={{ open: current, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </PopoverCtx.Provider>
  );
}

export type PopoverTriggerProps = ButtonProps & { children?: React.ReactNode };

export function PopoverTrigger({ children, className, ...buttonProps }: PopoverTriggerProps) {
  const ctx = usePopoverCtx();
  return (
    <Button
      {...buttonProps}
      onClick={(e) => {
        buttonProps.onClick?.(e);
        ctx.setOpen(!ctx.open);
      }}
      ref={(node) => {
        ctx.triggerRef.current = node;
      }}
      className={className}
    >
      {children}
    </Button>
  );
}

export interface PopoverContentProps {
  className?: string;
  align?: "start" | "end" | "center";
  children: React.ReactNode;
}

export function PopoverContent({ className, align = "start", children }: PopoverContentProps) {
  const ctx = usePopoverCtx();
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!ctx.open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if (ctx.triggerRef.current?.contains(target)) return;
      ctx.setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") ctx.setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [ctx]);
  if (!ctx.open) return null;
  const alignClass =
    align === "end" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0";
  return (
    <div
      ref={ref}
      role="dialog"
      className={cn(
        "absolute top-full z-50 mt-1 min-w-[280px] rounded-md border bg-popover p-2 text-popover-foreground shadow-md",
        alignClass,
        className,
      )}
    >
      {children}
    </div>
  );
}
