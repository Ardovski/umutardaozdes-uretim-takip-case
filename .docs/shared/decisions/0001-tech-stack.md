# ADR 0001 — Teknoloji Yığını (Tech Stack)

**Durum:** Kabul edildi · **Tarih:** 2026-06-17

## Bağlam
Case study: Frontend React (tercih) veya Python UI; Backend Python (FastAPI/Flask); SQLite
zorunlu. 2 iş günü. Değerlendirme FE-BE ayrımı + validasyon + API'ye ağırlık veriyor.

## Karar
- **Frontend:** Next.js (App Router) + TypeScript + **shadcn/ui + Tailwind** (özel token'lar).
- **Backend:** **FastAPI** (Python).
- **DB:** SQLite + SQLAlchemy.
- **Charts:** Recharts · **Server-state:** TanStack Query · **UI-state:** Zustand.

## Alternatifler ve Neden Hayır
| Alternatif | Neden seçilmedi |
|------------|-----------------|
| Streamlit (Python-only) | Hızlı ama FE-BE ayrımı (%10 mimari) zayıf; "tercih edilen" React değil |
| Flask | FastAPI'nin Pydantic validasyonu (case'in kalbi) + otomatik OpenAPI'si yok |
| Vite + React (Next yerine) | Next routing/yapı + tek framework deneyimi; aday Next tercih etti |
| MUI / Ant Design | Hazır ama token kontrolü ve modern görünüm için shadcn tercih edildi |

## Sonuçlar
- (+) Pydantic ile validasyon birinci sınıf; FastAPI `/docs` bedava (bonus OpenAPI).
- (+) shadcn token'ları → tutarlı tema + erişilebilirlik + dark mode.
- (−) İki dil/iki runtime (Python+Node) → Makefile ile kurulum soyutlandı.
- (−) Next.js, salt-SPA'dan ağır; ama domain mantığı backend'de, web ince tutuluyor.
