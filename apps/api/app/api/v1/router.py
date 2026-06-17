"""API v1 router toplayıcı. Feature router'ları buraya mount edilir."""
from __future__ import annotations

from fastapi import APIRouter

api_router = APIRouter()


@api_router.get("/status", tags=["meta"])
def status() -> dict[str, str]:
    return {"status": "ok", "api": "v1"}


# --- Faz 1+ : feature router'ları (implementasyon sırasında açılacak) ---
# from app.features.ingestion.router import router as imports_router
# from app.features.records.router import router as records_router
# from app.features.validation.router import router as validation_router
# from app.features.analytics.router import router as analytics_router
# from app.features.sync.router import router as sync_router
#
# api_router.include_router(imports_router, prefix="/imports", tags=["import"])
# api_router.include_router(records_router, prefix="/records", tags=["records"])
# api_router.include_router(validation_router, prefix="/validation", tags=["validation"])
# api_router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])
# api_router.include_router(sync_router, prefix="/sync", tags=["sync"])
