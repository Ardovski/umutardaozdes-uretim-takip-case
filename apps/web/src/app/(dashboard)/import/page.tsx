export default function Page() {
  return (
    <main className="container mx-auto space-y-2 py-8">
      <p className="font-mono text-sm text-muted-foreground">MAGNA · Import</p>
      <h1 className="text-3xl font-bold tracking-tight">CSV Import</h1>
      <p className="text-sm text-muted-foreground">
        CSV yükleme Faz 1&apos;de backend olarak hazır (<code className="font-mono">POST /api/v1/imports</code>).
        Dosya seçici ve progress UI bir sonraki iterasyonda. Şimdilik CLI: <code className="font-mono">make seed</code>.
      </p>
    </main>
  );
}
