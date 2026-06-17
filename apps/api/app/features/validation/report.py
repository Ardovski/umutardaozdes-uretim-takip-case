"""Validation report — kategori/severity dağılımı + sistemik vs tekil tespiti."""
from __future__ import annotations

from collections import Counter
from typing import Any, Sequence

from app.core.config import settings
from app.features.validation.models import (
    Issue,
    IssueCategory,
    IssueSeverity,
    ValidationResult,
)


def category_breakdown(results: dict[int, ValidationResult]) -> dict[str, int]:
    c: Counter[str] = Counter()
    for r in results.values():
        for i in r.issues:
            c[i.category.value] += 1
    return dict(c)


def severity_breakdown(results: dict[int, ValidationResult]) -> dict[str, int]:
    s: Counter[str] = Counter()
    for r in results.values():
        for i in r.issues:
            s[i.severity.value] += 1
    return dict(s)


def rule_breakdown(results: dict[int, ValidationResult]) -> dict[str, int]:
    r: Counter[str] = Counter()
    for res in results.values():
        for i in res.issues:
            r[i.rule_id] += 1
    return dict(r)


def systemic_vs_unique(
    results: dict[int, ValidationResult],
    threshold_ratio: float | None = None,
) -> dict[str, list[str]]:
    if threshold_ratio is None:
        threshold_ratio = settings.validation_systemic_ratio
    total = max(len(results), 1)
    rb = rule_breakdown(results)
    systemic: list[str] = []
    unique: list[str] = []
    for rule_id, count in rb.items():
        if (count / total) >= threshold_ratio:
            systemic.append(rule_id)
        else:
            unique.append(rule_id)
    return {"systemic": sorted(systemic), "unique": sorted(unique)}


def issue_to_dict(issue: Issue) -> dict[str, Any]:
    return {
        "rule_id": issue.rule_id,
        "category": issue.category.value,
        "severity": issue.severity.value,
        "fields": list(issue.fields),
        "message": issue.message,
        "suggested_action": issue.suggested_action.value,
    }


def record_payload(record_id: int, result: ValidationResult) -> dict[str, Any]:
    return {
        "record_id": record_id,
        "issues": [issue_to_dict(i) for i in result.issues],
        "record_status": result.status.value,
    }


def full_report(results: dict[int, ValidationResult]) -> dict[str, Any]:
    return {
        "summary": {
            "total_records": len(results),
            "by_category": category_breakdown(results),
            "by_severity": severity_breakdown(results),
            "by_rule": rule_breakdown(results),
        },
        "systemic_vs_unique": systemic_vs_unique(results),
        "records": [record_payload(rid, r) for rid, r in results.items()],
    }
