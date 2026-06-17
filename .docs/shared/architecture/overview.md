# Mimari — Genel Bakış

## Sistem Diyagramı

```
┌─────────────────┐        ┌──────────────────────────────────────┐        ┌──────────────────┐
│   Tarayıcı       │  HTTP  │            FastAPI Backend            │  HTTPS │   Hedef MES API   │
│  (Next.js SPA)   │ ─────► │              (apps/api)              │ ─────► │  /api/v1/submit   │
│   apps/web       │ ◄───── │                                       │ ◄───── │  X-Production-Key │
│  :3000           │        │  ┌─────────────────────────────────┐ │        │  (89.252.189.91)  │
│                  │        │  │ ingestion  validation  records │ │        └──────────────────┘
│ dashboard/import │        │  │                                │ │
│ validation/sync  │        │  │   analytics            sync       │ │
└─────────────────┘        │  └─────────────────────────────────┘ │
                            │               SQLAlchemy             │
                            │         ┌──────────────┐              │
                            │         │   SQLite DB   │              │
                            │         │ apps/api/var  │              │
                            │         └──────────────┘              │
                            └──────────────────────────────────────┘
```

**Önemli güvenlik sınırı:** `X-Production-Key` (hedef API secret'ı) **sadece** backend'de
(`.env`) tutulur. Tarayıcı asla görmez. Tüm hedef-API çağrıları FastAPI üzerinden geçer.

## Uçtan Uca Veri Akışı

```
1. IMPORT      Kullanıcı CSV seçer  önizleme  POST /imports
                  pandas ile parse  normalize (tarih/ondalık format)
                  import_batches kaydı + row_hash ile duplicate kontrol

2. VALIDATE    Her satır kural motorundan geçer (6 kategori, 30+ kural)
                  validation_issues tablosuna yazılır (rule_id, severity, action)
                  kayıt status: valid | suspect | rejected
                  import özeti döner (toplam/başarılı/şüpheli/red + kalite dökümü)

3. REVIEW      Kullanıcı şüpheli kayıtları görür  manuel düzelt / reddet / onayla
                  record_edits (audit trail) + status güncellenir

4. ANALYZE     analytics: OEE yeniden hesap, KPI, trend, vardiya/istasyon kırılımı
                  dashboard grafikleri + filtreleme (records)

5. SYNC        Sadece status=valid kayıtlar (gün, vardiya) bazında AGREGE edilir
                  idempotency key ile POST /api/v1/submit (retry/backoff)
                  sync_submissions log (başarı/başarısız, target_submission_id)
```

## Katman Sorumlulukları

| Katman | Sorumluluk | Tutmaz |
|--------|-----------|--------|
| **Next.js (web)** | Görsel, etkileşim, form, grafik, hata gösterimi | İş kuralı, secret, DB |
| **FastAPI (api)** | Import, validasyon, analitik, sync, persistence | — |
| **SQLite** | Kalıcı veri: kayıtlar, issue'lar, edit log, sync log | — |
| **Hedef API** | Dışarıda; sadece temiz veriyi alır | — |

## Tasarım İlkeleri
- **Feature-bazlı modülerlik:** her özellik (ingestion/validation/analytics/records/sync) kendi
  router + service + schema + test'iyle izole.
- **Validasyon = first-class:** kurallar veri katmanında değil, ayrı, test edilebilir motorda.
- **Idempotent & güvenli sync:** secret yönetimi + retry + duplicate koruması.
- **Token-tabanlı tema:** hardcoded stil yok (bkz. [`theme.md`](theme.md)).
