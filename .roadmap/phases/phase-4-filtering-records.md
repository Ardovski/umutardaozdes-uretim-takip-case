# Faz 4 — Filtreleme & Kayıtlar · 5.2 (P1)

**Hedef:** Çok boyutlu, anlık filtreleme + kayıt tablosu + filtreli CSV export.

## Görevler
### Backend
- [ ] `records/service.py`: filtre query builder (tarih/vardiya/istasyon/stok/OEE/sorunlu)
- [ ] `GET /records` — sayfalı + filtreli; `GET /records/{id}`
- [ ] `records/export.py` + `GET /records/export` — filtreli CSV

### Frontend
- [ ] Filtre paneli: tarih aralığı (RangePicker), vardiya (çoklu), istasyon (multi-select),
      stok, OEE slider, "sadece sorunlu" toggle
- [ ] Filtre state → Zustand; URL query senkron (paylaşılabilir)
- [ ] **Anlık** (debounce'lı) — sayfa yenilemeden TanStack Query refetch
- [ ] Kayıt tablosu (TanStack Table): sıralama/sayfalama, severity renk
- [ ] "CSV indir" — mevcut filtreyi yansıtır

## Dokunulacak Dosyalar
```
apps/api/app/features/records/{service,export}.py + api/v1/records.py
apps/web/src/features/records/* + app/records/page.tsx
apps/web/src/stores/filters.ts
```

## Kabul Kriteri
- Tüm filtre boyutları tek tek + birleşik çalışır.
- Filtreleme anlık (sayfa yenilemeden).
- Export edilen CSV uygulanan filtreyle birebir.

**Tahmini:** ~yarım gün · **Sonraki:** Faz 5
