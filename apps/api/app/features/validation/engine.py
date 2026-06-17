"""Validation engine — iki geçişli (row + batch) değerlendirme."""
from __future__ import annotations

import math
from collections import Counter
from typing import Any, Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db import models
from app.features.ingestion.hashers import row_hash_from_mapping
from app.features.validation.models import (
    Issue,
    IssueCategory,
    IssueSeverity,
    RecordStatus,
    RuleContext,
    SuggestedAction,
    ValidationResult,
)
from app.features.validation.rules.consistency import CONSISTENCY_RULES
from app.features.validation.rules.duplicate import DUPLICATE_RULES
from app.features.validation.rules.domain import DOMAIN_RULES
from app.features.validation.rules.format_ import FORMAT_RULES
from app.features.validation.rules.missing import MISSING_RULES
from app.features.validation.rules.range_ import RANGE_RULES


ALL_RULES: tuple[Any, ...] = (
    *MISSING_RULES,
    *RANGE_RULES,
    *CONSISTENCY_RULES,
    *DUPLICATE_RULES,
    *FORMAT_RULES,
    *DOMAIN_RULES,
)


def _build_context(current_file_hash: str | None = None) -> RuleContext:
    return RuleContext(
        tolerance_pct=settings.validation_tolerance_pct,
        p_suspect_upper=settings.validation_p_suspect_upper,
        p_impossible_upper=settings.validation_p_impossible_upper,
        minutes_per_day=settings.validation_minutes_per_day,
        outlier_z_threshold=settings.validation_outlier_z_threshold,
        work_order_pattern=settings.validation_work_order_pattern,
        station_pattern=settings.validation_station_pattern,
        window_start=settings.validation_report_window_start,
        window_end=settings.validation_report_window_end,
    )


def _attach_ctx_dynamic(ctx: RuleContext, db: Session) -> RuleContext:
    ctx.row_hash_seen = set()
    ctx.record_id_seen = {}
    ctx.file_hash_seen = set(
        db.execute(select(models.ImportBatch.file_hash)).scalars().all()
    )
    ctx.current_file_hash = None
    return ctx


def _check_row(record: Any, ctx: RuleContext) -> list[Issue]:
    out: list[Issue] = []
    for rule in ALL_RULES:
        try:
            res = rule.check(record, ctx)
        except Exception:
            continue
        if res is None:
            continue
        if isinstance(res, list):
            out.extend(res)
        else:
            out.append(res)
    return out


def _zscore_outliers(values: list[int], threshold: float) -> set[int]:
    if len(values) < 5:
        return set()
    mean = sum(values) / len(values)
    var = sum((v - mean) ** 2 for v in values) / len(values)
    std = math.sqrt(var) if var > 0 else 0.0
    if std == 0.0:
        return set()
    flagged: set[int] = set()
    for v in values:
        if abs((v - mean) / std) > threshold:
            flagged.add(int(v))
    return flagged


def _check_vd02_business_conflict(db: Session) -> dict[int, list[int]]:
    rows = db.execute(
        select(
            models.ProductionRecord.id,
            models.ProductionRecord.prod_date,
            models.ProductionRecord.shift,
            models.ProductionRecord.station_name,
            models.ProductionRecord.work_order_no,
            models.ProductionRecord.produced_qty,
            models.ProductionRecord.scrap_qty,
            models.ProductionRecord.oee,
        )
    ).all()
    bucket: dict[tuple[Any, Any, Any, Any], list[int]] = {}
    for r in rows:
        key = (r.prod_date, r.shift, r.station_name, r.work_order_no)
        bucket.setdefault(key, []).append(r[0])
    conflicts: dict[int, list[int]] = {}
    for key, ids in bucket.items():
        if len(ids) < 2:
            continue
        rows_in_key = [
            next(rr for rr in rows if rr[0] == rid) for rid in ids
        ]
        metrics: set[tuple[Any, ...]] = {
            (rr.produced_qty, rr.scrap_qty, rr.oee) for rr in rows_in_key
        }
        if len(metrics) > 1:
            for rid in ids:
                conflicts.setdefault(rid, []).extend(
                    [i for i in ids if i != rid]
                )
    return conflicts


