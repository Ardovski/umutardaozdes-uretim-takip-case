# Kodlama Standartları

## Genel
- **Dil:** Dokümanlar Türkçe; kod identifier'ları + commit mesajları İngilizce.
- **Dosya/klasör:** feature-bazlı; her feature kendi router/service/schema/test'iyle.
- İş mantığı **service'te**, router/component'te değil.
- → **İsimlendirme standartları (klasör + dosya):** [`naming.md`](naming.md) — kaynak doğruluk.
- → **AI asistan bağlamı (MiniMax + Claude):** [`ai-assistants.md`](ai-assistants.md).

## Python (backend)
- **Formatter/Linter:** `ruff` (format + lint), `mypy` (tip).
- **Tip ipuçları zorunlu** (public fonksiyonlar).
- Pydantic modelleri I/O sınırında; ORM modelleri DB sınırında — karıştırma.
- İsimlendirme: `snake_case` (fonksiyon/değişken), `PascalCase` (sınıf), sabitler `UPPER_CASE`.
- Exception'lar tipli (`ValidationError`, `TargetApiError`); `except Exception` yutma yok.
- Secret'lar yalnız `Settings` (config) üzerinden; log'a değer basma.

## TypeScript (frontend)
- **Formatter:** Prettier · **Linter:** ESLint (next/core-web-vitals).
- `any` yasak; tipleri `src/types` veya feature `types.ts`.
- Bileşen: fonksiyonel + hook. Server-state → TanStack Query; UI-state → Zustand.
- **Stil:** sadece Tailwind semantic token'ları (bkz. theme.md). Hardcoded renk yok.
- İsimlendirme: bileşen `PascalCase`, hook `useX`, dosya `kebab-case` veya `PascalCase.tsx`.

## Commit (Conventional Commits)
```
feat(validation): add V-C01 scrap>production rule
fix(sync): handle 429 with cooldown
docs: add validation catalog
chore(setup): scaffold monorepo
```

## Test
- Backend: `pytest`; her validasyon kuralı pozitif+negatif test. Hedef: validasyon yüksek kapsam.
- Çalıştırma: `make test`. CI eşdeğeri: `make check`.

## Hata Yönetimi
- Backend: merkezi exception handler → tutarlı JSON.
- Frontend: TanStack Query `onError` + toast; form hataları inline.
- Kullanıcıya **anlaşılır** mesaj (case UI/UX kriteri).
