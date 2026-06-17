# Faz 3 — Analitik & Dashboard · 5.3 (P0/P1)

**Hedef:** Temiz veriden OEE odaklı görsel raporlama: KPI + 4 grafik.

## Görevler
### Backend
- [ ] `analytics/service.py`: OEE recompute, agregasyonlar (filtre-aware)
- [ ] `GET /analytics/kpis` — Ort. OEE, Toplam Üretim, Toplam Fire, Toplam Duruş
- [ ] `GET /analytics/oee-trend` — günlük/haftalık seri
- [ ] `GET /analytics/shift-comparison` — vardiya bazlı
- [ ] `GET /analytics/station-ranking` — istasyon OEE sıralaması
- [ ] `GET /analytics/quality-distribution` — fire/kalite dağılımı

### Frontend
- [ ] `KpiCard` bileşeni (OEE bandına göre `oee-*` token rengi)
- [ ] `OeeTrendChart` (Recharts line)
- [ ] `ShiftComparisonChart` (bar, `shift-*` token'ları)
- [ ] `StationRankingChart` (yatay bar)
- [ ] `QualityDistributionChart` (bar/pie)
- [ ] Dashboard sayfası kompozisyonu (`app/page.tsx`), filtre bağlama (Faz 4)

## Dokunulacak Dosyalar
```
apps/api/app/features/analytics/service.py + api/v1/analytics.py
apps/web/src/features/dashboard/* + app/page.tsx
```

## Kabul Kriteri
- 4 grafik + KPI kartları doğru değerlerle render eder.
- OEE renkleri banta uygun (≥85 yeşil / 60–85 sarı / <60 kırmızı).
- Filtre değişince dashboard güncellenir (Faz 4 ile).

**Tahmini:** ~yarım gün · **Sonraki:** Faz 4
