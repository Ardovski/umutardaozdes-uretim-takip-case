"use client";

import { Suspense } from "react";
import { useT } from "@/lib/i18n";
import { ImportPage } from "./ImportPage";

function ImportPageFallback() {
  const t = useT();
  return (
    <main className="container mx-auto py-8 text-sm text-muted-foreground">
      {t("common.loading")}
    </main>
  );
}

export function ImportRoute() {
  return (
    <Suspense fallback={<ImportPageFallback />}>
      <ImportPage />
    </Suspense>
  );
}
