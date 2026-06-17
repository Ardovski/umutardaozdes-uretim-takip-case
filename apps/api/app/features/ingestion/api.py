"""Ingestion API router — preview + import endpoint'leri."""
from __future__ import annotations

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.features.ingestion.schemas import ImportPreview, ImportSummary
from app.features.ingestion.service import import_csv, preview_csv


router = APIRouter()


@router.post("/preview", response_model=ImportPreview)
def preview(file: UploadFile = File(...)) -> ImportPreview:
    if file.filename is None:
        raise HTTPException(status_code=400, detail="filename gerekli")
    data = file.file.read()
    if not data:
        raise HTTPException(status_code=400, detail="dosya boş")
    return preview_csv(data, file.filename)


@router.post("/import", response_model=ImportSummary)
def import_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> ImportSummary:
    if file.filename is None:
        raise HTTPException(status_code=400, detail="filename gerekli")
    data = file.file.read()
    if not data:
        raise HTTPException(status_code=400, detail="dosya boş")
    return import_csv(db, data, file.filename)