def _build_record_proxy(model: models.ProductionRecord) -> Any:
    proxy = type("R", (), {})()
    for col in (
        "id",
        "record_id_src",
        "prod_date",
        "work_order_no",
        "work_center_no",
        "work_center_name",
        "station_name",
        "stock_name",
        "shift",
        "availability",
        "performance",
        "quality",
        "oee",
        "run_time",
        "down_time",
        "planned_down",
        "unplanned_down",
        "produced_qty",
        "scrap_qty",
        "row_hash",
        "status",
    ):
        setattr(proxy, col, getattr(model, col))
    return proxy


def _vd05_outlier_flag(db: Session, ctx: RuleContext) -> dict[int, str]:
    rows = db.execute(
        select(
            models.ProductionRecord.id,
            models.ProductionRecord.produced_qty,
        )
    ).all()
    flagged: dict[int, str] = {}
    values = [int(r.produced_qty) for r in rows if r.produced_qty is not None]
    outliers = _zscore_outliers(values, ctx.outlier_z_threshold)
    for rid, pq in rows:
        if pq is not None and int(pq) in outliers:
            flagged[int(rid)] = (
                f"Üretim miktarı ({int(pq)}) istatistiksel outlier "
                f"|z|>={ctx.outlier_z_threshold}."
            )
    return flagged


def _resolve_issues(
    results: dict[int, ValidationResult],
    conflict_map: dict[int, list[int]],
    outlier_map: dict[int, str],
) -> None:
    for rid, msg in outlier_map.items():
        results.setdefault(rid, ValidationResult(record_id=rid)).add(
            Issue(
                rule_id="V-X05",
                category=IssueCategory.DOMAIN,
                severity=IssueSeverity.WARNING,
                fields=("produced_qty",),
                message=msg,
                suggested_action=SuggestedAction.WARN,
            )
        )
    for rid, others in conflict_map.items():
        results.setdefault(rid, ValidationResult(record_id=rid)).add(
            Issue(
                rule_id="V-D02",
                category=IssueCategory.DUPLICATE,
                severity=IssueSeverity.WARNING,
                fields=("prod_date", "shift", "station_name", "work_order_no"),
                message=f"Çelişen kayıt(lar) var: ids={others}.",
                suggested_action=SuggestedAction.WARN,
            )
        )


def run_validation(
    db: Session,
    record_ids: Sequence[int] | None = None,
    current_file_hash: str | None = None,
) -> dict[int, ValidationResult]:
    ctx = _build_context(current_file_hash=current_file_hash)
    _attach_ctx_dynamic(ctx, db)

    if record_ids is None:
        models_iter = db.execute(select(models.ProductionRecord)).scalars().all()
    else:
        models_iter = db.execute(
            select(models.ProductionRecord).where(
                models.ProductionRecord.id.in_(record_ids)
            )
        ).scalars().all()

    results: dict[int, ValidationResult] = {}
    for m in models_iter:
        proxy = _build_record_proxy(m)
        issues = _check_row(proxy, ctx)
        res = ValidationResult(record_id=m.id)
        res.extend(issues)
        results[m.id] = res

    conflict_map = _check_vd02_business_conflict(db)
    outlier_map = _vd05_outlier_flag(db, ctx)
    _resolve_issues(results, conflict_map, outlier_map)

    for m in models_iter:
        status = results[m.id].status
        m.status = status.value
    db.flush()
    return results


def summarize(results: dict[int, ValidationResult]) -> dict[str, Any]:
    by_category: Counter[str] = Counter()
    by_severity: Counter[str] = Counter()
    by_rule: Counter[str] = Counter()
    by_status: Counter[str] = Counter()
    for r in results.values():
        by_status[r.status.value] += 1
        for i in r.issues:
            by_category[i.category.value] += 1
            by_severity[i.severity.value] += 1
            by_rule[i.rule_id] += 1
    return {
        "total_records": len(results),
        "by_status": dict(by_status),
        "by_category": dict(by_category),
        "by_severity": dict(by_severity),
        "by_rule": dict(by_rule),
    }
