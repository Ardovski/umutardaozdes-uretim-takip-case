"use client";

import { Suspense } from "react";
import { RecordsPage } from "./RecordsPage";

function RecordsPageFallback() {
  return (
    <main className="container mx-auto py-8 text-sm text-muted-foreground">Yükleniyor…</main>
  );
}

export function RecordsRoute() {
  return (
    <Suspense fallback={<RecordsPageFallback />}>
      <RecordsPage />
    </Suspense>
  );
}
