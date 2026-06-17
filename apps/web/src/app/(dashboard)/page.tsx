// Walking skeleton landing — design token sistemini sergiler (Faz 0).
// Gerçek dashboard Faz 3'te. Burası yalnız "tema iyi ayarlandı mı" kanıtı.

const KPI = [
  { label: "Ortalama OEE", value: "—", hint: "Faz 3" },
  { label: "Toplam Üretim", value: "—", hint: "Faz 3" },
  { label: "Toplam Fire", value: "—", hint: "Faz 3" },
  { label: "Toplam Duruş", value: "—", hint: "Faz 3" },
];

const SEVERITIES = [
  { label: "Valid", cls: "bg-success text-success-foreground" },
  { label: "Şüpheli", cls: "bg-warning text-warning-foreground" },
  { label: "Reddedildi", cls: "bg-destructive text-destructive-foreground" },
  { label: "Düzeltildi", cls: "bg-info text-white" },
];

const OEE_BANDS = [
  { label: "≥ 85 (Dünya standardı)", cls: "text-oee-good", dot: "bg-oee-good" },
  { label: "60–85 (Tipik)", cls: "text-oee-mid", dot: "bg-oee-mid" },
  { label: "< 60 (İyileştir)", cls: "text-oee-low", dot: "bg-oee-low" },
];

export default function Home() {
  return (
    <main className="container mx-auto max-w-5xl py-12">
      <header className="mb-10">
        <p className="font-mono text-sm text-muted-foreground">MAGNA · Case Study</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Üretim Performans Takip</h1>
        <p className="mt-2 text-muted-foreground">
          CSV import · veri validasyonu · OEE dashboard · hedef API sync. Walking skeleton —
          tema token'ları aktif. Faz planı için <code className="font-mono">.roadmap/</code>.
        </p>
      </header>

      {/* KPI kartları (placeholder) */}
      <section className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {KPI.map((k) => (
          <div key={k.label} className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <p className="text-sm text-muted-foreground">{k.label}</p>
            <p className="mt-2 text-2xl font-semibold">{k.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.hint}</p>
          </div>
        ))}
      </section>

      {/* Token demo: severity */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Validasyon severity token'ları</h2>
        <div className="flex flex-wrap gap-2">
          {SEVERITIES.map((s) => (
            <span key={s.label} className={`rounded-md px-3 py-1 text-sm font-medium ${s.cls}`}>
              {s.label}
            </span>
          ))}
        </div>
      </section>

      {/* Token demo: OEE bantları */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">OEE bant token'ları</h2>
        <div className="flex flex-col gap-2">
          {OEE_BANDS.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${b.dot}`} />
              <span className={`text-sm font-medium ${b.cls}`}>{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-12 border-t pt-6 text-sm text-muted-foreground">
        <span className="font-mono">api: http://localhost:8000/docs</span>
        {"  ·  "}
        <span>Aday: Umut Arda Özdeş</span>
      </footer>
    </main>
  );
}
