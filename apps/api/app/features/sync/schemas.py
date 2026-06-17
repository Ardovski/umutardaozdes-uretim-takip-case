"""Sync Pydantic şemaları."""
from __future__ import annotations

import datetime as dt
from typing import Optional

from pydantic import BaseModel, Field


class SyncPayload(BaseModel):
    production_date: dt.date
    shift: int
    machine_count: int
    total_production_units: int
    oe_value: float


class SyncGroupPreview(BaseModel):
    production_date: dt.date
    shift: int
    machine_count: int
    total_production_units: int
    oe_value: Optional[float] = None
    idempotency_key: str
    payload_hash: str
    source_record_count: int


class SyncPreview(BaseModel):
    groups: list[SyncGroupPreview]
    total_groups: int


class SubmissionOut(BaseModel):
    id: int
    prod_date: dt.date
    shift: int
    idempotency_key: str
    payload_hash: str
    status: str
    http_status: Optional[int] = None
    target_submission_id: Optional[int] = None
    attempts: int
    last_attempt_at: Optional[dt.datetime] = None
    created_at: Optional[dt.datetime] = None
    error_message: Optional[str] = None
    response_body: Optional[str] = None


class SubmitRequest(BaseModel):
    production_date: Optional[dt.date] = None
    shift: Optional[int] = None
    force: bool = Field(default=False)


class SubmitResponse(BaseModel):
    accepted: list[int] = Field(default_factory=list)
    skipped_already_success: list[str] = Field(default_factory=list)
    rejected_due_to_hash_conflict: list[str] = Field(default_factory=list)
    submission_ids: list[int] = Field(default_factory=list)
