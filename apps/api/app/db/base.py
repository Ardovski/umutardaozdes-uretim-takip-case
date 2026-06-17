"""SQLAlchemy declarative Base — tüm modeller bundan türer."""
from __future__ import annotations

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Ortak taban sınıf. Metadata buradan toplanır (create_all)."""
