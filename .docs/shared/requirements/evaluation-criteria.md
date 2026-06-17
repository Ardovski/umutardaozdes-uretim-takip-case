# Değerlendirme Kriterleri & Karşılama Stratejisi

Puanın **%55'i iki kritik alanda** (Validasyon %25 + API %15 + Kod Kalitesi %15). Stratejimiz
eforu buna göre dağıtmak.

| # | Kategori | Ağırlık | Neye bakılıyor | Bizim karşılama planımız | Nerede |
|---|----------|:------:|----------------|--------------------------|--------|
| 1 | **Veri Validasyon Kapsamı** | **%25** | Kaç farklı hata tipi, gerekçe netliği, yanlış pozitif | 30+ kural, 6 kategori, her biri gerekçe+örnek; reject vs warn ayrımı | `validation/` · `app/features/validation` |
| 2 | **API Entegrasyonu** | **%15** | Auth, idempotency, retry, error handling, secret yönetimi | X-Production-Key, idempotency key, tenacity retry/backoff, .env secret | `shared/api-contract/target-api.md` · `app/features/sync` |
| 3 | **Fonksiyonel Tamamlık** | **%15** | Import, filtreleme, raporlama çalışıyor mu | Tüm 5.1–5.3 zorunlu maddeler | CHECKLIST |
| 4 | **Kod Kalitesi** | **%15** | Modülerlik, isimlendirme, testler, error handling | Feature-bazlı modüller, validation unit testleri, merkezi hata yönetimi | `conventions/` |
| 5 | **UI/UX** | **%10** | Kullanılabilirlik, hata bildirimleri anlaşılır mı | shadcn/ui, net validation report, toast/inline hata | `web/architecture.md` |
| 6 | **Mimari & Teknik Tercihler** | **%10** | FE-BE ayrımı, DB şeması, API tasarımı | Next.jsFastAPI net ayrım, normalize SQLite şema, REST | `architecture/` · `decisions/` |
| 7 | **Dokümantasyon** | **%5** | README, kurulum, validasyon kuralları açıklaması | README + `.docs/` + kural kataloğu | tüm `.docs/` |
| 8 | **AI Kullanım Şeffaflığı** | **%5** | §8'e uyum | `ai_usage/` prompt-bazlı loglar | `ai_usage/` |

## Öncelik Sırası (2 gün kısıtı altında)
1. **P0 — Validasyon motoru + kalite raporu** (%25, en yüksek getiri)
2. **P0 — API sync** (idempotency/retry/secret) (%15)
3. **P0 — Import + SQLite + temel dashboard** (fonksiyonel tamamlık %15)
4. **P1 — Filtreleme + CSV export + grafikler** (%15 fonksiyonel + %10 UI)
5. **P1 — Kod kalitesi: validation unit testleri, error handling** (%15)
6. **P2 — Bonus** (UI'dan kural editleme, Excel/PDF export, circuit breaker)
7. **Sürekli — Dokümantasyon + ai_usage** (%10, düşük efor yüksek garanti)

## "Yanlış pozitif" tuzağı
Case açıkça uyarıyor: agresif/gerekçesiz kural puan kaybettirir. Bu yüzden her kuralın
**severity** (error/warn) + **confidence** seviyesi var. Belirsiz durumlar otomatik
reddedilmez → "şüpheli/uyar" olarak işaretlenip kullanıcı kararına bırakılır.
