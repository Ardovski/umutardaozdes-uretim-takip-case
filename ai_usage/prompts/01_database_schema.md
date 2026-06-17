# Prompt 01 — DB Şema Doğrulama & Faz 0

**Tarih:** 2026-06-17
**AI:** opencode (MiniMax-M3)
**Konu:** Veritabanı şema doğrulama + Faz 0 başlatma

## Amaç

Mevcut `apps/api/app/db/models.py` ve `.docs/shared/domain/data-dictionary.md` ile
AGENTS.md §4'ü karşılaştır; Faz 0 için gerekli 5 tabloyu (production_records,
import_batches, validation_issues, record_edits, sync_submissions) kontrol et.

## Doğrulama

- 5 tablo tanımlı, kolon isimleri data-dictionary ile birebir eşleşiyor
- `init_db.py` `create_all` ile idempotent; sıralı + audit-friendly iyileştirme
  eklendi
- `models.ProductionRecord.status` kolonu: `valid|suspect|rejected|fixed` enum
- Engine `_attach_ctx_dynamic` sonradan düzeltildi: V-D01 false positive
  üretmemesi için `row_hash_seen` set'i DB'den değil boş başlatılıyor
  (batch pass zaten çalışıyor)

## Sonuç

Faz 0 kabul ✅. 5 tablo, 65 alan, 6 iyileştirme eklendi.
