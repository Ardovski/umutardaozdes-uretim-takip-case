---
name: add-web-feature
description: Bu üretim-takip projesinin Next.js frontend'ine yeni bir feature (sayfa + bileşenler + API hook'ları) eklerken kullanılır. apps/web/src/features/ altında tutarlı yapı oluşturur, shadcn/ui ve Tailwind semantic token'larını kullanır, TanStack Query ile FastAPI'ye bağlanır.
---

# Frontend Feature Ekleme

Feature-bazlı; sunucu durumu TanStack Query, UI durumu Zustand. Stil yalnız semantic token.

## Ne Zaman Kullanılır
- Yeni bir ekran/sayfa veya UI yeteneği (dashboard kartı, rapor görünümü vb.) eklenirken.

## Yapı
```
apps/web/src/features/<feature>/          # kebab-case
├── components/      # PascalCase.tsx (domain bileşenleri)
├── hooks/           # useX.ts (TanStack Query)
├── api/             # bu feature'ın FastAPI çağrıları
└── types.ts
apps/web/src/app/<feature>/page.tsx       # App Router sayfası
```

## Adımlar
1. **API katmanı** — `features/<feature>/api/` içinde `lib/api/client.ts`'teki `api` helper'ı
   kullanan fonksiyonlar. Endpoint'ler: `.docs/api/endpoints.md`.
2. **Hook** — `hooks/useX.ts`: `useQuery`/`useMutation`, `query-keys.ts`'teki anahtarlarla.
3. **Bileşenler** — `components/` altında `PascalCase.tsx`. shadcn primitifleri için
   `npx shadcn@latest add <bilesen>` (skill: add-shadcn yoksa elle). Stil: yalnız semantic token
   (`bg-success`, `text-oee-good` …) — hardcoded renk yok.
4. **Sayfa** — `app/<feature>/page.tsx` bileşenleri kompoze eder.
5. **Tipler** — paylaşılan tipler `src/types/domain.ts`, feature'a özel `features/<feature>/types.ts`.
6. **Doğrula** — `npm run lint` + `npx tsc --noEmit` (veya `make typecheck`).

## Kurallar
- Sunucu durumu → TanStack Query; UI durumu → Zustand. `useEffect` ile veri çekme yapma.
- Stil: yalnız Tailwind semantic token (`.docs/web/theme.md`). `any` yasak.
- Next.js özel dosyaları küçük harf (`page.tsx`, `layout.tsx`).

## Referans
- Frontend mimari: `.docs/web/architecture.md`
- Tema/token: `.docs/web/theme.md`
