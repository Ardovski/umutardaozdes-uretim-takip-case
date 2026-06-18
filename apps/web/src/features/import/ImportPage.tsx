"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BatchSelector } from "./BatchSelector";
import { ImportDropzone } from "./ImportDropzone";
import { useActiveBatch, useActivateBatch } from "./useBatch";

export function ImportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const active = useActiveBatch();
  const activate = useActivateBatch();
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const urlId = searchParams?.get("batch_id");
    if (!urlId) return;
    const numId = Number(urlId);
    if (!Number.isFinite(numId)) return;
    if (active.data && active.data.id === numId) return;
    activate.mutate(numId);
  }, [active.data, searchParams, activate]);

  useEffect(() => {
    const urlId = searchParams?.get("batch_id") ?? null;
    const activeId = active.data?.id != null ? String(active.data.id) : null;
    if (urlId === activeId) return;
    const url = activeId ? `${pathname}?batch_id=${activeId}` : pathname;
    router.replace(url, { scroll: false });
  }, [active.data, pathname, router, searchParams]);

  return (
    <main className="container mx-auto space-y-4 py-8">
      <header className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-sm text-muted-foreground">MAGNA · Import</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">CSV Import</h1>
        </div>
        <BatchSelector />
      </header>

      <ImportDropzone />
    </main>
  );
}
