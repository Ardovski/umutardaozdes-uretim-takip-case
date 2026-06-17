# Proje Belleği (curated)

> Kısa ve güncel tut. Önemli kararlar, mevcut durum, öğrenilenler.

## Mevcut Durum
- Faz 0 (temel) büyük ölçüde tamam. Sıradaki: `make setup` + `make dev` doğrulaması, sonra Faz 1/2.
- Uygulama kodu (feature'lar) henüz yazılmadı; iskelet + dokümantasyon + altyapı + lint kuralları hazır.

## Önemli Kararlar (özet — detay: `.docs/shared/decisions/`)
- Stack: Next.js + shadcn/ui + FastAPI + SQLite.
- Hedef API gönderimi (gün, vardiya) bazında agrege; idempotent + retry.
- Validasyon: saf-fonksiyon kural motoru; reject (yüksek güven) vs warn (sezgisel) ayrımı.
- AI bağlam: `AGENTS.md` canonical → `CLAUDE.md` kopya (`make ai-sync`). Kapsam: MiniMax + Claude.
- Feature izolasyonu ESLint (`boundaries`) ile zorunlu; ortak kod `shared`'a.

## Öğrenilenler / Dikkat
- Türkçe karakter (`â`) ve ok (`→`) içeren toplu sed/perl'de `-CSD` kodlaması güvenilmez;
  bayt-modu + codepoint (`\x{...}`) kullan.
- `bfs` (bu ortamdaki find) çoklu `{}` desteklemez; `xargs -0` tercih et.
- zsh unquoted `$(...)` kelime-bölmez; dosya listelerini `find -print0 | xargs -0` ile geçir.
