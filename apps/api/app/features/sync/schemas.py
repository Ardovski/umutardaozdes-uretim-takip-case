"""Sync Pydantic şemaları."""
from __future__ import annotations

import datetime as dt

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
    oe_value: float | None = None
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
    http_status: int | None = None
    target_submission_id: int | None = None
    attempts: int
    last_attempt_at: dt.datetime | None = None
    created_at: dt.datetime | None = None
    error_message: str | None = None
    response_body: str | None = None


class SubmitRequest(BaseModel):
    production_date: dt.date | None = None
    shift: int | None = None
    force: bool = Field(default=False)


class SubmitResponse(BaseModel):
    accepted: list[int] = Field(default_factory=list)
    skipped_already_success: list[str] = Field(default_factory=list)
    rejected_due_to_hash_conflict: list[str] = Field(default_factory=list)
    submission_ids: list[int] = Field(default_factory=list)
