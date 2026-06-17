# Faz 1 — Veri İçe Aktarma (Import) · 5.1 (P0)

**Hedef:** CSV'i güvenle SQLite'a almak: parse → normalize → duplicate kontrol → import özeti.

## Görevler
- [ ] `ingestion/service.py`: pandas ile CSV oku, kolon eşleme (TR başlık → iç alan)
- [ ] **Normalize:** tarih formatları, ondalık ayraç (`,``.`), yüzde ölçeği (0–1 → 0–100), trim
- [ ] `import_batches` kaydı: filename, `file_hash` (SHA-256), sayılar, status
- [ ] **Duplicate dosya:** aynı `file_hash` → uyarı (5.1)
- [ ] **Duplicate satır:** `row_hash` unique → atla/işaretle
- [ ] Her satırı Faz 2 kural motoruna ver → status (valid/suspect/rejected)
- [ ] `ImportSummary` döndür: toplam/başarılı/şüpheli/red + kategori bazlı kalite dökümü
- [ ] Router: `POST /api/v1/imports` (multipart), `POST /api/v1/imports/preview`
- [ ] `seed.py` (CLI) → `make seed`
- [ ] **UI:** import sayfası — file picker + drag-drop, önizleme (5–10 satır), progress, özet kartı
- [ ] *(Tercih)* çoklu CSV birleştirme

## Dokunulacak Dosyalar
```
apps/api/app/features/ingestion/{service,seed}.py
apps/api/app/api/v1/imports.py
apps/api/app/schemas/import_schemas.py
apps/web/src/features/import/* + app/import/page.tsx
```

## Kabul Kriteri
- `production_data.csv` (2.117 satır) import edilir; özet doğru sayılar verir.
- Aynı dosya 2. kez → duplicate uyarısı.
- Bozuk format satırları normalize edilir veya işaretlenir (kaybolmaz).
- Önizleme yüklemeden önce ilk satırları gösterir.

**Tahmini:** ~yarım gün · **Bağımlılık:** Faz 0, Faz 2 (motor paralel) · **Sonraki:** Faz 2
