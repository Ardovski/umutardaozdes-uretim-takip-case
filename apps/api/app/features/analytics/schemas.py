"""Analytics Pydantic şemaları."""
from __future__ import annotations

import datetime as dt

from pydantic import BaseModel


class KpiCards(BaseModel):
    avg_oee: float | None = None
    total_production: int = 0
    total_scrap: int = 0
    total_down_time_minutes: float = 0.0
    record_count: int = 0
    valid_count: int = 0
    suspect_count: int = 0
    rejected_count: int = 0


class OeeTrendPoint(BaseModel):
    prod_date: dt.date
    avg_oee: float | None = None
    total_production: int = 0
    record_count: int = 0


class ShiftComparisonRow(BaseModel):
    shift: int
    avg_oee: float | None = None
    total_production: int = 0
    total_scrap: int = 0
    record_count: int = 0


class StationRankingRow(BaseModel):
    station_name: str
    avg_oee: float | None = None
    total_production: int = 0
    record_count: int = 0


class QualityDistributionBucket(BaseModel):
    bucket_label: str
    bucket_start: float
    bucket_end: float
    record_count: int
    total_scrap: int = 0


class RecentRecordOut(BaseModel):
    id: int
    prod_date: dt.date | None = None
    shift: int | None = None
    station_name: str | None = None
    stock_name: str | None = None
    oee: float | None = None
    produced_qty: int | None = None
    scrap_qty: int | None = None
    status: str
    created_at: dt.datetime | None = None


class TopStationOut(BaseModel):
    station_name: str
    avg_oee: float | None = None
    total_production: int = 0
    total_scrap: int = 0
    record_count: int = 0


class ProblemShiftOut(BaseModel):
    prod_date: dt.date | None = None
    shift: int
    station_name: str | None = None
    avg_oee: float | None = None
    rejected_count: int = 0
    total_production: int = 0
    record_count: int = 0
