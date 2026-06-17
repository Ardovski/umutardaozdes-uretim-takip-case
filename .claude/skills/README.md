# Proje Skill'leri (SKILL.md)

Projeye özel, yeniden kullanılabilir iş-akışı tarifleri. **SKILL.md açık standardı** (Anthropic,
Aralık 2025) — aynı dosya **Claude Code** ve **MiniMax** dahil 30+ araçta değişmeden çalışır.

## Mevcut Skill'ler
| Skill | Ne zaman |
|-------|----------|
| `add-validation-rule` | Yeni veri kalite validasyon kuralı eklerken |
| `add-api-feature` | FastAPI backend'e yeni feature modülü eklerken |
| `add-web-feature` | Next.js frontend'e yeni feature eklerken |
| `run-quality-checks` | Commit/teslim öncesi lint + tip + test |

## Kullanım
- **Claude Code:** bu dizini (`.claude/skills/`) otomatik okur; skill adını anınca devreye girer.
- **MiniMax:** `MINIMAX_SKILLS_DIR` ayarını bu dizine yönlendir:
  ```bash
  export MINIMAX_SKILLS_DIR="$PWD/.claude/skills"
  ```
  (veya MiniMax CLI'ın skill dizinine kopyala/symlink).

## Yeni Skill Ekleme
1. `.claude/skills/<skill-adi>/SKILL.md` oluştur (dizin = skill).
2. YAML frontmatter: `name` + `description` (ne zaman kullanılacağını net yaz — keşif için).
3. Markdown gövdesinde adımlar + kurallar + referans.
4. Bu tabloyu güncelle.
