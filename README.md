# Üretim Performans Takip Uygulaması

> MAGNA — Mühendislik Aday Değerlendirme Case Study · **Aday: Umut Arda Özdeş**
> Otomotiv yan sanayi (enjeksiyon kalıplama) hattı için OEE & üretim kalite takip uygulaması.

[![Durum](https://img.shields.io/badge/durum-geli%C5%9Ftiriliyor-yellow)]() &nbsp;
Stack: **Next.js + shadcn/ui** · **FastAPI** · **SQLite**

---

##  Projenin Amacı
MES sisteminden gelen `.csv` üretim raporlarını içe aktaran, **veri kalitesini doğrulayan**,
OEE/üretim/fire/duruş metriklerini raporlayan ve **yalnızca doğrulanmış veriyi** merkezi sisteme
REST API ile gönderen tam-stack web uygulaması. Excel'de manuel, hataya açık ve yavaş olan süreci
otomatikleştirir.

## ⚙ Hızlı Kurulum (3 komuttan az)
```bash
git clone https://github.com/<kullanici>/umut-arda-ozdes-uretim-takip-case.git
cd umut-arda-ozdes-uretim-takip-case
make setup            # .env kopyalar + backend venv + frontend npm kurar
```
> Ardından `.env` içindeki `TARGET_API_KEY`'i case'ten gelen gerçek key ile doldurun.
> `data/production_data.csv` dosyasını `data/` klasörüne yerleştirin.

## ▶ Çalıştırma
```bash
make dev              # web → http://localhost:3000   ·   api → http://localhost:8000/docs
```
| Komut | İş |
|-------|----|
| `make dev-api` / `make dev-web` | tek servis |
| `make db-init` / `make seed` | DB şeması / örnek veri import |
| `make test` | testler (özellikle validasyon) |
| `make help` | tüm komutlar |

##  Ekran Görüntüleri
>  Uygulama geliştirildikçe eklenecek (Faz 3–5).
- Dashboard — _(eklenecek)_
- Import & önizleme — _(eklenecek)_
- Validation report — _(eklenecek)_
- API gönderim ekranı — _(eklenecek)_

##  Tespit Edilen Hata Tipleri
6 kategoride 30+ kural (eksik · aralık dışı · tutarsız ilişki · duplicate · format · domain).
Her kural gerekçe + örnek + severity + önerilen aksiyon ile belgelidir.
**Tam katalog:** [`.docs/shared/domain/validation-rules.md`](.docs/shared/domain/validation-rules.md)

Örnekler:
- **V-C01** Fire > Üretim (130 > 100) → reddet
- **V-C02** OEE ≠ A·P·Q/10000 (tolerans dışı) → şüpheli
- **V-X01** Gelecek tarih → reddet
- **V-D02** Aynı (tarih,vardiya,istasyon,iş emri) farklı metrik → çelişen kayıt

##  API Entegrasyon Akışı
Yalnız **valide + onaylı** kayıtlar, **(gün, vardiya) bazında agrege** edilip hedef API'ye POST
edilir. Auth: `X-Production-Key` (sadece `.env`). **Idempotent** (aynı gün/vardiya 2 kez →
duplicate yok), **retry/backoff** (429/5xx). Hatalı kayıt **asla** gönderilmez.
**Detay:** [`.docs/shared/api-contract/target-api.md`](.docs/shared/api-contract/target-api.md)

##  Kullanılan Kütüphaneler & Gerekçe
| Kütüphane | Neden |
|-----------|-------|
| FastAPI | Pydantic ile birinci sınıf validasyon + otomatik OpenAPI/Swagger |
| Pydantic / pydantic-settings | I/O doğrulama + `.env` secret yönetimi |
| pandas | CSV parse, normalize, agregasyon |
| SQLAlchemy + SQLite | Zorunlu DB; ORM ile şema/sorgu |
| httpx + tenacity | Hedef API client + retry/backoff |
| Next.js + shadcn/ui + Tailwind | "Tercih edilen" React; token-tabanlı tema, erişilebilirlik |
| TanStack Query / Zustand | Server-state / UI-state ayrımı |
| Recharts | OEE trend / dağılım grafikleri |
> Detaylı kararlar: [`.docs/shared/decisions/`](.docs/shared/decisions/)

##  Yapamadıklarım / Vakit Yetmeyenler
> Faz ilerledikçe dürüstçe güncellenecek. Bkz. [`.roadmap/CHECKLIST.md`](.roadmap/CHECKLIST.md).

##  Daha Fazla Zaman Olsaydı
UI'dan düzenlenebilir validasyon kuralları · indirilebilir validation report (Excel/PDF) ·
circuit breaker + 100K+ satır performansı · data lineage · gönderim geçmişi grafikleri.

##  AI Kullanımı
Bu proje AI desteğiyle geliştirilmiştir; tüm etkileşimler şeffaf biçimde
[`ai_usage/`](ai_usage/) altında belgelenir (case study §8).

##  Dokümantasyon & Plan
- Mimari & dökümanlar → [`.docs/`](.docs/)
- Faz planı → [`.roadmap/roadmap.md`](.roadmap/roadmap.md)
- İlerleme (yapıldı/yapılmadı) → [`.roadmap/CHECKLIST.md`](.roadmap/CHECKLIST.md)

---
_Teslim: `tunahan.ozturk@magna.com`_
