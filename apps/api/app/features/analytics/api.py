"""Analytics API router — KPI + 4 grafik endpoint'i."""
from __future__ import annotations

import datetime as dt
from collections.abc import Iterable
from typing import Annotated, Optional, get_args

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.features.analytics.service import (
    kpis,
    oee_trend,
    quality_distribution,
    shift_comparison,
    station_ranking,
)
from app.features.records.schemas import DateRange, OeeRange, RecordFilter
from app.features.records.service import distinct_values


router = APIRouter()


def _parse_filters(
    start: Optional[dt.date],
    end: Optional[dt.date],
    shift: list[int] | None,
    station_name: list[str] | None,
    stock_name: Optional[str],
    oee_min: Optional[float],
    oee_max: Optional[float],
    validation_status: list[str] | None,
    has_issues: Optional[bool],
) -> RecordFilter:
    return RecordFilter(
        prod_date_range=DateRange(start=start, end=end) if (start or end) else None,
        shift=shift or [],
        station_name=station_name or [],
        stock_name=stock_name,
        oee_range=OeeRange(min=oee_min, max=oee_max) if (oee_min is not None or oee_max is not None) else None,
        validation_status=validation_status or [],
        has_issues=has_issues,
    )


@router.get("/kpis")
def kpis_endpoint(
    start: Annotated[Optional[dt.date], Query()] = None,
    end: Annotated[Optional[dt.date], Query()] = None,
    shift: Annotated[list[int] | None, Query()] = None,
    station_name: Annotated[list[str] | None, Query()] = None,
    stock_name: Annotated[Optional[str], Query()] = None,
    oee_min: Annotated[Optional[float], Query()] = None,
    oee_max: Annotated[Optional[float], Query()] = None,
    validation_status: Annotated[list[str] | None, Query()] = None,
    has_issues: Annotated[Optional[bool], Query()] = None,
    db: Session = Depends(get_db),
) -> dict[str, object]:
    flt = _parse_filters(start, end, shift, station_name, stock_name, oee_min, oee_max, validation_status, has_issues)
    return kpis(db, flt)


@router.get("/oee-trend")
def oee_trend_endpoint(
    start: Annotated[Optional[dt.date], Query()] = None,
    end: Annotated[Optional[dt.date], Query()] = None,
    shift: Annotated[list[int] | None, Query()] = None,
    station_name: Annotated[list[str] | None, Query()] = None,
    stock_name: Annotated[Optional[str], Query()] = None,
    oee_min: Annotated[Optional[float], Query()] = None,
    oee_max: Annotated[Optional[float], Query()] = None,
    validation_status: Annotated[list[str] | None, Query()] = None,
    has_issues: Annotated[Optional[bool], Query()] = None,
    days: int = Query(21, ge=1, le=90),
    db: Session = Depends(get_db),
) -> list[dict[str, object]]:
    flt = _parse_filters(start, end, shift, station_name, stock_name, oee_min, oee_max, validation_status, has_issues)
    return oee_trend(db, flt, days=days)


@router.get("/shift-comparison")
def shift_comparison_endpoint(
    start: Annotated[Optional[dt.date], Query()] = None,
    end: Annotated[Optional[dt.date], Query()] = None,
    shift: Annotated[list[int] | None, Query()] = None,
    station_name: Annotated[list[str] | None, Query()] = None,
    stock_name: Annotated[Optional[str], Query()] = None,
    oee_min: Annotated[Optional[float], Query()] = None,
    oee_max: Annotated[Optional[float], Query()] = None,
    validation_status: Annotated[list[str] | None, Query()] = None,
    has_issues: Annotated[Optional[bool], Query()] = None,
    db: Session = Depends(get_db),
) -> list[dict[str, object]]:
    flt = _parse_filters(start, end, shift, station_name, stock_name, oee_min, oee_max, validation_status, has_issues)
    return shift_comparison(db, flt)


@router.get("/station-ranking")
def station_ranking_endpoint(
    start: Annotated[Optional[dt.date], Query()] = None,
    end: Annotated[Optional[dt.date], Query()] = None,
    shift: Annotated[list[int] | None, Query()] = None,
    station_name: Annotated[list[str] | None, Query()] = None,
    stock_name: Annotated[Optional[str], Query()] = None,
    oee_min: Annotated[Optional[float], Query()] = None,
    oee_max: Annotated[Optional[float], Query()] = None,
    validation_status: Annotated[list[str] | None, Query()] = None,
    has_issues: Annotated[Optional[bool], Query()] = None,
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[dict[str, object]]:
    flt = _parse_filters(start, end, shift, station_name, stock_name, oee_min, oee_max, validation_status, has_issues)
    return station_ranking(db, flt, limit=limit)


@router.get("/quality-distribution")
def quality_distribution_endpoint(
    start: Annotated[Optional[dt.date], Query()] = None,
    end: Annotated[Optional[dt.date], Query()] = None,
    shift: Annotated[list[int] | None, Query()] = None,
    station_name: Annotated[list[str] | None, Query()] = None,
    stock_name: Annotated[Optional[str], Query()] = None,
    oee_min: Annotated[Optional[float], Query()] = None,
    oee_max: Annotated[Optional[float], Query()] = None,
    validation_status: Annotated[list[str] | None, Query()] = None,
    has_issues: Annotated[Optional[bool], Query()] = None,
    db: Session = Depends(get_db),
) -> list[dict[str, object]]:
    flt = _parse_filters(start, end, shift, station_name, stock_name, oee_min, oee_max, validation_status, has_issues)
    return quality_distribution(db, flt)


@router.get("/filter-options")
def filter_options(db: Session = Depends(get_db)) -> dict[str, list[str]]:
    return {
        "stations": distinct_values(db, "station_name"),
        "stock_names": distinct_values(db, "stock_name"),
        "work_centers": distinct_values(db, "work_center_name"),
    }
