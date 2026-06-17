# İç (Internal) API — FastAPI Endpoint'leri

Base: `http://localhost:8000` · Swagger: `/docs` · OpenAPI: `/openapi.json`
Tüm yollar `/api/v1` altında.

## Health
| Method | Path | Açıklama |
|--------|------|----------|
| GET | `/health` | liveness |

## Import (ingestion)
| Method | Path | Açıklama |
|--------|------|----------|
| POST | `/api/v1/imports` | multipart CSV yükle → parse + validate + import; `ImportSummary` döner |
| GET | `/api/v1/imports` | yükleme geçmişi |
| GET | `/api/v1/imports/{id}/summary` | toplam/başarılı/şüpheli/red + kalite dökümü |
| POST | `/api/v1/imports/preview` | yüklemeden önce ilk 5–10 satır önizleme |

## Records (filtre / sorgu / export)
| Method | Path | Açıklama |
|--------|------|----------|
| GET | `/api/v1/records` | filtreli + sayfalı liste. Query: `date_from,date_to,shift[],station[],stock,oee_min,oee_max,only_problematic` |
| GET | `/api/v1/records/{id}` | tek kayıt + issue'ları |
| GET | `/api/v1/records/export` | aynı filtrelerle CSV indir |

## Validation
| Method | Path | Açıklama |
|--------|------|----------|
| GET | `/api/v1/validation/issues` | şüpheli/hatalı kayıtlar (filtreli, toplu görüntüleme) |
| GET | `/api/v1/validation/summary` | kategori/severity bazında dağılım + sistemik vs tekil |
| POST | `/api/v1/records/{id}/fix` | manuel düzeltme `{field, new_value, reason}` → audit'e yazar |
| POST | `/api/v1/records/{id}/reject` | kaydı reddet |
| POST | `/api/v1/records/{id}/accept` | şüpheliyi onayla (valid yap) |
| GET | `/api/v1/records/{id}/edits` | düzeltme geçmişi (audit trail) |

## Analytics (dashboard)
| Method | Path | Açıklama |
|--------|------|----------|
| GET | `/api/v1/analytics/kpis` | Ort. OEE, Toplam Üretim, Toplam Fire, Toplam Duruş (filtreli) |
| GET | `/api/v1/analytics/oee-trend` | günlük/haftalık OEE serisi |
| GET | `/api/v1/analytics/shift-comparison` | vardiya bazlı performans |
| GET | `/api/v1/analytics/station-ranking` | istasyon bazlı OEE sıralaması |
| GET | `/api/v1/analytics/quality-distribution` | fire/kalite dağılımı |

## Sync (hedef API)
| Method | Path | Açıklama |
|--------|------|----------|
| GET | `/api/v1/sync/preview` | gönderilecek (gün,vardiya) agrege payload'ları |
| POST | `/api/v1/sync/submit` | seçili (gün,vardiya)'ları gönder (idempotent, arka plan) |
| GET | `/api/v1/sync/history` | gönderim log'u: durum, http kodu, submission_id, deneme |
| POST | `/api/v1/sync/{id}/retry` | başarısız gönderimi yeniden dene |

## Ortak Yanıt Sözleşmesi
```json
// hata
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "detail": { } } }
// import özeti
{ "batch_id": 3, "total": 2117, "imported": 1980, "suspect": 102, "rejected": 35,
  "quality_breakdown": { "consistency": 60, "range": 25, "duplicate": 12, ... } }
```

> Hedef (dış) API sözleşmesi ayrı: [`target-api.md`](../shared/api-contract/target-api.md).
