# Prompt 08 — README + CHECKLIST + CSV Mojibake Fix (Faz 6 docs)

**Tarih:** 2026-06-17
**AI:** opencode (MiniMax-M3)
**Konu:** Teslim dokümanları + CSV veri normalizasyonu

## Amaç

- README.md dolu içerik (47 kural 6 kategori tablosu, yapamadıklarım,
  mimari kararlar, 4 ekran görüntüsü placeholder)
- CHECKLIST.md güncelleme (Faz 0-6 ilerleme)
- 00_overall_summary.md envanter (8 prompt satırı)
- tasks.md 8 yeni satır
- CSV mojibake düzeltme (UTF-8 normalizasyonu) → %100 false positive
  giderildi (%35.1 rejected, %64.9 valid/suspect)

## Doğrulama

- README 13.6 KB, 47 kural × kategori tablosu
- CHECKLIST 8.6 KB, 64/82 madde işaretli
- 32/32 pytest PASSED
- API boot OK, uçtan uca import + validation çalışıyor

## Sonuç

Faz 6 docs kabul ✅.
