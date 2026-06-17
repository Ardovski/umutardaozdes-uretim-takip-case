"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { IssueDetailDrawer } from "./IssueDetailDrawer";
import { IssueList } from "./IssueList";
import { useRunValidation, useValidationSummary } from "./useValidation";
import type { ValidationIssue } from "./types";

export function ValidationPage() {
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<ValidationIssue | null>(null);
  const summary = useValidationSummary();
  const run = useRunValidation();
  const toast = useToast();

  const recordStatus =
    tab === "suspect" ? "suspect" : tab === "rejected" ? "rejected" : undefined;

  const onRun = () => {
    run.mutate(undefined, {
      onSuccess: (d) =>
        toast.push({
          tone: "success",
          title: "Validasyon çalıştırıldı",
          description: `${d.record_count} kayıt değerlendirildi.`,
        }),
      onError: () =>
        toast.push({ tone: "destructive", title: "Validasyon başarısız" }),
    });
  };

  return (
    <main className="container mx-auto space-y-4 py-8">
      <header className="flex items-end justify-between">
        <div>
          <p className="font-mono text-sm text-muted-foreground">MAGNA · Validasyon</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Validation Issues</h1>
        </div>
        <Button onClick={onRun} disabled={run.isPending}>
          {run.isPending ? "Çalışıyor…" : "Tüm kayıtları doğrula"}
        </Button>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard
          label="Toplam"
          value={summary.data?.total_records ?? null}
          tone="default"
          loading={summary.isLoading}
        />
        <SummaryCard
          label="Valid"
          value={summary.data?.by_status?.valid ?? null}
          tone="success"
          loading={summary.isLoading}
        />
        <SummaryCard
          label="Suspect"
          value={summary.data?.by_status?.suspect ?? null}
          tone="warning"
          loading={summary.isLoading}
        />
        <SummaryCard
          label="Rejected"
          value={summary.data?.by_status?.rejected ?? null}
          tone="destructive"
          loading={summary.isLoading}
        />
      </section>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">Tümü</TabsTrigger>
          <TabsTrigger value="suspect">Şüpheli</TabsTrigger>
          <TabsTrigger value="rejected">Reddedildi</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <IssueList onSelect={setSelected} />
        </TabsContent>
        <TabsContent value="suspect">
          <IssueList recordStatus="suspect" onSelect={setSelected} />
        </TabsContent>
        <TabsContent value="rejected">
          <IssueList recordStatus="rejected" onSelect={setSelected} />
        </TabsContent>
      </Tabs>

      <IssueDetailDrawer issue={selected} onClose={() => setSelected(null)} />
    </main>
  );
}

function SummaryCard({
  label,
  value,
  tone,
  loading,
}: {
  label: string;
  value: number | null;
  tone: "default" | "success" | "warning" | "destructive";
  loading?: boolean;
}) {
  const toneText: Record<typeof tone, string> = {
    default: "text-foreground",
    success: "text-oee-good",
    warning: "text-oee-mid",
    destructive: "text-oee-low",
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <p className={`text-2xl font-semibold tabular-nums ${toneText[tone]}`}>
            {value ?? 0}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
