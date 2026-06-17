"""DB şemasını oluştur (create_all). Çalıştır: `make db-init`.

SQLite dosyası `apps/api/var/app.db` (gitignore'lu). var/ dizini yoksa oluşturulur.
"""
from __future__ import annotations

from pathlib import Path

from sqlalchemy import Index, inspect

from app.db import models
from app.db.base import Base
from app.db.session import engine


_EXTRA_INDEXES: tuple[Index, ...] = (
    Index("ix_record_oee", models.ProductionRecord.oee),
    Index("ix_record_stock_name", models.ProductionRecord.stock_name),
)


def init_db() -> None:
    Path("var").mkdir(exist_ok=True)
    Base.metadata.create_all(bind=engine)
    for idx in _EXTRA_INDEXES:
        idx.create(bind=engine, checkfirst=True)
    existing = set(inspect(engine).get_table_names())
    expected = set(Base.metadata.tables.keys())
    if not expected.issubset(existing):
        missing = expected - existing
        raise RuntimeError(f"DB init eksik tablolar: {sorted(missing)}")


if __name__ == "__main__":
    init_db()
    print("✓ DB şeması oluşturuldu (apps/api/var/app.db)")
