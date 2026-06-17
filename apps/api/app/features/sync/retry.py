"""Sync retry policy — sadece 429 + 5xx; 401/422/413 kalıcı hata."""
from __future__ import annotations

import httpx

from app.core.config import settings


_RETRYABLE_STATUSES: frozenset[int] = frozenset({429, 500, 502, 503, 504})


def is_retryable_status(status_code: int) -> bool:
    return int(status_code) in _RETRYABLE_STATUSES


def is_retryable_exception(exc: BaseException) -> bool:
    if isinstance(exc, httpx.TimeoutException):
        return True
    if isinstance(exc, httpx.ConnectError):
        return True
    if isinstance(exc, httpx.RemoteProtocolError):
        return True
    return False


def should_retry(
    *,
    attempt: int,
    status_code: int | None = None,
    exc: BaseException | None = None,
) -> bool:
    if attempt >= settings.target_api_max_retries:
        return False
    if exc is not None:
        return is_retryable_exception(exc)
    if status_code is None:
        return False
    return is_retryable_status(int(status_code))


def compute_backoff(attempt: int) -> float:
    base = float(settings.target_api_backoff_base_seconds)
    return float(base ** max(attempt, 1))


def cooldown_after_rate_limit() -> float:
    return float(settings.target_api_rate_limit_cooldown_seconds)
