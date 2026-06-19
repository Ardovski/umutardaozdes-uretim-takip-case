"use client";

/**
 * Client-side logger — 3 seviye (info/warning/error) + in-memory ring buffer.
 *
 * Toast sistemi kullanıcıya bildirim verir; bu logger **geliştirici/debug**
 * amaçlıdır. Sayfa açıkken son 200 log kaydını tutar; UI debug paneli veya
 * e2e test harness tarafından okunabilir.
 *
 * **No-console** ESLint kuralı bu modülü yakalamaz çünkü burası merkezi
 * log adapter'dır; kendi içinde `console.*` çağrıları bilinçli ve seviye
 * filtrelidir (production'da info'lar kapatılır).
 *
 * Production'da `download()` ile indirilebilir.
 */

export type LogLevel = "info" | "warning" | "error";

export interface LogEntry {
  ts: string; // ISO timestamp
  level: LogLevel;
  scope: string; // module/scope name
  message: string;
  data?: unknown;
}

const RING_BUFFER_SIZE = 200;

let ringBuffer: LogEntry[] = [];
const listeners = new Set<(entries: LogEntry[]) => void>();

function emit(entry: LogEntry) {
  ringBuffer.push(entry);
  if (ringBuffer.length > RING_BUFFER_SIZE) ringBuffer.shift();
  listeners.forEach((fn) => fn(ringBuffer.slice()));
  // Mirror to console (gated by level) — geliştirme için browser devtools.
  const line = `[${entry.level.toUpperCase()}] ${entry.scope}: ${entry.message}`;
  if (entry.level === "error") {
    console.error(line, entry.data ?? "");
  } else if (entry.level === "warning") {
    console.warn(line, entry.data ?? "");
  } else {
    console.info(line, entry.data ?? "");
  }
}

export const logger = {
  info(scope: string, message: string, data?: unknown) {
    emit({ ts: new Date().toISOString(), level: "info", scope, message, data });
  },
  warning(scope: string, message: string, data?: unknown) {
    emit({ ts: new Date().toISOString(), level: "warning", scope, message, data });
  },
  error(scope: string, message: string, data?: unknown) {
    emit({ ts: new Date().toISOString(), level: "error", scope, message, data });
  },
  /** Tüm in-memory log'ları döndür (UI debug paneli için). */
  entries(): LogEntry[] {
    return ringBuffer.slice();
  },
  /** Yeni entry eklendikçe çağrılır. */
  subscribe(fn: (entries: LogEntry[]) => void): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  /** Log'ları metin olarak indir (debug için). */
  download(filename: string = "frontend.log"): void {
    if (typeof window === "undefined") return;
    const text = ringBuffer
      .map((e) => `${e.ts} | ${e.level.toUpperCase().padEnd(7)} | ${e.scope} | ${e.message}`)
      .join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
  /** Test için buffer temizleme. */
  clear(): void {
    ringBuffer = [];
    listeners.forEach((fn) => fn([]));
  },
};
