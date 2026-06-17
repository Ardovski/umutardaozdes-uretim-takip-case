"""Rule taban sınıfı — tüm kurallar bundan türer."""
from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Sequence
from typing import Any

from app.features.validation.models import (
    Issue,
    IssueCategory,
    IssueSeverity,
    RuleContext,
    SuggestedAction,
)


class Rule(ABC):
    id: str = ""
    category: IssueCategory = IssueCategory.MISSING
    severity: IssueSeverity = IssueSeverity.WARNING
    action: SuggestedAction = SuggestedAction.WARN
    fields: tuple[str, ...] = ()

    @abstractmethod
    def check(self, record: Any, ctx: RuleContext) -> Issue | None:
        ...

    def make_issue(self, message: str) -> Issue:
        return Issue(
            rule_id=self.id,
            category=self.category,
            severity=self.severity,
            fields=self.fields,
            message=message,
            suggested_action=self.action,
        )


class CompositeRule(Rule):
    def __init__(self, rules: Sequence[Rule]) -> None:
        self._rules: list[Rule] = list(rules)

    @property
    def id(self) -> str:  # type: ignore[override]
        return "+".join(r.id for r in self._rules)

    def check(self, record: Any, ctx: RuleContext) -> list[Issue] | None:
        out: list[Issue] = []
        for r in self._rules:
            res = r.check(record, ctx)
            if res is None:
                continue
            if isinstance(res, list):
                out.extend(res)
            else:
                out.append(res)
        return out or None
