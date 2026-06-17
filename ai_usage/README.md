# ai_usage — Yapay Zeka (AI) Kullanım Şeffaflığı (Case Study §8)

Case study §8, AI araçlarının (ChatGPT, Claude, Copilot vb.) kullanımını yasaklamaz ama **şeffaflık**
şart koşar. Bu klasör tüm AI etkileşimlerini belgeler: hangi prompt, hangi AI, ne üretti, nasıl
doğrulandı.

## Yapı

```
ai_usage/
├── README.md                  # bu dosya
├── 00_overall_summary.md      # AI kullanım envanteri (el ile doldurulur)
├── prompts/                   # prompt-bazlı kayıtlar (§8: 01_xxx.md, 02_xxx.md …)
│   ├── _TEMPLATE.md
│   ├── _HOW_TO_ADD.md
│   └── NN_…md                 # sen doldurursun
└── transcripts/               # ham sohbet dökümleri — AI başına ayrı klasör
    ├── claude/                # Claude Code session'ları
    ├── minimax/               # MiniMax (opencode SQLite/JSONL)
    └── opencode/              # opencode CLI oturumları
```

> **Hangi session'ların ekleneceğine sen karar verirsin.**
> `scripts/export-ai-transcript.sh` yardımcı bir araçtır — istediğin zaman manuel
> çalıştırıp üretir, sonra istediğin dosyaları bu klasörlere taşırsın.

## §8 Kuralları ve bu klasör

§8'in zorunlu kıldığı 4 madde:

| §8 kuralı | Bu klasörde karşılığı |
|-----------|----------------------|
| Chat geçmişleri paylaşılacak | `transcripts/<kaynak>/...` (text dump — §8 kabul eder) |
| Hangi prompt için hangi AI | `prompts/NN_*.md` her birinde **ai:** alanı |
| AI çıktısı anlaşıldı mı? | `prompts/NN_*.md` → "Doğrulama" bölümü |
| Şeffaflık zorunlu, saklama yasak | `00_overall_summary.md` tüm kullanımı listeler |

## Prompt log dosyası formatı

Her `prompts/NN_*.md` dosyası:

- **Başlık:** tek cümle, ne yapıldı
- **AI:** Claude | opencode (MiniMax) | ChatGPT | Copilot
- **Tarih:** YYYY-MM-DD
- **Konu:** kısa anahtar kelime
- **Amaç:** bu etkileşim ne için kullanıldı
- **Prompt:** verilen talimat(lar) — özet veya tam metin
- **Çıktı / Sonuç:** ne üretildi, nasıl değiştirildi
- **Doğrulama:** mülakatta her satırı açıklayabilir misin?
- **Bağlantı:** ilgili transcript veya screenshot

Detaylar için → `prompts/_TEMPLATE.md`.

## Yeni kayıt nasıl eklenir

`prompts/_HOW_TO_ADD.md` rehberine bak. Kısa özet:

1. **Prompt log:** `prompts/NN_<konu>.md` oluştur (`_TEMPLATE.md`'den kopyala, doldur).
2. **Transcript (varsa):** `transcripts/<kaynak>/` altına koy, anlamlı bir isim ver.
3. **Envanter:** `00_overall_summary.md`'deki tablolara satır ekle.
4. **Yedekle:** `make ai-backup` (sadece `ai_usage/` stage + commit, push'suz).
5. **Push:** istersen `git push origin HEAD`.

## Yardımcı script'ler

- `scripts/new-ai-prompt.sh` — `make ai-prompt name=<konu>` ile şablon üretir.
- `scripts/export-ai-transcript.sh` — JSONL → markdown dönüşümü (manuel).
- `scripts/refresh-ai-summary.sh` — `prompts/` ve `transcripts/` tarayıp envanteri doldurur
  (manuel; §8 "şeffaflık zorunlu" dediği için otomatik çağrılmaz).

Bunların hiçbiri `ai-backup` tarafından otomatik çalıştırılmaz. **Sen karar verirsin.**

## İlke

- Her AI etkileşimi kayıt altına alınır; çıktı **anlaşılmadan** kullanılmaz.
- Saklama değil şeffaflık: tüm kullanım burada görünür olmalı (§8).
- Hangi dosyaların ekleneceğine sen karar verirsin — eklediğin dosyalar
  `00_overall_summary.md`'de görünür olmalı.
