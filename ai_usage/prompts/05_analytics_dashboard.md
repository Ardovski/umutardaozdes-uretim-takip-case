# Prompt 05 — Analytics + Dashboard (Faz 3)

**Tarih:** 2026-06-17
**AI:** opencode (MiniMax-M3)
**Konu:** Backend agregasyon + frontend KPI/4 grafik

## Amaç

5 filtre-aware analytics endpoint + 4 grafik dashboard (Recharts).

## Doğrulama

- 5 endpoint: `/analytics/{kpis, oee-trend, shift-comparison, station-ranking,
  quality-distribution}` + `/analytics/filter-options`
- Üretim-ağırlıklı OEE hesaplama (ağırlık = produced_qty)
- Frontend: KpiCard, OeeTrendChart, ShiftComparisonChart, StationRankingChart,
  QualityDistributionChart, useDashboardData (5 paralel TanStack Query)
- 8 component + 4 grafik; oee-good/mid/low token renkleri

## Sonuç

Faz 3 kabul ✅.
