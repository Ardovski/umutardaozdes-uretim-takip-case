"""v1 imports router — ingestion.api'yi mount eder."""
from __future__ import annotations

from fastapi import APIRouter

from app.features.ingestion.api import router as ingestion_router

router = APIRouter()
router.include_router(ingestion_router, tags=["imports"])
