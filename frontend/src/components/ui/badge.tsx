"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "default" | "success" | "warning" | "destructive" | "info" | "outline";

const toneClass: Record<BadgeTone, string> = {
  default: "bg-primary text-primary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  info: "bg-info text-white",
  outline: "border bg-background text-foreground",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}

export function severityTone(severity: string): BadgeTone {
  switch (severity) {
    case "error":
      return "destructive";
    case "warning":
      return "warning";
    case "info":
      return "info";
    default:
      return "outline";
  }
}

export function statusTone(status: string): BadgeTone {
  switch (status) {
    case "valid":
      return "success";
    case "suspect":
      return "warning";
    case "rejected":
      return "destructive";
    case "fixed":
      return "info";
    case "success":
      return "success";
    case "failed":
      return "destructive";
    case "retrying":
      return "warning";
    case "pending":
      return "outline";
    default:
      return "outline";
  }
}
