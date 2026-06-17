import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind sınıflarını güvenle birleştir (shadcn standardı). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** OEE değerine göre semantic renk token'ı seç (≥85 good / 60–85 mid / <60 low). */
export function oeeColorClass(oee: number): string {
  if (oee >= 85) return "text-oee-good";
  if (oee >= 60) return "text-oee-mid";
  return "text-oee-low";
}
