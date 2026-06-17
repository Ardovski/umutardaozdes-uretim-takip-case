"""Sync HTTP client — X-Production-Key header + secret redaction."""
from __future__ import annotations

import logging
from typing import Any

import httpx

from app.core.config import settings


_logger = logging.getLogger("sync.client")

REDACTED: str = "***REDACTED***"


class PermanentSyncError(Exception):
    def __init__(self, status_code: int, message: str) -> None:
        super().__init__(message)
        self.status_code = int(status_code)
        self.message = message


class TransientSyncError(Exception):
    def __init__(self, status_code: int, message: str) -> None:
        super().__init__(message)
        self.status_code = int(status_code)
        self.message = message


def _headers() -> dict[str, str]:
    return {
        "Content-Type": "application/json",
        "X-Production-Key": settings.target_api_key,
    }


def submit_payload(
    payload: dict[str, Any],
    idempotency_key: str,
    timeout: float | None = None,
) -> tuple[int, dict[str, Any]]:
    url = settings.target_submit_url
    headers = _headers()
    _logger.info(
        "sync.submit url=%s idem=%s key=%s",
        url,
        idempotency_key,
        REDACTED,
        extra={"key": REDACTED, "idempotency_key": idempotency_key},
    )
    client_timeout = timeout if timeout is not None else float(settings.target_api_timeout_seconds)
    try:
        with httpx.Client(timeout=client_timeout) as client:
            response = client.post(url, json=payload, headers=headers)
    except httpx.TimeoutException as exc:
        raise TransientSyncError(0, f"timeout: {exc.__class__.__name__}") from exc
    except httpx.ConnectError as exc:
        raise TransientSyncError(0, f"connect_error: {exc.__class__.__name__}") from exc
    except httpx.HTTPError as exc:
        raise TransientSyncError(0, f"http_error: {exc.__class__.__name__}") from exc

    status = int(response.status_code)
    body: dict[str, Any]
    try:
        body = response.json()
    except ValueError:
        body = {"raw": response.text[:1000]}

    _logger.info(
        "sync.submit.response status=%s idem=%s key=%s",
        status,
        idempotency_key,
        REDACTED,
        extra={"key": REDACTED, "idempotency_key": idempotency_key, "status": status},
    )
    return status, body
