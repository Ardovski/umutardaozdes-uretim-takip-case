"use client";

import * as React from "react";
import { messages, type Locale } from "./messages";

const STORAGE_KEY = "locale";
const DEFAULT_LOCALE: Locale = "tr";

export type TranslateVars = Record<string, string | number>;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: TranslateVars) => string;
}

const LocaleCtx = React.createContext<LocaleContextValue | null>(null);

function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // SSR + ilk render: DEFAULT (tr). Hydrate sonrası localStorage'tan oku.
  const [locale, setLocaleState] = React.useState<Locale>(DEFAULT_LOCALE);

  React.useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "tr" || saved === "en") setLocaleState(saved);
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = React.useCallback(
    (key: string, vars?: TranslateVars): string => {
      const dict = messages[locale] ?? messages.tr;
      const raw = dict[key] ?? messages.tr[key] ?? key;
      return interpolate(raw, vars);
    },
    [locale],
  );

  const value = React.useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = React.useContext(LocaleCtx);
  if (!ctx) throw new Error("useLocale <LocaleProvider> içinde kullanılmalı");
  return ctx;
}

/** Kısayol: yalnız `t` gerekiyorsa. */
export function useT(): LocaleContextValue["t"] {
  return useLocale().t;
}
