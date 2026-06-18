"""v1 records router — records.api'yi mount eder."""
from __future__ import annotations

from fastapi import APIRouter

from app.features.records.api import router as records_router

router = APIRouter()
router.include_router(records_router, tags=["records"])
