# Hedef (Target) MES API Entegrasyonu — Bölüm 5.5 (Kritik %15)

> Sadece **valide + onaylı** kayıtlar gönderilir. Hatalı kaydın hedef sisteme ulaşmaması en
> kritik gereksinimlerden biridir. Tüm çağrılar **backend'de** (secret browser'a gitmez).
> Tam dokümantasyon: `http://89.252.189.91:8983/docs-guide`

## Endpoint
```
POST {TARGET_API_URL}/api/v1/submit
Header:  X-Production-Key: <key>          # .env'den
         Content-Type: application/json
```

## Gönderim Modeli — (gün, vardiya) bazında AGREGE
Case: "Gönderim her gün, 3 vardiya için ayrı ayrı." Payload kayıt-kayıt değil; her
`(production_date, shift)` için temiz kayıtlar **tek payload'a agrege** edilir:

| JSON alanı | Tip | Kaynak (agregasyon) | Kısıt |
|------------|-----|---------------------|-------|
| `production_date` | string | gün | `YYYY-MM-DD`, gelecek değil |
| `shift` | int | vardiya | 1 / 2 / 3 |
| `machine_count` | int | o vardiyada aktif distinct istasyon sayısı | 1–1000 |
| `total_production_units` | int | Σ Üretilen Miktar | 1–1.000.000 |
| `oe_value` | float | ort. OEE (üretimle ağırlıklı önerilir) | 0.0–100.0 |

### Örnek İstek
```http
POST /api/v1/submit
X-Production-Key: <your-key>
Content-Type: application/json

{ "machine_count": 12, "total_production_units": 4500,
  "oe_value": 87.3, "shift": 1, "production_date": "2025-11-05" }
```

### Başarılı Yanıt
```json
HTTP 200 OK
{ "success": true, "submission_id": 42, "candidate_name": "Umut Arda Özdeş",
  "message": "Data recorded successfully. ID #42.", "submitted_at": "2025-11-05T08:30:00" }
```
`submission_id` → `sync_submissions.target_submission_id`'ye yazılır (idempotency kanıtı).

## Hata Kodları & Tepki
| Kod | Anlam | Tepkimiz |
|-----|-------|----------|
| 401 | Eksik/geçersiz API key | Dur, kullanıcıya "key kontrol" de (retry **etme**) |
| 422 | Validasyon hatası | `detail`'i logla+göster; payload'ı düzelt; retry etme |
| 429 | Rate limit | `TARGET_API_RATE_LIMIT_COOLDOWN_SECONDS` (60s) bekle, sonra retry |
| 413 | Body > 10KB | Batch'i böl (daha küçük gruplar) |
| 5xx | Sunucu hatası | Exponential backoff ile retry (max `TARGET_API_MAX_RETRIES`) |

## Idempotency (zorunlu)
- **Anahtar:** `idempotency_key = "{production_date}:{shift}"` (doğal anahtar) + `payload_hash`.
- Gönderim öncesi `sync_submissions`'a `pending` yazılır.
- Aynı `(gün, vardiya)` daha önce `success` ise **tekrar POST edilmez** (payload_hash aynıysa).
- Veri değiştiyse (payload_hash farklı) → yeniden gönderim politikası UI'da kullanıcıya sorulur.
- Sonuç: aynı kayıt 2 kez gönderilse de hedef sistemde duplicate oluşmaz.

## Retry / Backoff (tenacity)
```
deneme = min(TARGET_API_MAX_RETRIES, n)
bekleme = TARGET_API_BACKOFF_BASE_SECONDS ** deneme   # 2,4,8...
sadece 429 ve 5xx retry edilir; 401/422/413 retry EDİLMEZ (kalıcı hata)
```
Bonus: uzun süreli hata → **circuit breaker** (belirli eşikten sonra durdur, kullanıcıyı uyar).

## Akış (sync feature)
```
1. preview   GET  /api/v1/sync/preview         gönderilecek (gün,vardiya) payload'ları göster
2. submit    POST /api/v1/sync/submit           arka planda gönder (idempotent, retry)
3. history   GET  /api/v1/sync/history          her gönderim: durum, http kodu, submission_id
```

## Güvenlik
- `X-Production-Key` **sadece** `.env` → backend. Log'a/response'a/frontend'e **asla**.
- `.env` gitignore'lu; `.env.example` placeholder ile paylaşılır.
- Mock geliştirme: gerçek endpoint erişilemezse `webhook.site`/`httpbin.org` ile geliştir,
  sonra `TARGET_API_URL`/`TARGET_API_KEY` değiştirip gerçek endpoint'e geç (case FAQ önerisi).
