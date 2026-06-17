# Prompt 02 — CSV Ingestion (Faz 1)

**Tarih:** 2026-06-17
**AI:** opencode (MiniMax-M3)
**Konu:** CSV → SQLite ingest pipeline + normalize

## Amaç

MES CSV'lerini güvenle SQLite'a al: parse → normalize (tarih/ondalık/yüzde
ölçeği) → file_hash duplicate → row_hash unique → ImportSummary.

## Doğrulama

- `ingestion/normalizer.py`: 4 tarih formatı, virgül/nokta ondalık,
  yüzde ölçeği tespiti, trim+lower string normalize
- `ingestion/service.py`: file_hash (SHA-256) + row_hash (kanonik JSON SHA-256)
  hesaplama, duplicate handling, parse_failed yakalama
- `ingestion/seed.py` CLI: `python -m app.features.ingestion.seed <path>`
- 2 endpoint: `POST /api/v1/imports/preview`, `POST /api/v1/imports/import`
- production_data.csv (2.117 satır) 660ms'de import edilir

## Sorun çözümü (CSV mojibake)

CSV dosyası disk üzerinde UTF-8 byte'larının yanlış encoding ile yazılması
sonucu bozuk başlıklar içeriyordu (`?? Emri No`). Düzeltmeler:
- CSV UTF-8'e çevrildi, başlık satırı data-dictionary'den alındı
- `_DATE_FORMATS` sırası: `%m/%d/%Y` önce (CSV `11/5/2025` = "5 Kasım")
- `_ASCII_HEADER_MAP` bozuk byte varyantlarıyla genişletildi

## Sonuç

Faz 1 kabul ✅. 11 ingestion testi geçer.
