# Case Study — Gereksinim Analizi (Kaynak Doğruluk)

> MAGNA — Üretim Performans Takip Uygulaması. Bu doküman PDF'teki gereksinimlerin
> yapılandırılmış dökümüdür. Her gereksinim `.roadmap/CHECKLIST.md`'de takip edilir.

## 1. Bağlam
Otomotiv yan sanayi, enjeksiyon kalıplama (injection molding) hattı. MES sistemi her vardiya
sonunda `.csv` üretim raporu üretiyor. Bugün Excel'de manuel inceleniyor (yavaş, hataya açık,
geriye dönük analiz zor). İstenen: hat performansı + OEE gösteren web uygulaması; doğrulanmış
veriyi merkezi sisteme REST API ile gönderebilen. **Tek başına MVP.**

## 2. Görev (yüksek seviye)
1. CSV ham üretim verisini import et
2. SQLite'ta sakla
3. Filtre arayüzü (tarih, vardiya, iş istasyonu, ürün) ile sorgula
4. OEE, üretim miktarı, fire oranı, duruş analizi raporla
5. **Yüklenen veride kalite sorunlarını tespit et, raporla, gerektiğinde düzelt** → kritik
6. **Doğrulanmış (temiz) veriyi REST API ile hedef sisteme gönder** → kritik

> **Kritik not:** 5 ve 6 en önemli iki parça. Veriyi temiz varsayma; gerçek MES verisi gibi
> kalite sorunları + mantıksal tutarsızlıklar içeriyor.

## 3. Teknik Gereksinimler
| Katman | Tercih | Bizim Seçim |
|--------|--------|-------------|
| Frontend | React (tercih) veya Python UI | **Next.js + shadcn/ui** |
| Backend | Python (FastAPI/Flask) | **FastAPI** |
| Veritabanı | SQLite (zorunlu) | **SQLite + SQLAlchemy** |
| Veri formatı | CSV import | pandas |
| API | HTTP/REST | **httpx + tenacity** |
| Versiyon | Git + GitHub (zorunlu) | Git |

Kütüphane seçimi serbest; gerekçeler README + `.docs/shared/decisions/`.

## 4. Sağlanan Veri
- `production_data.csv` — **2.117 satır, 18 kolon**, 3 haftalık (5–25 Kasım 2025).
- Kolonlar + tipler → [`data-dictionary.md`](../domain/data-dictionary.md).
- OEE = A × P × Q / 10000 → [`oee-formula.md`](../domain/oee-formula.md).

## 5. Fonksiyonel Gereksinimler

### 5.1 Veri İçe Aktarma (Import) — Zorunlu
- [ ] CSV seç (drag-and-drop **veya** file picker)
- [ ] Yükleme öncesi önizleme (ilk 5–10 satır)
- [ ] Yükleme sırasında ilerleme durumu
- [ ] Yükleme sonrası özet: toplam satır / başarılı / reddedilen+sebep / kalite sorunları dökümü
- [ ] Aynı dosya tekrar yüklenince **duplicate kontrolü**
- [ ] *(Tercih)* Birden fazla CSV'yi birleştirip yükleme

### 5.2 Filtreleme & Sorgulama — Zorunlu
Boyutlar (çoklu filtre): tarih aralığı, vardiya (1/2/3 çoklu), iş istasyonu (multi-select),
stok/ürün, OEE aralığı (slider), "sadece sorunlu kayıtlar" (toggle).
- [ ] Anlık filtreleme (sayfa yenilemeden)
- [ ] Filtrelenen kayıtları CSV olarak dışa aktar

### 5.3 Üretim Raporu / Dashboard — Zorunlu
- [ ] OEE trendi (günlük/haftalık çizgi)
- [ ] Vardiya bazlı performans karşılaştırma
- [ ] İş istasyonu bazlı OEE sıralaması
- [ ] Fire oranı (Quality) dağılımı
- [ ] KPI kartları: Ortalama OEE, Toplam Üretim, Toplam Fire, Toplam Duruş

### 5.4 Veri Validasyonu & Kalite Raporu — **kritik (en yüksek ağırlık)**
- [ ] CSV yüklenince otomatik kalite kontrolü
- [ ] Her hatalı/şüpheli kayıt için validation report:
  - record_id / hata tipi (sınıflandırılmış) / hangi alan(lar) / önerilen aksiyon (reddet/uyar/düzelt)
- [ ] Şüpheli kayıtları toplu görüntüleme
- [ ] Manuel düzeltme **veya** reddetme
- [ ] *(Tercih)* Düzeltme geçmişi (audit trail)
- Kural kategorileri → [`validation-rules.md`](../domain/validation-rules.md)
- **Yanlış pozitif puan kaybettirir.** Her kural gerekçe + örnekle belgelenir.

### 5.5 API Entegrasyonu — Hedef Sisteme Gönderim — **kritik**
Gönderim **(gün, vardiya) bazında ayrı ayrı**. Sadece valide + onaylı kayıtlar.
- [ ] "Gönder/Senkronize Et" → REST API'ye POST (JSON)
- [ ] `X-Production-Key` header ile auth
- [ ] Sonuç bildirimi: başarılı sayısı / başarısız (4xx,5xx) sayısı + mesajlar
- [ ] Başarısız kayıtlar için retry
- [ ] **Idempotent** gönderim (aynı kayıt 2 kez → duplicate yok)
- [ ] *(Tercih)* Batch gönderim / hedef loglama / async-background
- Tam sözleşme → [`target-api.md`](../api-contract/target-api.md)

## 6. Değerlendirme Kriterleri
 [`evaluation-criteria.md`](evaluation-criteria.md)

## 7. Teslimat
- Public/invite GitHub repo: **`umutardaozdes-uretim-takip-case`**
- E-posta: `tunahan.ozturk@magna.com`
- **README.md zorunlu içerikler:** amaç, kurulum (komut-komut), çalıştırma, ekran görüntüleri
  (Dashboard/Import/Validation/API), tespit edilen hata tipleri+örnek, API akışı, kütüphaneler+gerekçe,
  yapamadıklarım, daha fazla zaman olsaydı.
- `.env.example` zorunlu (gerçek `.env` repo'da olmamalı).
- `data/production_data.csv` repo'da `data/` altında olmalı.
- **Kurulum 3 komuttan az.**

## 8. AI Kullanım Politikası (§8 — ağırlık %5)
- AI sohbet geçmişleri `ai_usage/` altında (ekran görüntüsü / link / text dump).
- Hangi prompt hangi AI için: `01_database_schema.md`, `02_validation_rules.md` gibi.
- Her kod satırını mülakatta açıklayabilmek beklenir. Şeffaflık zorunlu.

## 9. Süre
**2 iş günü.** Kusursuz bitirmek değil; gerçekçi sürede karar veren + önceliklendiren mühendis
aranıyor. Yapılamayanlar README'de dürüstçe belirtilir.

## 10. Bonus / İdeal Çözüm
UI'dan düzenlenebilir validasyon kuralları · birim testleri (özellikle validasyon) · 100K+ satır
import · sistemik sorun vs tekil kayıt ayrımı · OpenAPI/Swagger · data lineage (CSV satır
izlenebilirliği) · indirilebilir validation report (Excel/PDF) · API gönderim geçmişi (UI) ·
circuit breaker / exponential backoff.

## 11. 2. Aşama: Sunum
30–45 dk teknik sunum: mimari kararlar, validasyon yaklaşımı, API akışı (auth/retry/idempotency),
en zor problem, canlı demo, kod Q&A.
