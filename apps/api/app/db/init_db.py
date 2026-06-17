"""DB şemasını oluştur (create_all). Çalıştır: `make db-init`.

SQLite dosyası `apps/api/var/app.db` (gitignore'lu). var/ dizini yoksa oluşturulur.
"""
from __future__ import annotations

from pathlib import Path

from app.db import models  # noqa: F401  — modelleri Base.metadata'ya kaydetmek için import şart
from app.db.base import Base
from app.db.session import engine


def init_db() -> None:
    Path("var").mkdir(exist_ok=True)
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("✓ DB şeması oluşturuldu (apps/api/var/app.db)")
