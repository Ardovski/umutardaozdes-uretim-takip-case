"""Pydantic şemalar — ingestion katmanı."""
from __future__ import annotations

import datetime as dt
from typing import Optional

from pydantic import BaseModel, Field


class NormalizedRow(BaseModel):
    record_id_src: Optional[int] = None
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
