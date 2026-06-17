# Yeni AI Prompt Kaydı Nasıl Eklenir

> Bu rehber, her AI etkileşiminden sonra `ai_usage/` klasörünü güncel tutmak için.

## Adım adım

### 1) Hangi numarayı kullanacağını bul

`prompts/` altındaki en büyük numara + 1.

```bash
ls prompts/ | grep -E '^[0-9]' | sort -n | tail -1
```

### 2) Yeni prompt log dosyası oluştur

`prompts/_TEMPLATE.md`'yi kopyala, yeni numarayla yeniden adlandır:

```bash
cp prompts/_TEMPLATE.md prompts/$(ls prompts/ | grep -E '^[0-9]' | sort -n | tail -1 | awk -F_ '{print $1+1}')_konu.md
```

(Bu komutu kopyala-yapıştır; numarayı otomatik hesaplar.)

### 3) Dosyayı doldur

Şu bölümleri doldur:

- **`ai:`** — Claude | opencode (MiniMax) | ChatGPT | Copilot
- **`date:`** — YYYY-MM-DD
- **`topic:`** — snake_case, kısa (örn. `validation_rules`, `api_sync`)
- **`files:`** — etkilenen dosya/dizinler
- **Amaç** — ne için kullanıldı
- **Prompt** — verdiğin talimat(lar)
- **Çıktı / Sonuç** — ne üretildi, nasıl değiştirildi
- **Doğrulama** — mülakatta her satırı açıklayabilir misin? **Bu bölüm zorunlu (§8).**
- **Bağlantı** — ilgili transcript veya screenshot

### 4) Ham transcript varsa ekle

`transcripts/` altına yapıştır. Adlandırma:

```
transcript-<kaynak>-<YYYY-MM-DD>-<id>.md
```

Örnek: `transcript-claude-2026-06-15-a3f9b2c1.md`

### 5) Envanteri güncelle

`00_overall_summary.md` içindeki "Prompt log indeksi" tablosuna yeni satır ekle.

### 6) Commit at

```bash
git add ai_usage/
git commit -m "ai_usage: <NN> <topic>"
```

## Otomasyon (varsa)

`make ai-export` Claude/MiniMax JSONL'lerini otomatik dönüştürür.
Yoksa manuel text dump yeterli — §8 bunu kabul eder.

## Sık yapılan hatalar

- ❌ "AI çıktısı anladım" yazmadan geçmek. → §8 ihlali.
- ❌ Transcript'i `screenshots/` yerine `transcripts/` altına koymak.
- ❌ Prompt dosyasını sadece başlıkla bırakmak, içini doldurmamak.
- ❌ `00_overall_summary.md`'yi güncellemeyi unutmak.
