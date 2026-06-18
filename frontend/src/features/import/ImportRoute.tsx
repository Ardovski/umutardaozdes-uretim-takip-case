"use client";

import { Suspense } from "react";
import { ImportPage } from "./ImportPage";

function ImportPageFallback() {
  return (
    <main className="container mx-auto py-8 text-sm text-muted-foreground">Yükleniyor…</main>
  );
}

export function ImportRoute() {
  return (
    <Suspense fallback={<ImportPageFallback />}>
      <ImportPage />
    </Suspense>
  );
}
