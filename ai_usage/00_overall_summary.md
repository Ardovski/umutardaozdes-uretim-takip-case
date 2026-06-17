# 00 — AI Kullanım Envanteri (Overall Summary)

> Case Study §8 — tüm AI etkileşimlerinin tek bakışta özeti.
> Her satır `prompts/NN_*.md` ile detaylandırılır.

**Son güncelleme:** 2026-06-17

## Kullanılan AI araçları

| AI | Versiyon / Plan | Rol |
|----|-----------------|-----|
| **opencode CLI** (MiniMax-M3) | MiniMax-M3 | Faz 0–6 uçtan uca implementasyon: DB şema, ingestion, 47 kural validasyon motoru, records/filter, analytics/dashboard, sync, UI polish, README, CHECKLIST, CSV mojibake düzeltme, API boot fix. |
| **Claude Code** (Claude Sonnet/Opus) | Claude (Code) | Önceki oturum: monorepo iskeleti, dokümantasyon iskeleti, validasyon kural tasarımı, temel API iskeleti. Bu oturumda referans olarak kullanıldı, aktif üretim opencode. |
| **ChatGPT** | — | Kullanılmadı (kullanıcı tercihi). |
| **Copilot** | — | Kullanılmadı (kullanıcı tercihi). |

## Prompt log indeksi

> `prompts/NN_*.md` ekledikçe buraya bir satır ekle.
> Format: `| # | konu | AI | tarih | durum |`

| # | Konu | AI | Tarih | Durum |
|---|------|----|-------|-------|
| 01 | db_schema_validation | opencode (MiniMax) | 2026-06-17 | ✅ kayıtlı |
| 02 | ingestion_csv | opencode (MiniMax) | 2026-06-17 | ✅ kayıtlı |
| 03 | validation_engine_47_rules | opencode (MiniMax) | 2026-06-17 | ✅ kayıtlı |
| 03-fix | validation_schema_sync | opencode (MiniMax) | 2026-06-17 | ✅ kayıtlı |
| 04 | records_filtering | opencode (MiniMax) | 2026-06-17 | ✅ kayıtlı |
| 05 | analytics_dashboard | opencode (MiniMax) | 2026-06-17 | ✅ kayıtlı |
| 06 | sync_target_api | opencode (MiniMax) | 2026-06-17 | ✅ kayıtlı |
| 07 | validation_records_ui_polish | opencode (MiniMax) | 2026-06-17 | ✅ kayıtlı |
| 08 | readme_checklist_mojibake | opencode (MiniMax) | 2026-06-17 | ✅ kayıtlı |

## Transcript'ler (AI başına ayrı klasör)

> Ham sohbet dökümleri `transcripts/<kaynak>/...` altında. `make ai-backup`
> veya `scripts/backup-sessions.sh` ile otomatik toplanır.

| Kaynak | Tarih | Dosya | Mesaj sayısı | Açıklama |
|--------|-------|-------|--------------|----------|
| Claude Code | 2026-06-17 | transcripts/claude/claude-2026-06-17-00718bb2.md | 83 | Önceki oturum — monorepo iskeleti |
| Claude Code | 2026-06-17 | transcripts/claude/claude-2026-06-17-29415767.md | 13 | Önceki oturum — validation tasarım |
| Claude Code | 2026-06-17 | transcripts/claude/claude-2026-06-17-81c5a360.md | 261 | Önceki oturum — büyük oturum |
| MiniMax (opencode) | 2026-06-17 | transcripts/minimax/minimax-2026-06-17-ses129a4.md | 107 | DB şema + ingestion |
| MiniMax (opencode) | 2026-06-17 | transcripts/minimax/minimax-2026-06-17-ses12943.md | 147 | Validation + records + analytics |
| MiniMax (opencode) | 2026-06-17 | transcripts/minimax/minimax-2026-06-17-ses12939.md | 60 | Sync + UI polish + README |

> 2 boş oturum atlandı (placeholder shell).

## Ekran görüntüleri

> Case teslim sonrası bu klasöre 4 ekran görüntüsü eklenecek:
> Dashboard, Import preview, Validation report, Sync history.

| # | Sayfa | Dosya | Durum |
|---|-------|-------|-------|
| 1 | Dashboard | screenshots/01-dashboard.png | _(case teslim sonrası)_ |
| 2 | Import | screenshots/02-import.png | _(case teslim sonrası)_ |
| 3 | Validation | screenshots/03-validation.png | _(case teslim sonrası)_ |
| 4 | Sync | screenshots/04-sync.png | _(case teslim sonrası)_ |

## Şeffaflık notu

- Bu repodaki kod/doc'ların büyük kısmı opencode (MiniMax-M3) ile üretildi.
- Her prompt için `prompts/NN_*.md` → "Doğrulama" bölümü yazıldı.
- Kod üretiminde uygulanan kısıtlar: feature izolasyonu (ESLint boundaries),
  `any` yasağı (TS), hardcoded renk yasağı (Tailwind token), secret
  sızıntısı yasağı (TARGET_API_KEY yalnız `.env` → backend; log'da REDACTED).
- AI ürettiği kodu kopyalamadan önce **anlaşıldı**; mülakat sunumunda her
  satır açıklanabilir (örn: validation motoru run_validation iki geçişli,
  idempotency SHA-256 canonical JSON, retry matrisi 429+5xx, etc).

## Otomasyon

- `make ai-prompt` → yeni prompt log şablonu oluşturur (`prompts/NN_<konu>.md`).
- `make ai-export` → transcript'leri tarar + `transcripts/`'e yazar.
- `make ai-backup` → yukarıdaki ikisini çağırır + `ai_usage/`'i commit
  edilebilir hale getirir (push YAPMAZ).
- `make ai-sync` → `AGENTS.md` ↔ `CLAUDE.md` senkronizasyonu.
