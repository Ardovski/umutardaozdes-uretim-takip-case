# Mimari — Frontend (Next.js + shadcn/ui)

## Stack
- **Next.js (App Router) + TypeScript** — routing + SSR/CSR
- **shadcn/ui + Tailwind** — bileşenler + token-tabanlı tema (bkz. [`theme.md`](theme.md))
- **TanStack Query** — server-state (FastAPI'den veri çekme, cache, retry)
- **Zustand** — UI-state (filtre durumu, seçili kayıtlar, modal)
- **Recharts** — OEE trend / dağılım grafikleri
- **react-hook-form + zod** — form + client-side doğrulama
- **TanStack Table** — kayıt grid'i (filtre/sıralama/sayfalama)

## Sayfa Yapısı (App Router)
```
src/app/
├── layout.tsx            # kök layout: tema sağlayıcı, sidebar, query provider
├── page.tsx              # Dashboard (KPI + grafikler)
├── import/page.tsx       # CSV yükleme + önizleme + import özeti
├── records/page.tsx      # filtre + tablo + CSV export
├── validation/page.tsx   # şüpheli kayıtlar + düzelt/reddet + audit
└── sync/page.tsx         # (gün, vardiya) gönderim + retry + geçmiş
```

## Feature-bazlı Organizasyon
```
src/features/<feature>/
├── components/    # feature'a özel bileşenler
├── hooks/         # useImport, useValidationIssues, useSyncStatus ...
├── api/           # bu feature'ın FastAPI çağrıları (TanStack Query)
└── types.ts
```
Feature'lar: `import`, `dashboard`, `records`, `validation`, `sync`.

## API İletişimi
- `src/lib/api/client.ts` — tek tip fetch wrapper (base URL = `NEXT_PUBLIC_API_URL`).
- `next.config.mjs` rewrites → `/api/backend/*` ⇒ `http://localhost:8000/*` (CORS'suz dev).
- Tüm sunucu mutasyonları (import, fix, sync) TanStack Query `useMutation` ile.

## Bileşen Katmanları
1. `components/ui/*` — shadcn primitive'leri (Button, Card, Table, Dialog, Slider, Toast...).
2. `features/*/components/*` — domain bileşenleri (ValidationIssueRow, OeeTrendChart, KpiCard...).
3. `app/*/page.tsx` — sayfa kompozisyonu.

## UI/UX Öncelikleri (case %10)
- **Net hata bildirimi:** validation report tablosu (record_id, hata tipi, alan, aksiyon) +
  satır-içi renk kodu (severity token'ları → bkz. theme).
- **İlerleme geri bildirimi:** import sırasında progress, sync sırasında durum.
- **Toplu işlem:** şüpheli kayıtları toplu seç → düzelt/reddet.
- Erişilebilirlik: shadcn/Radix tabanlı (klavye + ARIA hazır).
