"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: React.ReactNode;
}

export function Checkbox({ checked, onChange, disabled, className, label }: CheckboxProps) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2 text-sm", disabled && "opacity-50", className)}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-input accent-primary"
      />
      {label ? <span className="text-foreground">{label}</span> : null}
    </label>
  );
}
