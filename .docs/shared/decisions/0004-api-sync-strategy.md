# ADR 0004 — API Sync Stratejisi (Idempotency / Retry)

**Durum:** Kabul edildi · **Tarih:** 2026-06-17

## Bağlam
Sadece temiz kayıtlar (gün, vardiya) bazında hedef API'ye gidecek. Gönderim idempotent,
retry'lı, secret-güvenli olmalı (%15). Aynı kayıt 2 kez → duplicate olmamalı.

## Karar
- **Agregasyon:** temiz kayıtlar `(production_date, shift)` bazında tek payload'a toplanır
  (`total_production_units=Σ`, `machine_count=distinct istasyon`, `oe_value=ağırlıklı ort OEE`).
- **Idempotency:** `idempotency_key = "{date}:{shift}"` + `payload_hash`. `sync_submissions`'da
  unique. `success` olan (date,shift) tekrar gönderilmez.
- **Retry:** tenacity; sadece 429/5xx; exponential backoff (2,4,8s); max `TARGET_API_MAX_RETRIES`.
  429'da 60s cooldown. 401/422/413 retry edilmez (kalıcı hata).
- **Secret:** `X-Production-Key` yalnız `.env`/backend. Async/background gönderim (UI beklemez).
- **Bonus:** batch bölme (413), circuit breaker, gönderim geçmişi UI.

## Alternatifler
| Alternatif | Neden hayır |
|------------|-------------|
| Kayıt-kayıt gönderim | Case "(gün,vardiya) bazında" diyor; rate-limit riski yüksek |
| Idempotency'siz | Aynı gönderim duplicate yaratır (yasak) |
| Frontend'den direkt hedef API | Secret browser'a sızar (güvenlik ihlali) |

## Sonuçlar
- (+) Tekrar gönderim güvenli; ağ hatası → retry; kalıcı hata → net mesaj.
- (+) `submission_id` saklanır → kanıt + geçmiş.
- (−) Ağırlıklı OEE agregasyonu kararı README'de gerekçelendirilmeli (yorum farkı olabilir).
