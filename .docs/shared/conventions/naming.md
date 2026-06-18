# İsimlendirme Standartları (Klasör & Dosya)

> Tutarlılık = okunabilirlik + AI asistanlarının doğru tahmini. Bu kurallar tüm repoda geçerli.
> Özet kart en altta.

## 1. Klasörler

| Bağlam | Kural | Örnek |
|--------|-------|-------|
| Genel dizinler | `kebab-case` | `validation-rules`, `data-quality` |
| **Python paketleri** (backend) | `snake_case` (tire YASAK — geçersiz identifier) | `features/validation`, `features/api_sync` |
| Frontend dizinleri (frontend) | `kebab-case` | `features/import`, `lib/api` |
| Feature adları | tekil domain ismi | `validation`, `sync`, `records` (çoğul değil `record`) |
| Docs / roadmap | `kebab-case` | `.docs/data`, `.roadmap/phases` |

> İki tarafta da feature adları **aynı** olmalı: backend `features/validation` → frontend
> `features/validation`. (Eşleme kolaylığı.)

## 2. Dosyalar — Python (backend)

| Tür | Kural | Örnek |
|-----|-------|-------|
| Modül | `snake_case.py` | `service.py`, `target_client.py`, `oee_calculator.py` |
| Kural dosyaları | `snake_case.py`, kategori önekli | `consistency_rules.py`, `range_rules.py` |
| Test | `test_*.py` | `test_consistency_rules.py` |
| Sınıf | `PascalCase` | `class ValidationEngine`, `class ImportSummary` |
| Fonksiyon/değişken | `snake_case` | `validate_record()`, `row_hash` |
| Sabit | `UPPER_SNAKE` | `OEE_TOLERANCE`, `MAX_SHIFT_MINUTES` |
| Pydantic şema | `PascalCase` + amaç soneki | `RecordCreate`, `ImportSummaryOut`, `SyncResult` |
| SQLAlchemy model | `PascalCase` tekil | `ProductionRecord`, `ValidationIssue` |

## 3. Dosyalar — TypeScript (frontend)

| Tür | Kural | Örnek |
|-----|-------|-------|
| React bileşeni (domain) | `PascalCase.tsx` | `KpiCard.tsx`, `ValidationTable.tsx`, `OeeTrendChart.tsx` |
| shadcn/ui primitifleri | `kebab-case.tsx` (shadcn konvansiyonu) | `components/ui/button.tsx`, `data-table.tsx` |
| Hook | `camelCase`, `use` önekli | `useImport.ts`, `useValidationIssues.ts` |
| Non-component modül (lib/util) | `kebab-case.ts` | `api-client.ts`, `query-keys.ts`, `format-date.ts` |
| Tip dosyası | `kebab-case.ts` | `domain.ts`, `validation-types.ts` |
| Store (Zustand) | `kebab-case.ts`, `.store` soneki ops. | `filters.store.ts` veya `filters.ts` |
| Sabit | `UPPER_SNAKE` (değer), dosya `kebab-case.ts` | `OEE_THRESHOLDS` içinde `constants.ts` |
| **Next.js App Router özel** | aynen küçük harf (framework şartı) | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts` |
| React bileşen adı (kod içi) | `PascalCase` | `function KpiCard()` |
| Değişken/fonksiyon | `camelCase` | `fetchRecords()`, `isLoading` |

> **Component dosyası = PascalCase, ama shadcn `ui/` = kebab-case.** Ayrım: `ui/` üçüncü-parti
> üretilen primitifler (shadcn CLI öyle üretir); `features/*/components` bizim domain bileşenlerimiz.

## 4. Veri / API / DB

| Bağlam | Kural | Örnek |
|--------|-------|-------|
| DB tablosu | `snake_case` çoğul | `production_records`, `validation_issues`, `sync_submissions` |
| DB kolonu | `snake_case` | `prod_date`, `unplanned_down`, `row_hash` |
| REST yolu | `kebab-case` çoğul kaynak | `/api/v1/imports`, `/validation/issues` |
| JSON alanı (iç API) | `snake_case` | `record_id`, `quality_breakdown` |
| Hedef API alanı | dış sözleşmeye uy | `oe_value`, `total_production_units` |
| Env değişkeni | `UPPER_SNAKE` | `TARGET_API_KEY`, `DATABASE_URL` |

## 5. Dokümanlar & Diğer

| Tür | Kural | Örnek |
|-----|-------|-------|
| Markdown doküman | `kebab-case.md` | `data-dictionary.md`, `target-api.md` |
| Konvansiyonel büyük harf | aynen | `README.md`, `CHECKLIST.md`, `CLAUDE.md`, `AGENTS.md` |
| ADR | `NNNN-kebab-baslik.md` | `0001-tech-stack.md` |
| AI usage log (§8) | `NN_snake_case.md` (case study formatı) | `01_database_schema.md` |
| AI transcript | `transcript-<kaynak>-YYYY-MM-DD-<id>.md` | `transcript-claude-2026-06-17-46229232.md` |
| Validasyon kural ID | `V-<kategori harfi><2 hane>` | `V-C01`, `V-M03`, `V-X02` |
| Git branch | `tip/kebab-konu` | `feat/validation-engine` |
| Commit | Conventional Commits | `feat(sync): idempotent submit` |

## 6. Genel İlkeler
- **Kısaltma yok** (yaygın olanlar hariç: `id`, `url`, `api`, `db`, `oee`, `csv`).
- **Tekil/çoğul tutarlı:** koleksiyon/endpoint çoğul (`records`), tekil varlık tekil (`record`).
- **Boolean** `is/has/can` önekli: `is_valid`, `hasIssues`.
- **Anlam önce:** `oee_recomputed` (doğru), `oee2` (yanlış).
- Aynı kavram her katmanda **aynı kök**: `validation` (klasör) → `ValidationIssue` (model) →
  `/validation/issues` (route) → `useValidationIssues` (hook).

---

## Özet Kart
```
Klasör:        kebab-case   (Python paketi → snake_case)
Python dosya:  snake_case.py            sınıf PascalCase   sabit UPPER_SNAKE
TS bileşen:    PascalCase.tsx           (shadcn ui/ → kebab-case.tsx)
TS modül/lib:  kebab-case.ts            hook useCamelCase.ts
Next.js özel:  page/layout/route.tsx    (küçük harf, framework şartı)
DB:            snake_case (tablo çoğul, kolon)   REST: /kebab-case çoğul
Doküman:       kebab-case.md            (README/CHECKLIST/CLAUDE/AGENTS aynen)
AI log (§8):   NN_snake_case.md         transcript-<kaynak>-YYYY-MM-DD-<id>.md
```
