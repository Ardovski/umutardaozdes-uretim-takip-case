# 00 — AI Kullanım Envanteri (Overall Summary)

> Case Study §8 — tüm AI etkileşimlerinin tek bakışta özeti.
> Her satır `prompts/NN_*.md` ile detaylandırılır.

## Kullanılan AI araçları

| AI | Versiyon / Plan | Rol |
|----|-----------------|-----|
| **Claude** | Claude Opus (Code) | Monorepo iskeleti, dokümantasyon, validasyon kural tasarımı, validasyon motoru, API istemcisi, README |
| **opencode** (MiniMax) | MiniMax-M3 | `ai_usage/` altyapısı, yardımcı script'ler |

## Prompt log indeksi

> `prompts/NN_*.md` ekledikçe buraya bir satır ekle.
> Örnek format: `| 01 | <konu> | <AI> | <YYYY-MM-DD> | ✅ kayıtlı |`

| # | Konu | AI | Tarih | Durum |
|---|------|----|----|-------|
|   |      |    |       |       |

## Transcript'ler

> Ham sohbet dökümleri `transcripts/<kaynak>/...` altında, **AI başına ayrı klasör**:
>
> - `transcripts/claude/` — Claude Code (Magna session'ları)
> - `transcripts/minimax/` — MiniMax (opencode SQLite/JSONL)
> - `transcripts/opencode/` — opencode CLI
>
> Hangi dosyaların ekleneceğine **sen karar verirsin**. `scripts/export-ai-transcript.sh`
> yardımcı bir araçtır; istediğin zaman manuel çalıştırıp üretir, sonra istediğin
> dosyaları bu klasörlere taşırsın.

| Kaynak | Tarih | Dosya | Açıklama |
|--------|-------|-------|----------|
|        |       |       |          |

## Şeffaflık notu

- Bu repodaki kod/doc'ların büyük kısmı Claude Opus ile üretildi.
- Eklediğin her prompt log dosyası §8'in "AI çıktısı anlaşıldı mı?" kuralını
  karşılar (`prompts/NN_*.md` → "Doğrulama" bölümü).
- Saklama değil şeffaflık: hangi dosyaların ekleneceğine sen karar verirsin,
  ama eklenecek dosyalar burada görünür olmalı.
