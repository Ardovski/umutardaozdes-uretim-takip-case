"""Analytics service — OEE recompute + filtre-aware agregasyonlar."""
from __future__ import annotations

import datetime as dt
from collections.abc import Sequence
from typing import Any

from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from app.db import models
from app.features.records.schemas import DateRange, OeeRange, RecordFilter
from app.features.records.service import _apply_filter, _build_issue_subquery


# OEE = bileşenlerden yeniden hesaplanmış `oee_recomputed` (bkz. app.core.oee),
# basit ortalama, TÜM kayıtlar üzerinden (hacim metrikleriyle aynı kapsam).
# Hesaplanamayan/boş kayıtlar SQL AVG tarafından dışlanır.
_QUALITY_BUCKETS: tuple[tuple[float, float, str], ...] = (
    (0.0, 10.0, "0-10"),
    (10.0, 20.0, "10-20"),
    (20.0, 30.0, "20-30"),
    (30.0, 40.0, "30-40"),
    (40.0, 50.0, "40-50"),
    (50.0, 60.0, "50-60"),
    (60.0, 70.0, "60-70"),
    (70.0, 80.0, "70-80"),
    (80.0, 90.0, "80-90"),
    (90.0, 100.01, "90-100"),
)


def _safe_avg(values: Sequence[float | None]) -> float | None:
    cleaned: list[float] = [float(v) for v in values if v is not None]
    if not cleaned:
        return None
    return sum(cleaned) / len(cleaned)


def _avg_oee_and_counts(
    db: Session,
    flt: RecordFilter,
) -> tuple[float | None, int, int, int, int]:
    """Ortalama OEE (basit ortalama, `oee_recomputed` üzerinden) + statü sayıları.

    OEE bileşenlerden yeniden hesaplanıp [0,100]'e clamp'lendiği için (bkz.
    `app.core.oee`) artık garbage yok; ham `oee` kolonu yerine `oee_recomputed`
    kullanılır. SQL AVG, NULL (hesaplanamayan / boş kayıt) değerleri otomatik
    dışlar. Sayımlar tüm kayıtlardan gelir (hacim metrikleriyle aynı kapsam).
    """
    issue_subq = _build_issue_subquery()
    stmt = select(
        func.avg(models.ProductionRecord.oee_recomputed).label("avg_oee"),
        func.count(models.ProductionRecord.id).label("cnt"),
        func.sum(case((models.ProductionRecord.status == "valid", 1), else_=0)).label("v_cnt"),
        func.sum(case((models.ProductionRecord.status == "suspect", 1), else_=0)).label("s_cnt"),
        func.sum(case((models.ProductionRecord.status == "rejected", 1), else_=0)).label("r_cnt"),
    )
    stmt = _apply_filter(stmt, flt, issue_subq=issue_subq)
    row = db.execute(stmt).one()
    avg: float | None = float(row.avg_oee) if row.avg_oee is not None else None
    return avg, int(row.cnt or 0), int(row.v_cnt or 0), int(row.s_cnt or 0), int(row.r_cnt or 0)


def _sum_production_scrap_down(
    db: Session,
    flt: RecordFilter,
) -> tuple[int, int, float]:
    issue_subq = _build_issue_subquery()
    stmt = select(
        func.coalesce(func.sum(models.ProductionRecord.produced_qty), 0).label("p"),
        func.coalesce(func.sum(models.ProductionRecord.scrap_qty), 0).label("s"),
        func.coalesce(func.sum(models.ProductionRecord.down_time), 0.0).label("d"),
    )
    stmt = _apply_filter(stmt, flt, issue_subq=issue_subq)
    row = db.execute(stmt).one()
    return int(row.p or 0), int(row.s or 0), float(row.d or 0.0)


def kpis(db: Session, flt: RecordFilter) -> dict[str, Any]:
    avg_oee, cnt, v_cnt, s_cnt, r_cnt = _avg_oee_and_counts(db, flt)
    p, s, d = _sum_production_scrap_down(db, flt)
    from app.features.analytics.schemas import KpiCards
    return KpiCards(
        avg_oee=avg_oee,
        total_production=p,
        total_scrap=s,
        total_down_time_minutes=d,
        record_count=cnt,
        valid_count=v_cnt,
        suspect_count=s_cnt,
        rejected_count=r_cnt,
    ).model_dump()


