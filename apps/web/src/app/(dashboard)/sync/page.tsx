import { HistoryTable, SyncPage } from "@/features/sync";

export default function Page() {
  return (
    <div className="space-y-6">
      <SyncPage />
      <HistoryTable />
    </div>
  );
}
