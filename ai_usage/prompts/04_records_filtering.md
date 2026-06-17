# Prompt 04 — Records + Filtreleme (Faz 4)

**Tarih:** 2026-06-17
**AI:** opencode (MiniMax-M3)
**Konu:** Filtreli listeleme + CSV export

## Amaç

`apps/api/app/features/records/` altında 7-filtrli paginated kayıt tablosu +
streaming CSV export (UTF-8 BOM, Excel TR uyumu).

## Doğrulama

- 7 filtre boyutu: prod_date_range, shift[], station_name[], stock_name (LIKE),
  oee_range, validation_status[], has_issues
- 4 endpoint: `GET /records/list`, `GET /records/{id}`, `GET /records/export`
  (streaming), `GET /records/distinct/{column}`
- Export: 18 kaynak kolon + validation_status + issue_count = 20 kolon
- `oee` + `stock_name` index'leri `init_db.py` extra_indexes'e eklendi
- 4 record testi geçer

## Sonuç

Faz 4 kabul ✅.
