"""Yapılandırılmış logging kurulumu — 3 seviye ayrı dosyalara.

Çıktılar (repo kökü `logs/backend/` altında):
  info.log     → INFO  ve üstü (WARNING, ERROR, CRITICAL)
  warning.log  → WARNING ve üstü (ERROR, CRITICAL)
  error.log    → ERROR ve CRITICAL

Her seviye dosyası append modunda açılır; uvicorn reload sırasında handler'lar
tekrar eklenmez (idempotent). Konsola (stderr) da yazılır — geliştirme için.

Secret ASLA log'lanmaz. PII (kişisel veri) de loglanmamalı; burası operatöre
hata ayıklama çıktısıdır, kullanıcı datası değil.
"""

from __future__ import annotations

import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

from app.core.config import LOG_DIR, settings

_FORMAT = "%(asctime)s | %(levelname)-7s | %(name)s | %(message)s"

# Dosya başına byte limiti + yedek sayısı: ~5MB × 4 yedek = ~25MB/level toplam.
_ROTATING_MAX_BYTES = 5 * 1024 * 1024
_ROTATING_BACKUP_COUNT = 4


def _make_file_handler(path: Path, level: int) -> RotatingFileHandler:
    """Belirtilen seviye ve dosyaya yazan, rotasyonlu bir handler döndürür."""
    path.parent.mkdir(parents=True, exist_ok=True)
    handler = RotatingFileHandler(
        path,
        maxBytes=_ROTATING_MAX_BYTES,
        backupCount=_ROTATING_BACKUP_COUNT,
        encoding="utf-8",
    )
    handler.setLevel(level)
    handler.setFormatter(logging.Formatter(_FORMAT))
    return handler


def setup_logging() -> None:
    """Kök logger'ı 3 seviye dosya + konsol ile yapılandırır (idempotent).

    Birden fazla çağrıldığında (örn. uvicorn reload) tekrar eklenen handler'lar
    tekrar mount edilmez; uygulama ömrü boyunca aynı set kullanılır.
    """
    root = logging.getLogger()

    # İlk çağrı: temiz başlangıç için basicConfig kullanmıyoruz (basicConfig
    # root'a default handler ekler; biz açıkça eklemek istiyoruz).
    if getattr(setup_logging, "_initialized", False):
        return
    setup_logging._initialized = True

    root.setLevel(settings.log_level.upper())

    # Konsol (stderr) — INFO ve üstü.
    console = logging.StreamHandler()
    console.setLevel(logging.INFO)
    console.setFormatter(logging.Formatter(_FORMAT))
    root.addHandler(console)

    # 3 seviye dosya. INFO handler'ı INFO+, WARNING handler'ı WARNING+, ERROR
    # handler'ı ERROR+ alır; Python'un handler seviyesi log kaydını filtreler.
    root.addHandler(_make_file_handler(LOG_DIR / "info.log", logging.INFO))
    root.addHandler(_make_file_handler(LOG_DIR / "warning.log", logging.WARNING))
    root.addHandler(_make_file_handler(LOG_DIR / "error.log", logging.ERROR))

    # Üçüncü parti kütüphanelerin çok gürültülü log'larını biraz kıs.
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Modül adına bağlı bir logger döndürür (genelde `__name__` ile çağrılır)."""
    return logging.getLogger(name)
