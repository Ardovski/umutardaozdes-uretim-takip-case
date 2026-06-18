"""Sync aggregator — valid kayıtları (date,shift) bazında agrege."""
from __future__ import annotations

import datetime as dt
import hashlib
import json
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db import models


def _canonical_json(payload: dict[str, Any]) -> str:
    return json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _payload_hash(payload: dict[str, Any]) -> str:
    return hashlib.sha256(_canonical_json(payload).encode("utf-8")).hexdigest()


def _build_payload(
    production_date: dt.date,
    shift: int,
    machine_count: int,
    total_production_units: int,
    oe_value: float,
) -> dict[str, Any]:
    return {
        "production_date": production_date.isoformat(),
        "shift": int(shift),
        "machine_count": int(machine_count),
        "total_production_units": int(total_production_units),
        "oe_value": float(round(oe_value, 4)),
    }


def _idempotency_key(production_date: dt.date, shift: int) -> str:
    return f"{production_date.isoformat()}:{int(shift)}"


def build_groups(db: Session) -> list[dict[str, Any]]:
    stmt = (
        select(
            models.ProductionRecord.prod_date.label("d"),
            models.ProductionRecord.shift.label("s"),
            func.count(func.distinct(models.ProductionRecord.station_name)).label("machine_count"),
            func.coalesce(func.sum(models.ProductionRecord.produced_qty), 0).label("total_units"),
            func.sum(
                models.ProductionRecord.oee_recomputed * func.coalesce(models.ProductionRecord.produced_qty, 0)
            ).label("oee_num"),
            func.sum(func.coalesce(models.ProductionRecord.produced_qty, 0)).label("oee_den"),
            func.count(models.ProductionRecord.id).label("record_count"),
        )
        .where(
            models.ProductionRecord.status == "valid",
            models.ProductionRecord.prod_date.isnot(None),
            models.ProductionRecord.shift.isnot(None),
        )
        .group_by(models.ProductionRecord.prod_date, models.ProductionRecord.shift)
        .order_by(models.ProductionRecord.prod_date.asc(), models.ProductionRecord.shift.asc())
    )
    rows = db.execute(stmt).all()
    out: list[dict[str, Any]] = []
    for r in rows:
        production_date: dt.date = r.d
        shift: int = int(r.s)
        machine_count: int = int(r.machine_count or 0)
        total_units: int = int(r.total_units or 0)
        if total_units <= 0:
            continue
        oee_num = float(r.oee_num or 0.0)
        oee_den = float(r.oee_den or 0.0)
        oe_value: float = (oee_num / oee_den) if oee_den > 0 else 0.0
        payload = _build_payload(
            production_date=production_date,
            shift=shift,
            machine_count=machine_count,
            total_production_units=total_units,
            oe_value=oe_value,
        )
        ph = _payload_hash(payload)
        out.append(
            {
                "production_date": production_date,
                "shift": shift,
                "machine_count": machine_count,
                "total_production_units": total_units,
                "oe_value": round(oe_value, 4),
                "idempotency_key": _idempotency_key(production_date, shift),
                "payload_hash": ph,
                "payload": payload,
                "source_record_count": int(r.record_count or 0),
            }
        )
    return out


def build_group(
    db: Session,
    production_date: dt.date,
    shift: int,
) -> dict[str, Any] | None:
    stmt = (
        select(
            func.count(func.distinct(models.ProductionRecord.station_name)).label("machine_count"),
            func.coalesce(func.sum(models.ProductionRecord.produced_qty), 0).label("total_units"),
            func.sum(
                models.ProductionRecord.oee_recomputed * func.coalesce(models.ProductionRecord.produced_qty, 0)
            ).label("oee_num"),
            func.sum(func.coalesce(models.ProductionRecord.produced_qty, 0)).label("oee_den"),
            func.count(models.ProductionRecord.id).label("record_count"),
        )
        .where(
            models.ProductionRecord.status == "valid",
            models.ProductionRecord.prod_date == production_date,
            models.ProductionRecord.shift == shift,
        )
    )
    row = db.execute(stmt).one()
    total_units = int(row.total_units or 0)
    if total_units <= 0:
        return None
    machine_count = int(row.machine_count or 0)
    oee_num = float(row.oee_num or 0.0)
    oee_den = float(row.oee_den or 0.0)
    oe_value: float = (oee_num / oee_den) if oee_den > 0 else 0.0
    payload = _build_payload(production_date, shift, machine_count, total_units, oe_value)
    return {
        "production_date": production_date,
        "shift": int(shift),
        "machine_count": machine_count,
        "total_production_units": total_units,
        "oe_value": round(oe_value, 4),
        "idempotency_key": _idempotency_key(production_date, shift),
        "payload_hash": _payload_hash(payload),
        "payload": payload,
        "source_record_count": int(row.record_count or 0),
    }
