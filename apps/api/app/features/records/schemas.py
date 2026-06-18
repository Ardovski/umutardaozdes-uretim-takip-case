"""Records Pydantic şemaları."""
from __future__ import annotations

import datetime as dt

from pydantic import BaseModel, Field


class DateRange(BaseModel):
    start: dt.date | None = None
    end: dt.date | None = None


class OeeRange(BaseModel):
    min: float | None = None
    max: float | None = None


class RecordFilter(BaseModel):
    prod_date_range: DateRange | None = None
    shift: list[int] = Field(default_factory=list)
    station_name: list[str] = Field(default_factory=list)
    stock_name: str | None = None
    oee_range: OeeRange | None = None
    validation_status: list[str] = Field(default_factory=list)
    has_issues: bool | None = None


class RecordOut(BaseModel):
    id: int
    record_id_src: int | None = None
    import_batch_id: int | None = None
    prod_date: dt.date | None = None
    work_order_no: str | None = None
    work_center_no: str | None = None
    work_center_name: str | None = None
    station_name: str | None = None
    stock_name: str | None = None
    shift: int | None = None
    availability: float | None = None
    performance: float | None = None
    quality: float | None = None
    oee: float | None = None
    run_time: float | None = None
    down_time: float | None = None
    planned_down: float | None = None
    unplanned_down: float | None = None
    produced_qty: int | None = None
    scrap_qty: int | None = None
    oee_recomputed: float | None = None
    validation_status: str
    issue_count: int = 0
    created_at: dt.datetime | None = None
    updated_at: dt.datetime | None = None


class IssueOut(BaseModel):
    id: int
    rule_id: str
    category: str
    severity: str
    fields: str | None = None
    message: str
    suggested_action: str
    status: str
    detected_at: dt.datetime | None = None
    fixed_at: dt.datetime | None = None


class RecordDetailOut(RecordOut):
    issues: list[IssueOut] = Field(default_factory=list)


class PaginatedRecords(BaseModel):
    items: list[RecordOut]
    page: int
    size: int
    total: int
    total_pages: int
