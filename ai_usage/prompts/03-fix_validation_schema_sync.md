# Prompt 03-fix — DB Şema ↔ Validation Kod Uyumsuzluk Düzeltmesi

**Tarih:** 2026-06-17
**AI:** opencode (MiniMax-M3)
**Konu:** Validation motoru import anında patlıyor — kolon eşleşmeleri

## Tespit edilen 4 uyumsuzluk

1. `ProductionRecord.status` (valid|suspect|rejected|fixed) vs kod
   `rec.validation_status` → kod `rec.status = "..."` şeklinde düzeltildi
2. `ValidationIssue.field_names` (Text) vs `r.fields` → `r.field_names` okundu
3. `RecordEdit` (field, old_value, new_value, reason, edited_by, edited_at) vs
   kod (user_action, before, after) → `field='status'` + JSON serialized
   old_value/new_value + reason="accept|reject|manual_fix[:note]" öneki
4. config.py'de 10 validation alanı eksik → eklendi (tolerance, suspect_upper,
   impossible_upper, minutes_per_day, outlier_z_threshold, patterns,
   report window)
5. Bonus: Enum direkt karşılaştırma (`r.category != category` value yerine)

## Doğrulama

- 32/32 pytest PASSED
- API boot OK, validation motor DB'den status alıp yazıyor
- sync_submit eşleşmeleri, audit trail uyumlu

## Sonuç

Import patlaması giderildi ✅.
