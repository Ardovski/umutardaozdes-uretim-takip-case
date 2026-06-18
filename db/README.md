# db/ — Veritabanı

Bu klasör projenin **veritabanıyla ilgili her şeyinin** merkezidir.

- **`app.db`** — Çalışma zamanı **SQLite** veritabanı. Otomatik oluşturulur, **git'e girmez**
  (`.gitignore` → `*.db`). İçeriği import edilen üretim kayıtları + validasyon + sync durumudur.
- ORM/şema **kodu** Python paketi içinde kalır (import edilebilirlik için):
  [`apps/api/app/db/`](../apps/api/app/db/) → `models.py` (tablolar), `session.py` (engine),
  `init_db.py` (şema oluşturma), `base.py`.

## Yol / yapılandırma

Veritabanı yolu CWD'den bağımsız, **mutlak** olarak hesaplanır:
`apps/api/app/core/config.py` → `DB_DIR = <repo>/db`, `database_url = sqlite:///<repo>/db/app.db`.
`.env` içinde `DATABASE_URL` ile override edilebilir.

## Komutlar

```bash
make db-init     # şemayı oluştur (db/app.db)
make seed        # data/production_data.csv'i import et
make db-reset    # db/app.db sil + yeniden oluştur
```

> Not: `make dev`/`make dev-api` ayağa kalkarken şema yoksa otomatik oluşturulur
> (`app.main` lifespan → `init_db`). Import sırasında veri kalitesi validasyonu da otomatik çalışır.

## Şema (6 tablo)

| Tablo | Açıklama |
|-------|----------|
| `import_batches` | Her CSV import'u (dosya hash, satır sayıları, durum) |
| `production_records` | Normalize üretim kayıtları (18 alan + `oee_recomputed`, `status`) |
| `validation_issues` | Kayıt başına 0..N validasyon bulgusu (kural ID, kategori, severity) |
| `record_edits` | Manuel düzelt/reddet/onayla audit trail'i |
| `sync_submissions` | Hedef API gönderim geçmişi (idempotency key, http durum) |
| `app_settings` | Çalışma zamanı ayar anahtar/değerleri |

Tam kolon tanımları için: [`apps/api/app/db/models.py`](../apps/api/app/db/models.py).
