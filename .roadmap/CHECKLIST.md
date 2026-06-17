# CHECKLIST — Yapıldı / Yapılmadı

> Tek bakışta ilerleme. `[x]` yapıldı · `[ ]` yapılmadı · `[~]` kısmen/devam.
> Her madde case study gereksinimine bağlı; güncel tutulur.

**Son güncelleme:** 2026-06-17

---

## Faz 0 — Temel & Kurulum
- [x] Git deposu başlatıldı (`git init`)
- [x] Monorepo iskeleti (`apps/api`, `apps/web`, `packages`, `data`, `ai_usage`)
- [x] Kök `Makefile` (`make help/setup/dev/test/lint/db-*`)
- [x] `.gitignore` (secret/venv/node_modules/runtime DB; `data/*.csv` hariç tutulmuyor)
- [x] `.env.example` (backend secret'ları, placeholder)
- [x] Kök `package.json` (workspaces)
- [x] `.editorconfig`, `.nvmrc`
- [x] Kök `README.md` (deliverable — zorunlu bölümler + placeholder ekran görüntüleri)
- [x] Backend scaffold boot (`app/main.py`, `core/config.py`, `/health`)
- [x] Frontend scaffold boot (Next.js + Tailwind + providers + landing)
- [x] `tailwind.config.ts` + `globals.css` (özel token'lar — severity/OEE/vardiya/grafik)
- [x] `next.config.mjs` proxy + `components.json` (shadcn init konfig)
- [~] shadcn/ui bileşenleri (config hazır; bileşenler `npx shadcn add` ile feature başına)
- [x] Backend core (logging, errors) + DB katmanı (5 tablo, session, init_db) + v1 router
- [x] Frontend lib temeli (api client, env, constants, query-keys, domain types)
- [x] `.docs` yapısı (shared / api / web) + dokümantasyon standardı + profesyonelleştirme
- [x] İsimlendirme standartları (`.docs/shared/conventions/naming.md`)
- [x] VS Code dosya yuvalama + workspace ayarları (`.vscode/`)
- [x] AI bağlam: `AGENTS.md` (MiniMax) + `CLAUDE.md` (senkron) + `make ai-sync`
- [x] Proje skill'leri (`.claude/skills/` — SKILL.md, MiniMax + Claude portable)
- [x] Hook'lar (`.githooks/pre-commit` + Claude opt-in `.claude/settings.json.example`)
- [x] ESLint yasakları (feature izolasyonu `boundaries` + no-restricted-imports/syntax + no-cycle + no-any) + ruff `print` yasağı
- [x] Feature mimarisi + yasaklar dokümanları (`web/feature-architecture.md`, `conventions/prohibitions.md`)
- [x] Bellek sistemi (`.ai/memory/`: project + tasks) + AGENTS.md §10 işaretçi (MiniMax + Claude)
- [ ] `make setup` + `make dev` doğrulandı (npm/pip install gerekiyor) — SIRADAKİ ADIM

## Faz 1 — Veri İçe Aktarma (Import) · 5.1
- [ ] CSV seç (drag-and-drop **veya** file picker)
- [ ] Yükleme öncesi önizleme (ilk 5–10 satır)
- [ ] Yükleme sırasında ilerleme durumu
- [ ] CSV parse (pandas) + normalize (tarih/ondalık/yüzde ölçeği)
- [ ] SQLite'a import (`import_batches` + `production_records`)
- [ ] `file_hash` ile aynı dosya duplicate kontrolü
- [ ] Import özeti: toplam / başarılı / reddedilen+sebep / şüpheli
- [ ] Import özetinde **kalite sorunları dökümü** (kategori bazında)
- [ ] *(Tercih)* Birden fazla CSV birleştirip yükleme

## Faz 2 — Validasyon Motoru · 5.4 (kritik · ağırlık %25)
- [ ] Kural motoru (`engine.py`) — saf fonksiyon kuralları
- [ ] Kategori A: Eksik/boş (V-M01…M07)
- [ ] Kategori B: Aralık dışı (V-R01…R10)
- [ ] Kategori C: Tutarsız ilişki (V-C01…C10) — OEE/Q/A çapraz kontrol
- [ ] Kategori D: Duplicate (V-D01…D04)
- [ ] Kategori E: Format (V-F01…F06) — normalize
- [ ] Kategori F: Domain/imkânsız (V-X01…X06)
- [ ] Otomatik validasyon (CSV yüklenince çalışır)
- [ ] Validation report: record_id + hata tipi + alan + önerilen aksiyon
- [ ] Severity/aksiyon ayrımı (reject vs warn) — yanlış pozitif önleme
- [ ] Şüpheli kayıtları toplu görüntüleme (UI)
- [ ] Manuel düzeltme **veya** reddetme (UI)
- [ ] *(Tercih)* Düzeltme geçmişi — audit trail (`record_edits`)
- [ ] *(Bonus)* Sistemik vs tekil kayıt ayrımı
- [ ] Her kural için birim test (pozitif + negatif)

## Faz 3 — Analitik & Dashboard · 5.3
- [ ] OEE yeniden hesap (`oee_recomputed`)
- [ ] KPI kartları: Ort. OEE, Toplam Üretim, Toplam Fire, Toplam Duruş
- [ ] OEE trendi (günlük/haftalık çizgi)
- [ ] Vardiya bazlı performans karşılaştırma
- [ ] İş istasyonu bazlı OEE sıralaması
- [ ] Fire oranı (Quality) dağılımı

## Faz 4 — Filtreleme & Kayıtlar · 5.2
- [ ] Tarih aralığı (başlangıç–bitiş)
- [ ] Vardiya (1/2/3 çoklu seçim)
- [ ] İş istasyonu (multi-select)
- [ ] Stok/Ürün
- [ ] OEE değer aralığı (slider)
- [ ] "Sadece sorunlu kayıtlar" toggle
- [ ] Anlık filtreleme (sayfa yenilemeden)
- [ ] Filtrelenen kayıtları CSV export
- [ ] Kayıt tablosu (sıralama/sayfalama)

## Faz 5 — API Sync · 5.5 (kritik · ağırlık %15)
- [ ] (gün, vardiya) bazında agregasyon (machine_count, total_production_units, oe_value)
- [ ] Hedef API client (httpx) + `X-Production-Key`
- [ ] **Sadece valide+onaylı** kayıt gönderilir (hatalı kayıt gitmez)
- [ ] "Gönder/Senkronize Et" → POST (JSON)
- [ ] Sonuç bildirimi: başarılı / başarısız (4xx,5xx) + mesaj
- [ ] Retry mekanizması (başarısız kayıtlar)
- [ ] **Idempotency** (aynı gün/vardiya 2 kez → duplicate yok)
- [ ] Hata kodları: 401/422/429/413 ayrı ele alınır
- [ ] *(Tercih)* Batch gönderim
- [ ] *(Tercih)* Hedef gönderim loglama (`sync_submissions`)
- [ ] *(Tercih)* Async/background gönderim
- [ ] *(Bonus)* Circuit breaker / exponential backoff

## Faz 6 — Teslimat & Doküman
- [~] `.env.example` (var; final kontrol gerekli)
- [ ] `data/production_data.csv` repo'da (`data/` altına eklenecek)
- [ ] **README.md zorunlu içerikler:**
  - [ ] Projenin amacı (kısa)
  - [ ] Hızlı kurulum (komut-komut)
  - [ ] Hızlı çalıştırma
  - [ ] Ekran görüntüleri (Dashboard / Import / Validation / API)
  - [ ] Tespit edilen hata tipleri + örnekler
  - [ ] API entegrasyon akışı
  - [ ] Kullanılan kütüphaneler + gerekçe
  - [ ] Yapamadıklarım / vakit yetmeyenler
  - [ ] Daha fazla zaman olsaydı ne geliştirirdim
- [ ] Repo adı: `umut-arda-ozdes-uretim-takip-case`
- [ ] Public/invite repo + GitHub push
- [ ] Teslim e-postası → `tunahan.ozturk@magna.com`
- [ ] Kurulum **3 komuttan az** doğrulandı

## AI Kullanım Şeffaflığı · §8 (%5)
- [x] `ai_usage/` yapısı (prompts / transcripts / screenshots) + `_TEMPLATE.md`
- [x] Otomasyon: `make ai-prompt` (şablon) + `make ai-export` (transcript) + opt-in log hook
- [~] Prompt-bazlı dosyalar (`00_*` var; geliştirme ilerledikçe doldurulacak)
- [ ] Sohbet ekran görüntüleri / link / text dump
- [ ] Hangi prompt hangi AI — etiketlendi

## Bonus / İdeal (P2)
- [ ] UI'dan düzenlenebilir validasyon kuralları
- [ ] İndirilebilir validation report (Excel/PDF)
- [ ] 100K+ satır import performansı
- [ ] Data lineage (CSV satır izlenebilirliği)
- [ ] API gönderim geçmişi UI'da
- [x] OpenAPI/Swagger (FastAPI `/docs` — bedava)

---

### İlerleme Özeti
| Faz | Tamamlanan / Toplam |
|-----|---------------------|
| Faz 0 | 24 / 26 |
| Faz 1 | 0 / 9 |
| Faz 2 | 0 / 16 |
| Faz 3 | 0 / 6 |
| Faz 4 | 0 / 9 |
| Faz 5 | 0 / 13 |
| Faz 6 | 1 / 15 |
