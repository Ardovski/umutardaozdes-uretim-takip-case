# Prompt 06 — Sync: Hedef API (Faz 5, kritik %15)

**Tarih:** 2026-06-17
**AI:** opencode (MiniMax-M3)
**Konu:** Valide kayıtları idempotent + retry'lı + secret-güvenli gönderim

## Amaç

`apps/api/app/features/sync/` altında aggregator + client + retry + service
+ 4 endpoint. Sadece `status='valid'` kayıtlar (gün, vardiya) agrege edilir.

## Doğrulama

- Aggregator: `status='valid'` filtre + `(prod_date, shift)` groupby +
  machine_count (distinct station) + total_production_units (sum) + oe_value
  (ağırlıklı ortalama)
- Idempotency: `idempotency_key = "{date}:{shift}"` (DB unique) +
  payload_hash (SHA-256 of canonical JSON)
- Retry matrisi: 429 (60s cooldown) + 5xx exponential backoff max 3 →
  retry; 401/422/413 → permanent (retry YAPMAZ)
- Secret: `X-Production-Key` sadece settings (.env); log'da REDACTED
- Async: `BackgroundTasks` + 202 Accepted
- Frontend: SyncPage (preview + multi-select + force) + HistoryTable
  (auto-refresh 3s + retry)
- 7 sync testi geçer (4 client + retry + secret + idempotency)
- `error_message` kolonu sync_submissions'a eklendi

## Sonuç

Faz 5 kabul ✅.
