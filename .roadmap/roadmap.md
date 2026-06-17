# Roadmap — 2 İş Günü Fazlı Plan

> Strateji: puanın %55'i validasyon (%25) + API (%15) + kod kalitesi (%15)'te. Eforu kritik
> fazlara (2 ve 5) yığ; fonksiyonel iskelet erken ayağa kalksın; doküman+AI logları sürekli.

## Zaman Çizelgesi (öneri)

### GÜN 1 — İskelet + Veri + Validasyon
| Blok | Faz | Çıktı |
|------|-----|-------|
| Sabah | **Faz 0** Temel & Kurulum | monorepo, Makefile, scaffold boot, DB şeması, tema token |
| Öğle | **Faz 1** Import | CSV parse/normalize/import, duplicate, import özeti |
| Öğleden sonra | **Faz 2** Validasyon | kural motoru + 30+ kural + validation report API |
| Akşam | **Faz 2** (devam) | validation UI: şüpheli liste, düzelt/reddet, audit |

### GÜN 2 — Dashboard + Sync + Cila
| Blok | Faz | Çıktı |
|------|-----|-------|
| Sabah | **Faz 3** Dashboard | KPI kartları + 4 grafik (OEE trend/vardiya/istasyon/kalite) |
| Öğle | **Faz 4** Filtreleme | çoklu filtre, anlık, CSV export |
| Öğleden sonra | **Faz 5** API Sync | agrege, idempotency, retry, sync UI + geçmiş |
| Akşam | **Faz 6** Cila | README+ekran görüntüleri, ai_usage, validation testleri, "yapamadıklarım" |

## Fazlar

### Faz 0 — Temel & Kurulum (P0)
Monorepo iskeleti, Makefile, `.env`, scaffold (FastAPI + Next.js boot), SQLite şema, tema
token'ları, dokümantasyon + roadmap. → [`phases/phase-0-foundation.md`](phases/phase-0-foundation.md)
**Kabul:** `make dev` her iki uygulamayı ayağa kaldırır; `/health` 200; web boş sayfa render.

### Faz 1 — Veri İçe Aktarma (P0)
CSV → pandas parse → normalize (tarih/ondalık/yüzde) → SQLite import; file_hash duplicate;
import özeti (toplam/başarılı/şüpheli/red + kalite dökümü); önizleme.
 [`phases/phase-1-data-ingestion.md`](phases/phase-1-data-ingestion.md)
**Kabul:** production_data.csv import edilir, özet doğru sayılar verir, aynı dosya tekrar uyarır.

### Faz 2 — Validasyon Motoru (P0 — kritik)
Kural motoru (saf fonksiyon kuralları), 6 kategori 30+ kural, issue üretimi, sınıflandırma,
sistemik-vs-tekil; validation report API + UI (toplu görüntüleme, manuel düzelt/reddet, audit trail).
 [`phases/phase-2-validation.md`](phases/phase-2-validation.md)
**Kabul:** her kural pozitif/negatif test geçer; rapor record_id+hata tipi+alan+aksiyon gösterir;
yanlış pozitif minimal.

### Faz 3 — Analitik & Dashboard (P0/P1)
OEE recompute; KPI kartları (Ort OEE, Toplam Üretim, Fire, Duruş); grafikler: OEE trend,
vardiya karşılaştırma, istasyon sıralaması, kalite dağılımı (Recharts).
 [`phases/phase-3-dashboard.md`](phases/phase-3-dashboard.md)
**Kabul:** dashboard filtrelere tepki verir; 4 grafik + KPI doğru.

### Faz 4 — Filtreleme & Kayıtlar (P1)
Çoklu filtre (tarih aralığı, vardiya, istasyon, stok, OEE slider, sadece-sorunlu toggle),
anlık (sayfa yenilemeden), filtreli CSV export, kayıt tablosu (TanStack Table).
 [`phases/phase-4-filtering-records.md`](phases/phase-4-filtering-records.md)
**Kabul:** tüm filtre boyutları çalışır + birleşir; export filtreyi yansıtır.

### Faz 5 — API Sync (P0 — kritik)
(gün,vardiya) agregasyon; hedef API client (httpx); X-Production-Key; idempotency key;
retry/backoff (tenacity); batch; async; sync sonuç bildirimi + geçmiş UI.
 [`phases/phase-5-api-sync.md`](phases/phase-5-api-sync.md)
**Kabul:** temiz veri gönderilir; hatalı GİTMEZ; tekrar gönderim duplicate yaratmaz; 4xx/5xx ele alınır.

### Faz 6 — Cila, Doküman, AI, Test (P1)
README (zorunlu içerikler + ekran görüntüleri), ai_usage prompt logları, validation unit testleri,
error handling cilası, "yapamadıklarım" + "daha fazla zaman olsaydı".
 [`phases/phase-6-polish-docs-ai.md`](phases/phase-6-polish-docs-ai.md)
**Kabul:** repo 3 komutla ayağa kalkar; README eksiksiz; ai_usage dolu.

## Bonuslar (zaman kalırsa, P2)
UI'dan kural eşiği düzenleme · indirilebilir validation report (Excel/PDF) · circuit breaker ·
100K+ satır performansı · data lineage · OpenAPI zaten var (FastAPI).

## Risk & Önlem
| Risk | Önlem |
|------|-------|
| Hedef API erişilemez | webhook.site mock ile geliştir; URL/key değiştirilebilir (env) |
| Validasyon yanlış pozitif | reject/warn ayrımı; sezgisel kurallar yalnız işaretler |
| Zaman yetmez | P0 fazları önce; bonusları atla; README'de dürüstçe belirt |
| Veri formatı sürprizleri | normalize katmanı + import özetinde görünür |
