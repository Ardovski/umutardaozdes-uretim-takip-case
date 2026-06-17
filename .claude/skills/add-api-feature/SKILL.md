---
name: add-api-feature
description: Bu üretim-takip projesinin FastAPI backend'ine yeni bir feature modülü (router + service + schema + test) eklerken kullanılır. apps/api/app/features/ altında tutarlı katmanlı yapı oluşturur ve v1 router'a bağlar. ingestion/validation/analytics/records/sync benzeri yeni bir backend yeteneği eklemek için.
---

# Backend Feature Modülü Ekleme

Her backend yeteneği kendi feature modülünde izole; router yalnız HTTP, iş mantığı service'te.

## Ne Zaman Kullanılır
- Yeni bir backend yeteneği (örn. yeni bir rapor, dışa aktarım, entegrasyon) eklenirken.

## Yapı
```
apps/api/app/features/<feature>/
├── __init__.py
├── service.py     # iş mantığı (saf, test edilebilir)
├── router.py      # HTTP endpoint'leri (ince)
└── schemas.py     # Pydantic I/O modelleri (veya app/schemas/ altında)
apps/api/tests/unit/test_<feature>.py
```

## Adımlar
1. **Dizin + dosyalar** — `app/features/<feature>/` (snake_case) içinde `service.py`, `router.py`,
   `schemas.py`.
2. **Service** — iş mantığını saf fonksiyon/sınıf olarak yaz; DB erişimi `Depends(get_db)` ile
   router'dan geçer.
3. **Schemas** — istek/yanıt için Pydantic modelleri (`PascalCase` + amaç soneki: `XCreate`,
   `XOut`). camelCase serialize için ortak alias konfigürasyonu kullan.
4. **Router** — `APIRouter()`; endpoint'ler doğrula→service çağır→yanıtla. Yol `kebab-case` çoğul.
5. **Bağla** — `app/api/v1/router.py` içinde:
   ```python
   from app.features.<feature>.router import router as <feature>_router
   api_router.include_router(<feature>_router, prefix="/<feature>", tags=["<feature>"])
   ```
6. **Hata yönetimi** — domain hataları için `app/core/errors.py` exception'larını kullan.
7. **Test** — service için birim test; `make test-api`.

## Kurallar
- İş mantığı router'da değil service'te.
- Secret yalnız `app/core/config.py` (`settings`) üzerinden.
- İsimlendirme: `.docs/shared/conventions/naming.md`.

## Referans
- Backend mimari: `.docs/api/architecture.md`
- Endpoint listesi: `.docs/api/endpoints.md`
