# Bellek (Memory)

AI asistanlarının kalıcı çalışma belleği. Açık konvansiyon (MEMORY.md deseni): curated uzun-vadeli
dosya + kronolojik görev log'u. Claude, MiniMax ve diğer araçlarca kullanılır.

## Dosyalar
- [`project.md`](project.md) — curated, uzun-vadeli: önemli kararlar, mevcut durum, öğrenilenler.
  Her oturumda okunur. **Kısa tut**; bayatlayanı sil.
- [`tasks.md`](tasks.md) — yapılan görevlerin kronolojik log'u (`tarih · ne · sonuç`).

## Kurallar (AGENTS.md'den)
1. Görev tamamlanınca `tasks.md`'e tek satır ekle.
2. Kalıcı bir karar/öğreni varsa `project.md`'i güncelle.
3. Yeni oturuma başlarken önce bu ikisini oku.

## MiniMax
MiniMax'in bellek/not yolunu buraya yönlendir:
```bash
export MINIMAX_MEMORY_PATH="$PWD/.ai/memory"
```

## Neden ayrı klasör (AGENTS.md'ye gömülü değil)?
AGENTS.md yalın kalmalı (her oturumda yüklenir). Büyüyen bir log onu şişirir ve bayatlatır. Bu
yüzden curated bellek + log ayrı tutulur; AGENTS.md yalnızca buraya işaret eder. Bu, MEMORY.md
konvansiyonunun önerdiği yapıdır.
