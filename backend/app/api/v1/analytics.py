"""v1 analytics router — analytics.api'yi mount eder."""
from __future__ import annotations

from fastapi import APIRouter

from app.features.analytics.api import router as analytics_router

router = APIRouter()
router.include_router(analytics_router, tags=["analytics"])
