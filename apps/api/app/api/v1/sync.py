"""v1 sync router — sync.api'yi mount eder."""
from __future__ import annotations

from fastapi import APIRouter

from app.features.sync.api import router as sync_router

router = APIRouter()
router.include_router(sync_router, tags=["sync"])
