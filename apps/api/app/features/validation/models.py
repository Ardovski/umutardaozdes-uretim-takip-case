"""Validation domain modelleri — Enum + Issue + record status türetme."""
from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass, field
from enum import StrEnum


class IssueCategory(StrEnum):
    MISSING = "missing"
    RANGE = "range"
    CONSISTENCY = "consistency"
    DUPLICATE = "duplicate"
    FORMAT = "format"
    DOMAIN = "domain"


class IssueSeverity(StrEnum):
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"


class SuggestedAction(StrEnum):
    REJECT = "reject"
    WARN = "warn"
    FIX = "fix"


class RecordStatus(StrEnum):
    VALID = "valid"
    SUSPECT = "suspect"
    REJECTED = "rejected"


@dataclass(frozen=True)
class Issue:
    rule_id: str
    category: IssueCategory
    severity: IssueSeverity
    fields: tuple[str, ...]
    message: str
    suggested_action: SuggestedAction


@dataclass
class RuleContext:
    tolerance_pct: float
    p_suspect_upper: float
    p_impossible_upper: float
    minutes_per_day: int
    outlier_z_threshold: float
    work_order_pattern: str
    station_pattern: str
    window_start: str
    window_end: str


@dataclass
class ValidationResult:
    record_id: int
    issues: list[Issue] = field(default_factory=list)

    def add(self, issue: Issue) -> None:
        self.issues.append(issue)

    def extend(self, issues: Sequence[Issue]) -> None:
        self.issues.extend(issues)

    @property
    def has_error(self) -> bool:
        return any(i.severity == IssueSeverity.ERROR for i in self.issues)

    @property
    def has_warning(self) -> bool:
        return any(i.severity == IssueSeverity.WARNING for i in self.issues)

    @property
    def status(self) -> RecordStatus:
        if self.has_error:
            return RecordStatus.REJECTED
        if self.has_warning:
            return RecordStatus.SUSPECT
        return RecordStatus.VALID
