"""Pydantic şemalar — ingestion katmanı."""
from __future__ import annotations

import datetime as dt

from pydantic import BaseModel, Field


class NormalizedRow(BaseModel):
    record_id_src: int | None = None
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
    row_hash: str
    parse_warnings: list[str] = Field(default_factory=list)


class ImportPreview(BaseModel):
    filename: str
    file_hash: str
    total_rows: int
    sample: list[NormalizedRow]
    detected_columns: list[str]
    encoding: str


class ImportSummary(BaseModel):
    batch_id: int
    filename: str
    file_hash: str
    total_rows: int
    imported_rows: int
    duplicate_file: bool
    duplicate_row_skipped: int
    parse_failed_count: int
    failed_rows_sample: list[dict[str, str]]
    status: str
    elapsed_ms: int


class BatchOut(BaseModel):
    id: int
    filename: str
    file_hash: str
    uploaded_at: dt.datetime
    total_rows: int
    imported_rows: int
    status: str
    is_active: bool
