"""Validation API router."""
from __future__ import annotations

import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.errors import NotFoundError
from app.db import models
from app.db.session import get_db
from app.features.validation.engine import run_validation, summarize
from app.features.validation.models import (
    Issue,
    IssueCategory,
    IssueSeverity,
    SuggestedAction,
)
from app.features.validation.report import full_report


router = APIRouter()


@router.post("/run")
def run(
    record_ids: list[int] | None = None,
    db: Session = Depends(get_db),
) -> dict[str, object]:
    results = run_validation(db, record_ids=record_ids)
    db.commit()
    return {"summary": summarize(results), "record_count": len(results)}


@router.get("/summary")
def summary(db: Session = Depends(get_db)) -> dict[str, object]:
    results = run_validation(db)
    db.commit()
    return summarize(results)


@router.get("/issues")
def issues(
    category: IssueCategory | None = None,
    severity: IssueSeverity | None = None,
    rule_id: str | None = None,
    db: Session = Depends(get_db),
) -> list[dict[str, object]]:
    rows = db.execute(
        select(models.ValidationIssue).order_by(models.ValidationIssue.id.desc())
    ).scalars().all()
    out: list[dict[str, object]] = []
    for r in rows:
        if category is not None and r.category != category:
            continue
        if severity is not None and r.severity != severity:
            continue
        if rule_id is not None and r.rule_id != rule_id:
            continue
        out.append(
            {
                "id": r.id,
                "record_id": r.record_id,
                "rule_id": r.rule_id,
                "category": r.category,
                "severity": r.severity,
                "fields": r.field_names,
                "message": r.message,
                "suggested_action": r.suggested_action,
                "detected_at": r.detected_at.isoformat() if r.detected_at else None,
                "fixed_at": r.fixed_at.isoformat() if r.fixed_at else None,
                "status": r.status,
            }
        )
    return out


@router.get("/report")
def report(db: Session = Depends(get_db)) -> dict[str, object]:
    results = run_validation(db)
    db.commit()
    return full_report(results)


def _record_or_404(db: Session, record_id: int) -> models.ProductionRecord:
    rec = db.get(models.ProductionRecord, record_id)
    if rec is None:
        raise NotFoundError(f"Record {record_id} bulunamadı.")
    return rec


def _to_dict(rec: models.ProductionRecord) -> dict[str, object]:
    return {c.name: getattr(rec, c.name) for c in rec.__table__.columns}


@router.post("/records/{record_id}/fix")
def fix_record(
    record_id: int,
    patch: dict[str, object],
    db: Session = Depends(get_db),
) -> dict[str, object]:
    rec = _record_or_404(db, record_id)
    before = _to_dict(rec)
    for k, v in patch.items():
        if hasattr(rec, k):
            setattr(rec, k, v)
    rec.status = "valid"
    db.add(
        models.RecordEdit(
            record_id=rec.id,
            field="status",
            old_value=json.dumps(before, default=str, ensure_ascii=False),
            new_value=json.dumps(_to_dict(rec), default=str, ensure_ascii=False),
            reason="manual_fix",
            edited_by="operator",
        )
    )
    db.flush()
    return {"record_id": rec.id, "status": rec.status}


@router.post("/records/{record_id}/reject")
def reject_record(
    record_id: int,
    payload: dict[str, object] | None = None,
    db: Session = Depends(get_db),
) -> dict[str, object]:
    rec = _record_or_404(db, record_id)
    reason_in = (payload or {}).get("reason")
    before = _to_dict(rec)
    rec.status = "rejected"
    db.add(
        models.RecordEdit(
            record_id=rec.id,
            field="status",
            old_value=json.dumps(before, default=str, ensure_ascii=False),
            new_value=json.dumps(_to_dict(rec), default=str, ensure_ascii=False),
            reason=f"reject:{reason_in}" if reason_in else "reject",
            edited_by="operator",
        )
    )
    db.flush()
    return {"record_id": rec.id, "status": rec.status}


@router.post("/records/{record_id}/accept")
def accept_record(
    record_id: int,
    payload: dict[str, object] | None = None,
    db: Session = Depends(get_db),
) -> dict[str, object]:
    rec = _record_or_404(db, record_id)
    reason_in = (payload or {}).get("reason")
    before = _to_dict(rec)
    rec.status = "valid"
    db.add(
        models.RecordEdit(
            record_id=rec.id,
            field="status",
            old_value=json.dumps(before, default=str, ensure_ascii=False),
            new_value=json.dumps(_to_dict(rec), default=str, ensure_ascii=False),
            reason=f"accept:{reason_in}" if reason_in else "accept",
            edited_by="operator",
        )
    )
    db.flush()
    return {"record_id": rec.id, "status": rec.status}


@router.get("/records/{record_id}/edits")
def list_edits(
    record_id: int,
    db: Session = Depends(get_db),
) -> list[dict[str, object]]:
    rec = _record_or_404(db, record_id)
    rows = db.execute(
        select(models.RecordEdit)
        .where(models.RecordEdit.record_id == rec.id)
        .order_by(models.RecordEdit.edited_at.desc())
    ).scalars().all()
    return [
        {
            "id": r.id,
            "field": r.field,
            "old_value": r.old_value,
            "new_value": r.new_value,
            "reason": r.reason,
            "edited_by": r.edited_by,
            "edited_at": r.edited_at.isoformat() if r.edited_at else None,
        }
        for r in rows
    ]
