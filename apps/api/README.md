# apps/api — FastAPI Backend

Üretim Performans Takip backend'i: CSV import, veri validasyonu, OEE analitik, hedef API sync.

## Çalıştırma
```bash
# kökten (önerilen):
make dev-api          # http://localhost:8000/docs

# veya elle:
cd apps/api
../../apps/api/.venv/bin/uvicorn app.main:app --reload --port 8000
```

## Yapı
```
app/
├── main.py          # giriş, router mount, CORS
├── core/            # config (.env), logging, errors
├── db/              # SQLAlchemy session, models, init_db
├── schemas/         # Pydantic I/O modelleri
├── features/        # ingestion · validation · analytics · records · sync
└── api/v1/          # HTTP router'ları
tests/               # pytest (özellikle validation)
var/                 # runtime SQLite DB (gitignore'lu)
```

Mimari: [`../../.docs/api/architecture.md`](../../.docs/api/architecture.md) ·
Endpoint'ler: [`../../.docs/api/endpoints.md`](../../.docs/api/endpoints.md)

## Test
```bash
make test-api         # pytest
```
