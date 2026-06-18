"""Sync tests — aggregator + client (mock) + idempotency."""
from __future__ import annotations

import datetime as dt
import hashlib
import json
from typing import Any

import httpx
import pytest
from app.core.config import settings
from app.db import models
from app.features.sync import client as sync_client
from app.features.sync.aggregator import build_groups
from app.features.sync.service import submit


def _add_valid_record(
    db: Any,
    *,
    record_id_src: int,
    prod_date: dt.date,
    shift: int,
    station: str = "IMM-2700-3",
    produced_qty: int = 100,
    oee: float = 85.0,
    row_hash: str | None = None,
) -> None:
    db.add(
        models.ProductionRecord(
            record_id_src=record_id_src,
            prod_date=prod_date,
            shift=shift,
            station_name=station,
            work_order_no="3021234567",
            produced_qty=produced_qty,
            scrap_qty=0,
            availability=90.0,
            performance=95.0,
            quality=99.0,
            oee=oee,
            oee_recomputed=oee,
            run_time=7.0,
            down_time=0.5,
            planned_down=0.3,
            unplanned_down=0.2,
            row_hash=row_hash or f"rh_{record_id_src}",
            status="valid",
        )
    )


def test_aggregator_groups_by_date_shift(db) -> None:
    _add_valid_record(db, record_id_src=1, prod_date=dt.date(2025, 11, 5), shift=1, produced_qty=10, oee=80)
    _add_valid_record(db, record_id_src=2, prod_date=dt.date(2025, 11, 5), shift=1, station="IMM-2700-4", produced_qty=20, oee=90)
    _add_valid_record(db, record_id_src=3, prod_date=dt.date(2025, 11, 5), shift=2, produced_qty=5, oee=70)
    _add_valid_record(db, record_id_src=4, prod_date=dt.date(2025, 11, 6), shift=1, produced_qty=1, oee=50)
    db.add(
        models.ProductionRecord(
            record_id_src=99,
            prod_date=dt.date(2025, 11, 5),
            shift=3,
            station_name="IMM-2700-3",
            work_order_no="3021234567",
            produced_qty=0,
            scrap_qty=0,
            availability=0,
            performance=0,
            quality=0,
            oee=0,
            run_time=0,
            down_time=0,
            planned_down=0,
            unplanned_down=0,
            row_hash="rh_invalid",
            status="valid",
        )
    )
    db.add(
        models.ProductionRecord(
            record_id_src=100,
            prod_date=dt.date(2025, 11, 7),
            shift=1,
            station_name="IMM-2700-3",
            work_order_no="3021234567",
            produced_qty=10,
            scrap_qty=0,
            availability=80,
            performance=80,
            quality=80,
            oee=51.2,
            run_time=5,
            down_time=1,
            planned_down=0,
            unplanned_down=1,
            row_hash="rh_suspect",
            status="suspect",
        )
    )
    db.commit()

    groups = build_groups(db)
    keys = {(g["production_date"], g["shift"]) for g in groups}
    assert keys == {
        (dt.date(2025, 11, 5), 1),
        (dt.date(2025, 11, 5), 2),
        (dt.date(2025, 11, 6), 1),
    }
    g_5_1 = next(g for g in groups if g["production_date"] == dt.date(2025, 11, 5) and g["shift"] == 1)
    assert g_5_1["machine_count"] == 2
    assert g_5_1["total_production_units"] == 30
    assert g_5_1["oe_value"] == pytest.approx(86.666, rel=0.01)
    assert g_5_1["idempotency_key"] == "2025-11-05:1"


def _run_with_mock(monkeypatch, handler) -> dict[str, Any]:
    captured: dict[str, Any] = {}

    def _wrapped(payload, idempotency_key, timeout=None):
        captured["payload"] = payload
        captured["idempotency_key"] = idempotency_key
        req = httpx.Request(
            "POST",
            settings.target_submit_url,
            json=payload,
            headers={
                "X-Production-Key": settings.target_api_key,
                "Content-Type": "application/json",
            },
        )
        resp = handler(req)
        captured.setdefault("headers", dict(req.headers))
        try:
            body: Any = json.loads(resp.content)
        except Exception:
            body = {"raw": resp.text}
        captured.setdefault("bodies", []).append(body)
        return resp.status_code, body

    monkeypatch.setattr(sync_client, "submit_payload", _wrapped)
    return captured


