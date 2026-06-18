"""DB şemasını oluştur (create_all). Çalıştır: `make db-init`.

SQLite dosyası repo kökündeki `db/app.db` (gitignore'lu). db/ dizini yoksa oluşturulur.
"""
from __future__ import annotations

from sqlalchemy import Index, inspect

from app.core.config import DB_DIR
from app.db import models
from app.db.base import Base
from app.db.session import engine

_EXTRA_INDEXES: tuple[Index, ...] = (
    Index("ix_record_oee", models.ProductionRecord.oee),
    Index("ix_record_stock_name", models.ProductionRecord.stock_name),
)


def init_db() -> None:
    DB_DIR.mkdir(parents=True, exist_ok=True)
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
    print(f"✓ DB şeması oluşturuldu ({DB_DIR / 'app.db'})")
