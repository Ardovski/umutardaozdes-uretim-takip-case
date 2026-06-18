# Validasyon Motoru (Implementasyon)

Bu doküman motorun **nasıl** çalıştığını anlatır. **Hangi** kuralların uygulandığı ayrı bir
spesifikasyondur: [`../shared/domain/validation-rules.md`](../shared/domain/validation-rules.md).

## Yerleşim
```
backend/app/features/validation/
├── engine.py        # kuralları kayıtlara uygular, Issue listesi üretir
├── report.py        # issue'ları sınıflandırır, özet + indirilebilir rapor (bonus)
└── rules/
    ├── __init__.py  # kural registry'si
    ├── missing_rules.py
    ├── range_rules.py
    ├── consistency_rules.py
    ├── duplicate_rules.py
    ├── format_rules.py
    └── domain_rules.py
```

## Çalışma Modeli
İki geçiş:
1. **Satır-içi kurallar** — her kayıt tek başına değerlendirilir (eksik, aralık, tutarsızlık,
   format, domain).
2. **Batch kuralları** — tüm yükleme görünür olmalı (duplicate tespiti, istatistiksel outlier).

Her kural saf bir fonksiyondur:
```python
def rule(record, ctx) -> Issue | None: ...
```
Yan etkisi yoktur; yalnız bir `Issue` veya `None` döndürür. Eşikler (`OEE_TOLERANCE` vb.)
sabit/`config`'te tutulur — kodda magic number yok.

## Issue ve Kayıt Durumu
- `Issue`: `rule_id, category, severity, fields, message, suggested_action`.
- Kayıt durumu issue'lardan türetilir:
  - en az bir `error` → `rejected`
  - yalnız `warning` → `suspect`
  - hiç → `valid`
- Issue'lar `validation_issues` tablosuna; manuel düzeltmeler `record_edits`'e yazılır.

## Sistemik vs Tekil (bonus)
Bir kural yüklemenin önemli bir oranında tetikleniyorsa "sistemik" etiketlenir (kaynak/MES
sorunu) ve raporda ayrı gruplanır.

## Test
`backend/tests/unit/test_<kategori>_rules.py` — her kural için pozitif (tetiklenir) ve negatif
(temiz/sınır kayıt tetiklenmez) test. Yanlış pozitif önleme bu negatif testlerle güvenceye alınır.

## İlgili
- Kural kataloğu (spec): [`../shared/domain/validation-rules.md`](../shared/domain/validation-rules.md)
- Karar kaydı: [`../shared/decisions/0003-validation-engine.md`](../shared/decisions/0003-validation-engine.md)
- Skill: `.claude/skills/add-validation-rule/`