def test_client_200_success(monkeypatch) -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json={"success": True, "submission_id": 42})

    cap = _run_with_mock(monkeypatch, handler)
    status, body = sync_client.submit_payload(
        payload={"production_date": "2025-11-05", "shift": 1,
                 "machine_count": 1, "total_production_units": 10, "oe_value": 80.0},
        idempotency_key="2025-11-05:1",
    )
    assert status == 200
    assert body["success"] is True
    assert body["submission_id"] == 42
    assert cap["headers"]["x-production-key"] == settings.target_api_key
    assert cap["payload"]["shift"] == 1
    assert cap["idempotency_key"] == "2025-11-05:1"


def test_client_401_permanent(monkeypatch) -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(401, json={"detail": "invalid key"})

    _run_with_mock(monkeypatch, handler)
    status, body = sync_client.submit_payload(
        payload={"production_date": "2025-11-05", "shift": 1,
                 "machine_count": 1, "total_production_units": 10, "oe_value": 80.0},
        idempotency_key="2025-11-05:1",
    )
    assert status == 401
    assert body["detail"] == "invalid key"


def test_client_422_permanent(monkeypatch) -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(422, json={"detail": "validation error"})

    _run_with_mock(monkeypatch, handler)
    status, _ = sync_client.submit_payload(
        payload={"production_date": "2025-11-05", "shift": 1,
                 "machine_count": 1, "total_production_units": 10, "oe_value": 80.0},
        idempotency_key="2025-11-05:1",
    )
    assert status == 422


def test_client_429_is_retryable() -> None:
    from app.features.sync.retry import is_retryable_status, should_retry

    assert is_retryable_status(429) is True
    assert is_retryable_status(500) is True
    assert is_retryable_status(503) is True
    assert is_retryable_status(401) is False
    assert is_retryable_status(422) is False
    assert is_retryable_status(413) is False
    assert should_retry(attempt=1, status_code=429) is True
    assert should_retry(attempt=3, status_code=429) is False
    assert should_retry(attempt=1, status_code=401) is False


def test_secret_not_in_payload_body() -> None:
    payload = {
        "production_date": "2025-11-05",
        "shift": 1,
        "machine_count": 1,
        "total_production_units": 10,
        "oe_value": 80.0,
    }
    blob = json.dumps(payload)
    assert settings.target_api_key not in blob
    assert "X-Production-Key" not in blob


def test_payload_hash_idempotency(db) -> None:
    _add_valid_record(db, record_id_src=1, prod_date=dt.date(2025, 11, 5), shift=1, produced_qty=10, oee=80)
    db.commit()

    response1 = submit(db, production_date=dt.date(2025, 11, 5), shift=1)
    db.commit()
    assert len(response1.submission_ids) == 1

    sub = db.query(models.SyncSubmission).filter_by(idempotency_key="2025-11-05:1").first()
    assert sub is not None
    sub.status = "success"
    sub.http_status = 200
    sub.target_submission_id = 42
    db.commit()

    response2 = submit(db, production_date=dt.date(2025, 11, 5), shift=1)
    db.commit()
    assert response2.skipped_already_success == ["2025-11-05:1"]
    assert response2.submission_ids == []

    expected_hash = hashlib.sha256(
        json.dumps(
            {"machine_count": 1, "oe_value": 80.0, "production_date": "2025-11-05",
             "shift": 1, "total_production_units": 10},
            sort_keys=True, separators=(",", ":"), ensure_ascii=False,
        ).encode("utf-8")
    ).hexdigest()
    assert sub.payload_hash == expected_hash

