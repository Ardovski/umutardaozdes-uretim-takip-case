"""Hashleme yardımcıları — file_hash (SHA-256) + row_hash (kanonik JSON)."""
from __future__ import annotations

import hashlib
import json
from collections.abc import Mapping
from typing import Any


def file_hash_from_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def row_hash_from_mapping(row: Mapping[str, Any]) -> str:
    canonical = json.dumps(
        {k: row.get(k) for k in sorted(row.keys()) if k != "row_hash"},
        ensure_ascii=False,
        sort_keys=True,
        default=str,
        separators=(",", ":"),
    )
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()
