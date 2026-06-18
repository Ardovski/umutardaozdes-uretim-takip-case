"""Records API router."""
from __future__ import annotations

import datetime as dt
from collections.abc import AsyncIterator
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.errors import NotFoundError
from app.db.session import get_db
from app.features.records.export import csv_filename, rows_to_csv_lines
from app.features.records.schemas import DateRange, OeeRange, PaginatedRecords, RecordFilter
from app.features.records.service import (
    distinct_values,
    get_record,
    list_records,
    stream_records,
)

router = APIRouter()


def _build_filter(
    start: Annotated[dt.date | None, Query()] = None,
    end: Annotated[dt.date | None, Query()] = None,
    shift: Annotated[list[int] | None, Query()] = None,
    station_name: Annotated[list[str] | None, Query()] = None,
    stock_name: Annotated[str | None, Query()] = None,
    oee_min: Annotated[float | None, Query()] = None,
    oee_max: Annotated[float | None, Query()] = None,
    validation_status: Annotated[list[str] | None, Query()] = None,
    has_issues: Annotated[bool | None, Query()] = None,
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


@router.get("/list", response_model=PaginatedRecords)
def list_(
    start: Annotated[dt.date | None, Query()] = None,
    end: Annotated[dt.date | None, Query()] = None,
    shift: Annotated[list[int] | None, Query()] = None,
    station_name: Annotated[list[str] | None, Query()] = None,
    stock_name: Annotated[str | None, Query()] = None,
    oee_min: Annotated[float | None, Query()] = None,
    oee_max: Annotated[float | None, Query()] = None,
    validation_status: Annotated[list[str] | None, Query()] = None,
    has_issues: Annotated[bool | None, Query()] = None,
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=500),
    sort: str | None = None,
    db: Session = Depends(get_db),
) -> PaginatedRecords:
    flt = _build_filter(
        start=start, end=end, shift=shift, station_name=station_name,
        stock_name=stock_name, oee_min=oee_min, oee_max=oee_max,
        validation_status=validation_status, has_issues=has_issues,
    )
    items, total = list_records(db, flt, page=page, size=size, sort=sort)
    total_pages = (total + size - 1) // size if size else 0
    return PaginatedRecords(items=items, page=page, size=size, total=total, total_pages=total_pages)


@router.get("/export")
def export(
    start: Annotated[dt.date | None, Query()] = None,
    end: Annotated[dt.date | None, Query()] = None,
    shift: Annotated[list[int] | None, Query()] = None,
    station_name: Annotated[list[str] | None, Query()] = None,
    stock_name: Annotated[str | None, Query()] = None,
    oee_min: Annotated[float | None, Query()] = None,
    oee_max: Annotated[float | None, Query()] = None,
    validation_status: Annotated[list[str] | None, Query()] = None,
    has_issues: Annotated[bool | None, Query()] = None,
    sort: str | None = None,
    db: Session = Depends(get_db),
) -> StreamingResponse:
    flt = _build_filter(
        start=start, end=end, shift=shift, station_name=station_name,
        stock_name=stock_name, oee_min=oee_min, oee_max=oee_max,
        validation_status=validation_status, has_issues=has_issues,
    )

    def iter_csv() -> AsyncIterator[bytes]:
        yield b"\xef\xbb\xbf"
        for chunk in rows_to_csv_lines(stream_records(db, flt, sort=sort)):
            yield chunk.encode("utf-8")

    return StreamingResponse(
        iter_csv(),
        media_type="text/csv; charset=utf-8",
        headers={
            "Content-Disposition": f'attachment; filename="{csv_filename()}"',
            "Cache-Control": "no-store",
        },
    )


@router.get("/distinct/{column}")
def distinct(
    column: str,
    db: Session = Depends(get_db),
) -> list[str]:
    return distinct_values(db, column)


@router.get("/{record_id}")
def detail(
    record_id: int,
    db: Session = Depends(get_db),
) -> dict[str, object]:
    rec = get_record(db, record_id)
    if rec is None:
        raise NotFoundError(f"Record {record_id} bulunamadı.")
    return rec.model_dump()
