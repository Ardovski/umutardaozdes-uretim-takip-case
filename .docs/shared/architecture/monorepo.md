# Mimari — Monorepo Yapısı

Konvansiyon: **FitnessApp** monorepo deseni (`apps/*` workspaces, gruplu `.docs/`,
feature-bazlı `src/`). Mobile yerine web full-stack'e uyarlandı.

## Neden Monorepo?
- Frontend + backend tek repoda → tek `make setup`, tek README, atomik commit'ler.
- Paylaşılan kontrat (`packages/contracts`) iki tarafı senkron tutar.
- Case study'nin "3 komuttan az kurulum" şartını kolaylaştırır.

## Tam Ağaç

```
umut-arda-ozdes-uretim-takip-case/
├── apps/
│   ├── api/                          # FastAPI backend (Python)
│   │   ├── app/
│   │   │   ├── main.py               # uygulama girişi, router mount, middleware
│   │   │   ├── core/                 # config (.env), logging, hata yönetimi
│   │   │   ├── db/                   # SQLAlchemy engine/session, models, init_db
│   │   │   ├── schemas/              # Pydantic request/response modelleri
│   │   │   ├── features/
│   │   │   │   ├── ingestion/        # CSV parse + import + duplicate
│   │   │   │   ├── validation/       # KURAL MOTORU (kalp) + rules/
│   │   │   │   ├── analytics/        # OEE recompute, KPI, trend
│   │   │   │   ├── records/          # filtre/sorgu/CSV export
│   │   │   │   └── sync/             # hedef API client, idempotency, retry
│   │   │   └── api/v1/               # HTTP router'ları (endpoint'ler)
│   │   ├── tests/                    # pytest (unit/ + fixtures/)
│   │   ├── var/                      # runtime SQLite DB (gitignore'lu)
│   │   ├── requirements.txt
│   │   ├── requirements-dev.txt
│   │   └── pyproject.toml            # ruff/pytest/mypy konfig
│   └── web/                          # Next.js frontend (TypeScript)
│       ├── src/
│       │   ├── app/                  # App Router: /, /import, /records, /validation, /sync
│       │   ├── components/ui/        # shadcn/ui bileşenleri
│       │   ├── features/             # import, dashboard, records, validation, sync
│       │   ├── lib/                  # api client, query client, utils
│       │   ├── hooks/                # paylaşılan React hook'ları
│       │   ├── stores/               # Zustand UI-state
│       │   └── types/                # paylaşılan TS tipleri
│       ├── tailwind.config.ts        # ÖZEL DESIGN TOKEN'LARI
│       ├── components.json           # shadcn/ui konfig
│       └── next.config.mjs           # /api proxy  FastAPI
├── packages/
│   └── contracts/                    # paylaşılan OpenAPI/tip kontratı [bonus]
├── data/                             # production_data.csv (commit edilir)
├── ai_usage/                         # AI prompt/sohbet logları (§8)
├── .docs/                            # bu dokümantasyon
├── .roadmap/                         # faz planı + CHECKLIST
├── Makefile · README.md · CLAUDE.md · .env.example · package.json
```

## Workspaces
Kök `package.json` → `workspaces: ["apps/*", "packages/*"]`. Backend ayrı Python venv
(`apps/api/.venv`) kullanır; npm workspace'e dahil değildir (yalnız web).

## Eşleme: FitnessApp → bu proje
| FitnessApp | Bu proje | Not |
|------------|----------|-----|
| `apps/mobile` | `apps/web` + `apps/api` | mobile yerine web + ayrı Python backend |
| `src/features/*` | aynı | feature-bazlı |
| `src/validation/` | `app/features/validation/` | validasyon ayrı katman |
| `.docs/{architecture,data,decisions,setup,conventions}` | aynı | taksonomi korundu |
| kök `Makefile` (`help:`) | aynı | komut girişi |
