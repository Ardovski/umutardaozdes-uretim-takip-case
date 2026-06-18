"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  className?: string;
}

export function Slider({ value, min, max, step = 1, onChange, className }: SliderProps) {
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn("h-2 w-full cursor-pointer appearance-none rounded-md bg-muted accent-primary", className)}
    />
  );
}
