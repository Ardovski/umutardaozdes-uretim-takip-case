"use client";

import { Suspense } from "react";
import { useT } from "@/lib/i18n";
import { RecordsPage } from "./RecordsPage";

function RecordsPageFallback() {
  const t = useT();
  return (
    <main className="container mx-auto py-8 text-sm text-muted-foreground">{t("common.loading")}</main>
  );
}

export function RecordsRoute() {
  return (
    <Suspense fallback={<RecordsPageFallback />}>
      <RecordsPage />
    </Suspense>
  );
}
