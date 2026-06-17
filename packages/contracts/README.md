# packages/contracts — Paylaşılan API Kontratı (Bonus)

Frontend ↔ backend arasında **tek doğruluk kaynağı** tipler/şema. İki tarafın senkron kalması için.

## Plan (zaman kalırsa — P2)
- Backend FastAPI otomatik `openapi.json` üretir.
- Buradan TS tipleri üretilir (`openapi-typescript`) → `apps/web` tüketir.
- Alternatif: elle paylaşılan JSON şema / enum (vardiya, severity, kategori sabitleri).

## Şimdilik
Boş placeholder. MVP'de tipler her uygulamada lokal (`apps/api/app/schemas`,
`apps/web/src/types`). Kontrat üretimi bonus fazda.
