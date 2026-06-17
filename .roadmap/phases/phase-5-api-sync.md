# Faz 5 — API Sync · 5.5 (P0 kritik %15)

**Hedef:** Sadece temiz veriyi (gün,vardiya) bazında, idempotent + retry'lı, secret-güvenli
şekilde hedef API'ye göndermek. Hatalı kayıt **asla** gitmez.

> Kaynak: [`../../.docs/shared/api-contract/target-api.md`](../../.docs/shared/api-contract/target-api.md)

## Görevler
### Backend
- [ ] `sync/aggregator.py`: status=valid kayıtları (date,shift) bazında agrege
      (`total_production_units=Σ`, `machine_count=distinct istasyon`, `oe_value=ağırlıklı ort OEE`)
- [ ] `sync/client.py`: httpx POST, `X-Production-Key` header (`.env`'den), timeout
- [ ] **Idempotency:** `idempotency_key="{date}:{shift}"` + `payload_hash`; `success` olan tekrar gitmez
- [ ] **Retry:** tenacity; sadece 429/5xx; exponential backoff; 42960s cooldown
- [ ] Hata kodları: 401/422/413 retry'sız; net hata mesajı
- [ ] `sync_submissions` log (status, http_status, target_submission_id, attempts)
- [ ] Async/background gönderim (UI beklemez)
- [ ] API: `GET /sync/preview`, `POST /sync/submit`, `GET /sync/history`, `POST /sync/{id}/retry`
- [ ] *(Bonus)* batch bölme (413), circuit breaker

### Frontend
- [ ] Sync sayfası: gönderilecek (gün,vardiya) önizleme, "Gönder/Senkronize Et"
- [ ] Sonuç bildirimi: başarılı / başarısız (kod+mesaj), retry butonu
- [ ] Gönderim geçmişi tablosu (`sync_submissions`)

## Dokunulacak Dosyalar
```
apps/api/app/features/sync/{aggregator,client,service}.py + api/v1/sync.py
apps/web/src/features/sync/* + app/sync/page.tsx
```

## Kabul Kriteri
- Yalnız valide+onaylı kayıt gönderilir; **hatalı kayıt gitmez** (test edilir).
- Aynı (gün,vardiya) 2. gönderim → hedefte duplicate yok (idempotent).
- 429/5xx retry edilir; 401/422 net hata gösterir.
- Secret koda/log'a/frontend'e sızmaz.

**Tahmini:** ~yarım-1 gün · **Sonraki:** Faz 6
