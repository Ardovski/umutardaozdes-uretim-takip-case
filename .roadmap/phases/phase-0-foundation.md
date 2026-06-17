# Faz 0 — Temel & Kurulum (P0)

**Hedef:** Monorepo + komutlar + scaffold çalışır halde; her iki uygulama boot olur; DB şeması
ve tema token'ları hazır. "Walking skeleton".

## Görevler
- [x] Git init + monorepo iskeleti + `.gitignore`
- [x] `Makefile` (setup/dev/test/lint/db)
- [x] `.env.example` + kök `package.json` (workspaces)
- [x] `CLAUDE.md` + `.docs/` + `.roadmap/`
- [ ] **Backend boot:** `app/main.py` (FastAPI, CORS, `/health`), `core/config.py` (Settings)
- [ ] **DB:** `db/session.py`, `db/models.py` (5 tablo), `db/init_db.py` → `make db-init`
- [ ] **Frontend boot:** Next.js app (`layout.tsx`, `page.tsx`), Tailwind kurulumu
- [ ] **Tema:** `tailwind.config.ts` + `globals.css` (özel token'lar — bkz. theme.md)
- [ ] shadcn/ui init (`components.json`, `lib/utils.ts`, ilk birkaç bileşen)
- [ ] `next.config.mjs` rewrites → FastAPI proxy

## Dokunulacak Dosyalar
```
apps/api/app/main.py, core/config.py, db/{session,models,init_db}.py
apps/api/requirements.txt, pyproject.toml
apps/web/{package.json, next.config.mjs, tailwind.config.ts, components.json, tsconfig.json}
apps/web/src/app/{layout.tsx, page.tsx, globals.css}, src/lib/utils.ts
```

## Kabul Kriteri
- `make setup` hatasız tamamlanır.
- `make dev` → `http://localhost:8000/health` `{"status":"ok"}`, `http://localhost:3000` render eder.
- `make db-init` 5 tabloyu oluşturur.
- Tema token'ları ile bir test bileşeni doğru renkleniyor (light + dark).

**Tahmini:** ~yarım gün · **Sonraki:** Faz 1
