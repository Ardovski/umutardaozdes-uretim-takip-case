"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandContextValue {
  query: string;
  setQuery: (q: string) => void;
}

const CommandCtx = React.createContext<CommandContextValue | null>(null);

function useCommandCtx(): CommandContextValue {
  const ctx = React.useContext(CommandCtx);
  if (!ctx) throw new Error("Command bileşenleri <Command> içinde olmalı");
  return ctx;
}

export function Command({ children, className }: { children: React.ReactNode; className?: string }) {
  const [query, setQuery] = React.useState("");
  return (
    <CommandCtx.Provider value={{ query, setQuery }}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </CommandCtx.Provider>
  );
}

export function CommandInput({ className, placeholder }: { className?: string; placeholder?: string }) {
  const ctx = useCommandCtx();
  return (
    <div className="flex items-center gap-1.5 border-b px-2">
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        value={ctx.query}
        onChange={(e) => ctx.setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "flex h-9 w-full bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground",
          className,
        )}
      />
    </div>
  );
}

export function CommandList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div role="listbox" className={cn("max-h-[300px] overflow-y-auto p-1", className)}>
      {children}
    </div>
  );
}

export interface CommandItemProps {
  value: string;
  onSelect?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function CommandItem({ value, onSelect, children, className }: CommandItemProps) {
  const ctx = useCommandCtx();
  const matches = ctx.query === "" || value.toLowerCase().includes(ctx.query.toLowerCase());
  if (!matches) return null;
  return (
    <div
      role="option"
      aria-selected={false}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.();
        }
      }}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CommandGroup({
  children,
  heading,
  className,
}: {
  children: React.ReactNode;
  heading?: string;
  className?: string;
}) {
  return (
    <div className={cn("py-1", className)}>
      {heading ? (
        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">{heading}</div>
      ) : null}
      {children}
    </div>
  );
}
