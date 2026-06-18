"""Sync API router."""
from __future__ import annotations

import datetime as dt
from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.errors import NotFoundError
from app.db.session import get_db
from app.features.sync.schemas import SubmitRequest, SubmitResponse
from app.features.sync.service import (
    execute_pending,
    history,
    preview,
    retry_submission,
    submit,
)

router = APIRouter()


@router.get("/preview")
def preview_endpoint(db: Session = Depends(get_db)) -> dict[str, object]:
    return preview(db).model_dump()


@router.post("/submit", status_code=202)
def submit_endpoint(
    payload: SubmitRequest,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
) -> SubmitResponse:
    if (
        payload.production_date is not None
        and payload.shift is not None
        and int(payload.shift) not in (1, 2, 3)
    ):
        raise HTTPException(status_code=422, detail="shift 1/2/3 olmalı")
    targets: list[tuple[dt.date, int]] | None = None
    if payload.targets:
        for t in payload.targets:
            if int(t.shift) not in (1, 2, 3):
                raise HTTPException(status_code=422, detail="shift 1/2/3 olmalı")
        targets = [(t.production_date, int(t.shift)) for t in payload.targets]
    response = submit(
        db,
        production_date=payload.production_date,
        shift=payload.shift,
        targets=targets,
        force=payload.force,
    )
    if response.submission_ids:
        background.add_task(_run_in_background, response.submission_ids)
    return response


@router.get("/history")
def history_endpoint(
    status: Annotated[str | None, Query()] = None,
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[dict[str, object]]:
    items = history(db, limit=limit, status=status)
    return [i.model_dump() for i in items]


@router.post("/{submission_id}/retry")
def retry_endpoint(
    submission_id: int,
    db: Session = Depends(get_db),
) -> dict[str, object]:
    out = retry_submission(db, submission_id)
    if out is None:
        raise NotFoundError(f"SyncSubmission {submission_id} bulunamadı.")
    return out.model_dump()


def _run_in_background(submission_ids: list[int]) -> None:
    from app.db.session import SessionLocal

    db = SessionLocal()
    try:
        execute_pending(db, submission_ids)
    finally:
        db.close()