def oee_trend(
    db: Session,
    flt: RecordFilter,
    days: int = 21,
) -> list[dict[str, Any]]:
    end_date: dt.date | None = None
    if flt.prod_date_range and flt.prod_date_range.end:
        end_date = flt.prod_date_range.end
    else:
        # Tarih filtresi yoksa "bugün"e değil veri setindeki en son üretim
        # tarihine sabitle — veri tarihsel olabilir (örn. seed = Kasım 2025).
        max_stmt = _apply_filter(
            select(func.max(models.ProductionRecord.prod_date)),
            flt,
            issue_subq=_build_issue_subquery(),
        )
        end_date = db.execute(max_stmt).scalar() or dt.date.today()
    start = end_date - dt.timedelta(days=days - 1)
    range_flt = RecordFilter(
        prod_date_range=DateRange(start=start, end=end_date),
        shift=list(flt.shift),
        station_name=list(flt.station_name),
        stock_name=flt.stock_name,
        oee_range=flt.oee_range,
        validation_status=list(flt.validation_status),
        has_issues=flt.has_issues,
    )
    issue_subq = _build_issue_subquery()
    stmt = (
        select(
            models.ProductionRecord.prod_date.label("d"),
            func.avg(models.ProductionRecord.oee_recomputed).label("avg_oee"),
            func.coalesce(func.sum(models.ProductionRecord.produced_qty), 0).label("p"),
            func.count(models.ProductionRecord.id).label("cnt"),
        )
        .group_by(models.ProductionRecord.prod_date)
        .order_by(models.ProductionRecord.prod_date.asc())
    )
    stmt = _apply_filter(stmt, range_flt, issue_subq=issue_subq)
    rows = db.execute(stmt).all()
    from app.features.analytics.schemas import OeeTrendPoint
    out: list[OeeTrendPoint] = []
    for r in rows:
        out.append(
            OeeTrendPoint(
                prod_date=r.d,
                avg_oee=float(r.avg_oee) if r.avg_oee is not None else None,
                total_production=int(r.p or 0),
                record_count=int(r.cnt or 0),
            )
        )
    return [o.model_dump() for o in out]


def shift_comparison(
    db: Session,
    flt: RecordFilter,
) -> list[dict[str, Any]]:
    issue_subq = _build_issue_subquery()
    stmt = (
        select(
            models.ProductionRecord.shift.label("s"),
            func.avg(models.ProductionRecord.oee_recomputed).label("avg_oee"),
            func.coalesce(func.sum(models.ProductionRecord.produced_qty), 0).label("p"),
            func.coalesce(func.sum(models.ProductionRecord.scrap_qty), 0).label("sc"),
            func.count(models.ProductionRecord.id).label("cnt"),
        )
        .where(models.ProductionRecord.shift.isnot(None))
        .group_by(models.ProductionRecord.shift)
        .order_by(models.ProductionRecord.shift.asc())
    )
    stmt = _apply_filter(stmt, flt, issue_subq=issue_subq)
    rows = db.execute(stmt).all()
    from app.features.analytics.schemas import ShiftComparisonRow
    out: list[ShiftComparisonRow] = []
    for r in rows:
        out.append(
            ShiftComparisonRow(
                shift=int(r.s),
                avg_oee=float(r.avg_oee) if r.avg_oee is not None else None,
                total_production=int(r.p or 0),
                total_scrap=int(r.sc or 0),
                record_count=int(r.cnt or 0),
            )
        )
    return [o.model_dump() for o in out]


def station_ranking(
    db: Session,
    flt: RecordFilter,
    limit: int = 10,
) -> list[dict[str, Any]]:
    issue_subq = _build_issue_subquery()
    stmt = (
        select(
            models.ProductionRecord.station_name.label("st"),
            func.avg(models.ProductionRecord.oee_recomputed).label("avg_oee"),
            func.coalesce(func.sum(models.ProductionRecord.produced_qty), 0).label("p"),
            func.count(models.ProductionRecord.id).label("cnt"),
        )
        .where(models.ProductionRecord.station_name.isnot(None))
        .group_by(models.ProductionRecord.station_name)
        .order_by(func.avg(models.ProductionRecord.oee_recomputed).desc())
        .limit(limit)
    )
    stmt = _apply_filter(stmt, flt, issue_subq=issue_subq)
    rows = db.execute(stmt).all()
    from app.features.analytics.schemas import StationRankingRow
    out: list[StationRankingRow] = []
    for r in rows:
        out.append(
            StationRankingRow(
                station_name=str(r.st),
                avg_oee=float(r.avg_oee) if r.avg_oee is not None else None,
                total_production=int(r.p or 0),
                record_count=int(r.cnt or 0),
            )
        )
    return [o.model_dump() for o in out]


def quality_distribution(
    db: Session,
    flt: RecordFilter,
) -> list[dict[str, Any]]:
    issue_subq = _build_issue_subquery()
    stmt = select(
        models.ProductionRecord.quality.label("q"),
        func.coalesce(models.ProductionRecord.scrap_qty, 0).label("sc"),
    ).where(models.ProductionRecord.quality.isnot(None))
    stmt = _apply_filter(stmt, flt, issue_subq=issue_subq)
    rows = db.execute(stmt).all()
    from app.features.analytics.schemas import QualityDistributionBucket
    counts: dict[tuple[float, float, str], tuple[int, int]] = {
        b: (0, 0) for b in _QUALITY_BUCKETS
    }
    for r in rows:
        qv = float(r.q)
        for low, high, label in _QUALITY_BUCKETS:
            if low <= qv < high:
                key = (low, high, label)
                c, s = counts[key]
                counts[key] = (c + 1, s + int(r.sc or 0))
                break
    out: list[QualityDistributionBucket] = []
    for (low, high, label), (c, s) in counts.items():
        out.append(
            QualityDistributionBucket(
                bucket_label=label,
                bucket_start=low,
                bucket_end=high,
                record_count=c,
                total_scrap=s,
            )
        )
    return [o.model_dump() for o in out]
