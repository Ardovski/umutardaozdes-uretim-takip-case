---
name: run-quality-checks
description: Bu projede bir değişikliği tamamlamadan veya teslim etmeden önce kalite kontrollerini (lint, tip kontrolü, test) çalıştırıp düzeltmek için kullanılır. make check ile backend ruff/pytest ve frontend eslint/tsc kapısını geçirir.
---

# Kalite Kontrolleri Çalıştırma

Bir değişiklik "bitti" sayılmadan önce kalite kapısından geçmeli.

## Ne Zaman Kullanılır
- Bir feature/fix tamamlandığında, commit veya teslim öncesi.

## Komutlar
```bash
make check        # lint + typecheck + test (CI eşdeğeri)
# parça parça:
make lint         # ruff (api) + eslint (web)
make typecheck    # tsc --noEmit (web) + mypy (api, ops.)
make test         # pytest (api) + web testleri
make format       # ruff format + prettier (otomatik düzeltme)
```

## Akış
1. `make format` ile otomatik düzeltilebilenleri düzelt.
2. `make check` çalıştır.
3. Hata varsa: dosya:satır bilgisine göre düzelt, tekrar `make check`.
4. Validasyon değiştiyse özellikle `make test-api`'nin yeşil olduğundan emin ol.

## Kurallar
- Lint/tip hataları bırakılmaz; bırakılırsa nedeni belgelenir.
- Validasyon kuralları için pozitif + negatif testler geçmeli.

## Referans
- Komutlar: `Makefile` (`make help`)
- Standartlar: `.docs/shared/conventions/coding-standards.md`
