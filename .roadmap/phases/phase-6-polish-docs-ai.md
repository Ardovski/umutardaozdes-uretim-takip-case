# Faz 6 — Cila, Doküman, AI Logları, Test (P1)

**Hedef:** Teslime hazır hale getir: README + ekran görüntüleri, ai_usage, testler, dürüst
"yapamadıklarım". Düşük efor, yüksek garantili puan (%10 doküman + %5 AI).

## Görevler
### README (deliverable — zorunlu içerikler)
- [ ] Projenin amacı (kısa)
- [ ] Kurulum (komut-komut, 3 komuttan az)
- [ ] Çalıştırma
- [ ] Ekran görüntüleri: Dashboard / Import / Validation / API gönderim
- [ ] Tespit edilen hata tipleri + örnekler (katalog özeti)
- [ ] API entegrasyon akışı (auth/idempotency/retry)
- [ ] Kullanılan kütüphaneler + **seçim gerekçeleri**
- [ ] Yapamadıklarım / vakit yetmeyenler (dürüst)
- [ ] Daha fazla zaman olsaydı

### AI Şeffaflığı (§8)
- [ ] `ai_usage/prompts/` — prompt-bazlı dosyalar (`01_database_schema.md`, `02_validation_rules.md`, …)
- [ ] Sohbet ekran görüntüleri / paylaşım linki / text dump → `ai_usage/screenshots/`
- [ ] Hangi prompt hangi AI — etiketli

### Kalite
- [ ] Validasyon birim testleri tamam (`make test` yeşil)
- [ ] Error handling cilası (backend tutarlı JSON, frontend toast/inline)
- [ ] `.env.example` final; gerçek `.env` repo'da değil (kontrol)
- [ ] `data/production_data.csv` repo'da
- [ ] Repo adı `umutardaozdes-uretim-takip-case`; push; e-posta `tunahan.ozturk@magna.com`

### Bonus (zaman kalırsa)
- [ ] İndirilebilir validation report (Excel/PDF)
- [ ] UI'dan kural eşiği düzenleme
- [ ] Circuit breaker / 100K+ performans / data lineage

## Kabul Kriteri
- Temiz makinede `git clone` → `make setup` → `make dev` çalışır (3 komut).
- README eksiksiz + 4 ekran görüntüsü.
- `ai_usage/` dolu ve etiketli.

**Tahmini:** ~yarım gün · **Sonraki:** Teslim + 2. aşama sunum hazırlığı
