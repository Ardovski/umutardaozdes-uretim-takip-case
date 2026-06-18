"""v1 validation router — validation.api'yi mount eder."""
from __future__ import annotations

from fastapi import APIRouter

from app.features.validation.api import router as validation_router

router = APIRouter()
router.include_router(validation_router, tags=["validation"])
