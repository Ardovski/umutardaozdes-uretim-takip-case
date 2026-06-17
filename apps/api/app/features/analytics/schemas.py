"""Analytics Pydantic şemaları."""
from __future__ import annotations

import datetime as dt
from typing import Optional

from pydantic import BaseModel


class KpiCards(BaseModel):
    avg_oee: Optional[float] = None
    total_production: int = 0
    total_scrap: int = 0
    total_down_time_minutes: float = 0.0
    record_count: int = 0
    valid_count: int = 0
    suspect_count: int = 0
    rejected_count: int = 0


class OeeTrendPoint(BaseModel):
    prod_date: dt.date
    avg_oee: Optional[float] = None
    total_production: int = 0
    record_count: int = 0


class ShiftComparisonRow(BaseModel):
    shift: int
    avg_oee: Optional[float] = None
    total_production: int = 0
    total_scrap: int = 0
    record_count: int = 0


class StationRankingRow(BaseModel):
    station_name: str
    avg_oee: Optional[float] = None
    total_production: int = 0
    record_count: int = 0


class QualityDistributionBucket(BaseModel):
    bucket_label: str
    bucket_start: float
    bucket_end: float
    record_count: int
    total_scrap: int = 0
