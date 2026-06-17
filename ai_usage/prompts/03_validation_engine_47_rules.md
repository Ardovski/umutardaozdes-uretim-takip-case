# Prompt 03 — Validation Engine + 47 Kural (Faz 2)

**Tarih:** 2026-06-17
**AI:** opencode (MiniMax-M3)
**Konu:** 47 kural × 6 kategori validation motoru (en kritik faz, %25 puan)

## Amaç

`apps/api/app/features/validation/` altında iki geçişli (row + batch) motor,
6 kategori × 47 kural, severity/aksiyon matrisi, sistemik-vs-tekil tespiti.

## Doğrulama

- 47 kural katalogdaki kimliklerle (V-M01..V-X06) birebir eşleşiyor
- Severity: 25 error + 16 warning + 6 info
- 5 batch kuralı (V-D01, V-D02, V-D03, V-D04, V-X05), 42 row-level
- Tolerans: float çapraz kontrol ±1.0 yüzde puan
- Outlier (V-X05): IQR/z-score `|z|>3` → warning (otomatik reject YAPMA)
- Engine.record_status: error → rejected, warning → suspect, hiç yok → valid
- 14 test geçer (12 kural parametrize + 2 engine batch)

## Sonuç

Faz 2 kabul ✅. CSV'de %35.1 rejected, %36.2 suspect, %28.7 valid
(gerçek data sorunları yakalanıyor: V-R05 P>100 729 record, V-C04
availability uyumsuzluğu 626 record vb.).
