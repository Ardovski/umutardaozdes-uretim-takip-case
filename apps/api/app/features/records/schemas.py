"""Records Pydantic şemaları."""
from __future__ import annotations

import datetime as dt
from typing import Optional

from pydantic import BaseModel, Field


class DateRange(BaseModel):
    start: Optional[dt.date] = None
    end: Optional[dt.date] = None


class OeeRange(BaseModel):
    min: Optional[float] = None
    max: Optional[float] = None


class RecordFilter(BaseModel):
    prod_date_range: Optional[DateRange] = None
    shift: list[int] = Field(default_factory=list)
    station_name: list[str] = Field(default_factory=list)
    stock_name: Optional[str] = None
    oee_range: Optional[OeeRange] = None
    validation_status: list[str] = Field(default_factory=list)
    has_issues: Optional[bool] = None


class RecordOut(BaseModel):
    id: int
    record_id_src: Optional[int] = None
    import_batch_id: Optional[int] = None
    prod_date: Optional[dt.date] = None
    work_order_no: Optional[str] = None
    work_center_no: Optional[str] = None
    work_center_name: Optional[str] = None
    station_name: Optional[str] = None
    stock_name: Optional[str] = None
    shift: Optional[int] = None
    availability: Optional[float] = None
    performance: Optional[float] = None
    quality: Optional[float] = None
    oee: Optional[float] = None
    run_time: Optional[float] = None
    down_time: Optional[float] = None
    planned_down: Optional[float] = None
    unplanned_down: Optional[float] = None
    produced_qty: Optional[int] = None
    scrap_qty: Optional[int] = None
    oee_recomputed: Optional[float] = None
    validation_status: str
    issue_count: int = 0
    created_at: Optional[dt.datetime] = None
    updated_at: Optional[dt.datetime] = None


class IssueOut(BaseModel):
    id: int
    rule_id: str
    category: str
    severity: str
    fields: Optional[str] = None
    message: str
    suggested_action: str
    status: str
    detected_at: Optional[dt.datetime] = None
    fixed_at: Optional[dt.datetime] = None


class RecordDetailOut(RecordOut):
    issues: list[IssueOut] = Field(default_factory=list)


class PaginatedRecords(BaseModel):
    items: list[RecordOut]
    page: int
    size: int
    total: int
    total_pages: int
