# AI Asistan Bağlamı (MiniMax + Claude)

> Hedef: Proje hem **MiniMax** hem **Claude Code** ile aynı bağlam/kurallarla çalışsın. Tek
> kaynak → tek senkron komut, drift yok.

## TL;DR
1. **`AGENTS.md`** = tek kaynak (canonical). **MiniMax** bunu doğrudan okur.
2. **`CLAUDE.md`** = `AGENTS.md`'nin kopyası (Claude Code bunu okur).
3. İçeriği **yalnız `AGENTS.md`'de** değiştir → **`make ai-sync`** → `CLAUDE.md` güncellenir.

## Neden `AGENTS.md`?
`AGENTS.md` açık standart (OpenAI → Linux Foundation / Agentic AI Foundation). **MiniMax**'in
kendi CLI'ı ([MiniMax-AI/cli](https://github.com/MiniMax-AI/cli)) ve Mini-Agent projesi bu dosyayı
okur. Yani MiniMax'in "CLAUDE.md karşılığı" = `AGENTS.md`.

## Dosya Haritası
| Araç | Okuduğu dosya | Bu repoda |
|------|---------------|-----------|
| **MiniMax** (CLI / Agent) | `AGENTS.md` | canonical (kaynak) |
| **Claude Code** | `CLAUDE.md` | `AGENTS.md` kopyası |

## Senkron
```bash
make ai-sync     # AGENTS.md → CLAUDE.md
```
Kural: `CLAUDE.md`'yi elle düzenleme; her zaman `AGENTS.md` + `make ai-sync`.

## İleride başka araç eklemek istersen
`AGENTS.md` açık standart olduğu için Codex, Cursor, Copilot, Gemini, Windsurf gibi araçlar da
doğrudan okuyabilir. Gerekirse `Makefile`'daki `ai-sync` hedefine ilgili kopyayı eklemen yeter
(örn. `cp AGENTS.md GEMINI.md`). Şimdilik kapsam **MiniMax + Claude** ile sınırlı tutuldu.

## Skills (SKILL.md)
Projeye özel iş-akışı tarifleri `.claude/skills/<ad>/SKILL.md` altında. SKILL.md açık standart
(Anthropic, Aralık 2025) olduğu için aynı dosya Claude ve MiniMax'te değişmeden çalışır.
- **Claude:** `.claude/skills/` otomatik okunur.
- **MiniMax:** `export MINIMAX_SKILLS_DIR="$PWD/.claude/skills"`.
- Mevcut: `add-validation-rule`, `add-api-feature`, `add-web-feature`, `run-quality-checks`.
- Detay: [`../../../.claude/skills/README.md`](../../../.claude/skills/README.md)

## Hooks
- **Git hook (AI-bağımsız, önerilen):** `.githooks/pre-commit` secret commit'ini engeller ve
  AGENTS.md değişince CLAUDE.md'yi senkronlar. Kur: `make hooks`. Claude, MiniMax ve insan için çalışır.
- **Claude hook (opt-in):** `.claude/settings.json.example` → `settings.json` kopyalanırsa
  PreToolUse (`.env` korur) + PostToolUse (CLAUDE.md senkron) devreye girer. Komut çalıştırdığı için
  bilinçli onay gerektirir.

## Bellek (Memory)
Kalıcı çalışma belleği `.ai/memory/` (curated `project.md` + `tasks.md` log). AGENTS.md yalnız
buraya işaret eder (yalın kalsın diye). Görev tamamlanınca `tasks.md` güncellenir.
- **Claude:** dosyaları okur/yazar (talimat AGENTS.md §10'da).
- **MiniMax:** `export MINIMAX_MEMORY_PATH="$PWD/.ai/memory"`.
- Detay: [`../../../.ai/memory/README.md`](../../../.ai/memory/README.md)

## Kaynaklar
- AGENTS.md standardı: https://agents.md · https://github.com/agentsmd/agents.md
- SKILL.md standardı: https://www.agensi.io/learn/agent-skills-open-standard
- MiniMax CLI / skills: https://github.com/MiniMax-AI/cli · https://github.com/MiniMax-AI/skills
