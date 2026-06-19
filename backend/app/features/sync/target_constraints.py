"""Hedef API payload constraint'leri — case study §5.5 + http://89.252.189.91:8983/docs-guide.

Gönderilen payload'ın hedef API'nin kabul ettiği aralıklarda olmasını doğrular; aksi
halde 422 ile kalıcı reddedileceğinden **gönderimden önce** eleyerek hem bant genişliği
hem de gereksiz retry trafiği önlenir.

Türetildiği kaynak (case study §5.5):
  - oe_value                : 0.0–100.0   (yüzde)
  - machine_count           : 1–1000      (vardiya başına aktif makine)
  - total_production_units  : 1–1.000.000 (toplam üretim adedi)
  - shift                   : {1, 2, 3}   (Sabah/Öğle/Gece)
  - production_date         : YYYY-MM-DD, gelecek tarih kabul edilmez

Bu kurallar validasyon motorundan (V-*) bağımsızdır; kayıt `status='valid'` olsa bile
veri bozulması / outlier / manuel onay nedeniyle sınırları aşmış olabilir — defense in depth.
"""
from __future__ import annotations

import datetime as dt
from typing import Any

# --- Sabit constraint'ler (case study §5.5 ile birebir) ----------------------
OE_VALUE_MIN: float = 0.0
OE_VALUE_MAX: float = 100.0
MACHINE_COUNT_MIN: int = 1
MACHINE_COUNT_MAX: int = 1000
TOTAL_PRODUCTION_UNITS_MIN: int = 1
TOTAL_PRODUCTION_UNITS_MAX: int = 1_000_000
VALID_SHIFTS: frozenset[int] = frozenset({1, 2, 3})


def check_target_constraints(group: dict[str, Any], today: dt.date | None = None) -> list[str]:
    """Bir (gün, vardiya) grubunun hedef API'ye gönderilip gönderilemeyeceğini doğrular.

    İhlal varsa ihlal mesajlarının listesini döner (boş = temiz). Verilen `today` test
    edilebilirlik için enjekte edilebilir; None ise `date.today()` kullanılır.
    """
    issues: list[str] = []
    oe = group.get("oe_value")
    if not isinstance(oe, (int, float)) or not (OE_VALUE_MIN <= float(oe) <= OE_VALUE_MAX):
        issues.append(f"oe_value={oe} aralık dışı [{OE_VALUE_MIN}, {OE_VALUE_MAX}]")

    mc = group.get("machine_count")
    if not isinstance(mc, int) or not (MACHINE_COUNT_MIN <= mc <= MACHINE_COUNT_MAX):
        issues.append(f"machine_count={mc} aralık dışı [{MACHINE_COUNT_MIN}, {MACHINE_COUNT_MAX}]")

    units = group.get("total_production_units")
    units_min = TOTAL_PRODUCTION_UNITS_MIN
    units_max = TOTAL_PRODUCTION_UNITS_MAX
    if not isinstance(units, int) or not (units_min <= units <= units_max):
        issues.append(
            f"total_production_units={units} aralık dışı [{units_min}, {units_max}]"
        )

    sh = group.get("shift")
    if sh not in VALID_SHIFTS:
        issues.append(f"shift={sh} geçersiz (1/2/3 dışı)")

    d = group.get("production_date")
    if not isinstance(d, dt.date):
        issues.append("production_date eksik veya tarih değil")
    else:
        ref = today if today is not None else dt.date.today()
        if d > ref:
            issues.append(f"production_date={d.isoformat()} gelecek tarih (kabul edilmez)")

    return issues


def is_target_compliant(group: dict[str, Any], today: dt.date | None = None) -> bool:
    """Constraint ihlali yoksa True (gönderilebilir)."""
    return not check_target_constraints(group, today=today)
