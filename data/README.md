# data/

Test verisi burada durur ve **repo'ya commit edilir** (case study şartı:
"production_data.csv repo içinde data/ klasöründe bulunmalıdır").

## Beklenen dosya
- `production_data.csv` — 2.117 satır, 18 kolon, 5–25 Kasım 2025.

> ⚠️ Dosyayı buraya kopyala: case study ekinden gelen `production_data.csv`'i
> `data/production_data.csv` olarak yerleştir.

Kolon açıklamaları: [`../.docs/shared/domain/data-dictionary.md`](../.docs/shared/domain/data-dictionary.md).

`.gitignore` notu: `data/*.csv` **hariç tutulmaz** (commit edilir); yalnız runtime SQLite DB
(`apps/api/var/`) yok sayılır.
