# Veri Sözlüğü — production_data.csv

Kaynak: `data/production_data.csv` — **2.117 satır, 18 kolon**, 5–25 Kasım 2025 (3 hafta).

| # | Kolon (CSV) | Tip | Açıklama | Beklenen kısıt | İç alan adı |
|---|-------------|-----|----------|----------------|-------------|
| 1 | `record_id` | int | Kayıt tekil numarası | benzersiz, boş değil | `record_id_src` |
| 2 | `Tarih` | date | Üretim günü | geçerli tarih, gelecekte değil, 05–25 Kas 2025 | `prod_date` |
| 3 | `İş Emri No` | string | İş emri (302 ile başlayan 10 haneli, örn. 3025678325) | `^302\d{7}$` | `work_order_no` |
| 4 | `İş Merkezi No` | string | İş merkezi kodu | boş değil | `work_center_no` |
| 5 | `İşmerkezi Adı` | string | İş merkezi tanımı | — | `work_center_name` |
| 6 | `İş İstasyon Adı` | string | Makine kodu (örn. IMM-2700-3) | `^IMM-\d+-\d+$` (gevşek) | `station_name` |
| 7 | `Stok Adı` | string | Üretilen parça/ürün | boş değil | `stock_name` |
| 8 | `Vardiya` | int | Vardiya no | ∈ {1, 2, 3} | `shift` |
| 9 | `A (Kullanılırlık)` | float | Availability — yüzde | 0–100 | `availability` |
| 10 | `P (Performans)` | float | Performance — yüzde | 0–~100 (>100 şüpheli) | `performance` |
| 11 | `Q (Kalite)` | float | Quality — yüzde | 0–100 | `quality` |
| 12 | `OEE` | float | Overall Equipment Effectiveness — yüzde | 0–100, = A·P·Q/10000 | `oee` |
| 13 | `Çalışma Süresi` | float | Makine çalışma dakikası | ≥ 0 | `run_time` |
| 14 | `Duruş Süresi` | float | Toplam duruş dakikası | ≥ 0, = planlı+plansız | `down_time` |
| 15 | `Planlı Duruş Süresi` | float | Planlı duruş dakikası | ≥ 0 | `planned_down` |
| 16 | `Plansız Duruş Süresi` | float | Plansız duruş dakikası | ≥ 0 | `unplanned_down` |
| 17 | `Üretilen Miktar` | int | Toplam üretim adedi | ≥ 0 | `produced_qty` |
| 18 | `Hatalı Üretilen Miktar` | int | Fire/scrap adedi | ≥ 0, ≤ Üretilen | `scrap_qty` |

## Zorunlu vs Opsiyonel (validasyon için)
- **Zorunlu (boşsa reddet):** `record_id`, `Tarih`, `Vardiya`, `İş İstasyon Adı`, `Üretilen Miktar`.
- **Türetilebilir (boşsa uyar + yeniden hesapla):** `OEE`, `A`, `P`, `Q`, `Duruş Süresi`.
- **Opsiyonel:** `İş Merkezi No/Adı`, `Stok Adı` (eksikse uyar, reddetme).

## Format Notları (gerçek MES verisi → tutarsızlık beklenir)
- **Tarih:** birden fazla format olabilir (`DD.MM.YYYY`, `YYYY-MM-DD`, `DD/MM/YYYY`) → normalize.
- **Ondalık ayraç:** virgül vs nokta (`87,3` vs `87.3`) → normalize.
- **Yüzde ölçeği:** bazı satırlar 0–1 (0.87) bazı 0–100 (87) olabilir → tespit + normalize.
- **Boşluk/case:** string alanlarda baştaki/sondaki boşluk, tutarsız büyük/küçük harf → trim.

## Tekillik (uniqueness) anahtarı
Bir kaydı tekil yapan alan kombinasyonu (duplicate tespiti için):
`(prod_date, shift, station_name, work_order_no)` — aynı vardiyada aynı makinede aynı iş emri
bir kez raporlanmalı. Bkz. validation kuralları **V-D\***.

> Detaylı kural eşlemesi: [`validation-rules.md`](validation-rules.md)
