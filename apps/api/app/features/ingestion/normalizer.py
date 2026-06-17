"""CSV normalizasyonu — tarih, ondalık, yüzde ölçeği, trim/lower."""
from __future__ import annotations

import datetime as dt
import re
from typing import Optional

_DATE_FORMATS: tuple[str, ...] = (
    "%Y-%m-%d",
    "%m/%d/%Y",
    "%d/%m/%Y",
    "%d.%m.%Y",
)


def _detect_date(value: object) -> Optional[dt.date]:
    if value is None:
        return None
    if isinstance(value, dt.datetime):
        return value.date()
    if isinstance(value, dt.date):
        return value
    text = str(value).strip()
    if not text:
        return None
    for fmt in _DATE_FORMATS:
        try:
            parsed = dt.datetime.strptime(text, fmt).date()
            if fmt in ("%m/%d/%Y", "%d/%m/%Y") and "/" in text:
                parts = text.split("/")
                if len(parts) == 3:
                    a, b, c = parts
                    try:
                        ai, bi = int(a), int(b)
                        if ai > 12 and bi > 12:
                            return None
                        if ai > 12 and bi <= 12:
                            return dt.date(int(c), bi, ai)
                    except (ValueError, TypeError):
                        pass
            return parsed
        except ValueError:
            continue
    return None


_DECIMAL_RE = re.compile(r"^-?\d+(?:[.,]\d+)?$")


def _to_float(value: object) -> Optional[float]:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        if isinstance(value, float) and (value != value):
            return None
        return float(value)
    text = str(value).strip()
    if not text:
        return None
    if not _DECIMAL_RE.match(text):
        return None
    text = text.replace(",", ".")
    try:
        return float(text)
    except ValueError:
        return None


def _to_int(value: object) -> Optional[int]:
    f = _to_float(value)
    if f is None:
        return None
    return int(f)


def _normalize_str(value: object, *, lower: bool = True) -> Optional[str]:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    if lower:
        text = text.lower()
    return text


def _detect_percent_scale(values: list[Optional[float]]) -> tuple[bool, bool]:
    has_in_unit: bool = False
    has_hundred: bool = False
    for v in values:
        if v is None:
            continue
        if 0.0 < v <= 1.0:
            has_in_unit = True
        if v > 1.0:
            has_hundred = True
    return has_in_unit, has_hundred


def _rescale_to_percent(values: list[Optional[float]]) -> list[Optional[float]]:
    has_in_unit, has_hundred = _detect_percent_scale(values)
    if has_in_unit and not has_hundred:
        return [None if v is None else round(v * 100.0, 4) for v in values]
    return list(values)


_COLUMNS_PERCENT: tuple[str, ...] = ("availability", "performance", "quality", "oee")
_COLUMNS_STRING_LOWER: tuple[str, ...] = (
    "work_order_no",
    "work_center_no",
    "work_center_name",
    "station_name",
    "stock_name",
)
_COLUMNS_INT: tuple[str, ...] = ("record_id_src", "shift", "produced_qty", "scrap_qty")
_COLUMNS_FLOAT: tuple[str, ...] = (
    "run_time",
    "down_time",
    "planned_down",
    "unplanned_down",
)
_COLUMN_MAP: dict[str, str] = {
    "record_id": "record_id_src",
    "Tarih": "prod_date",
    "İş Emri No": "work_order_no",
    "İş Merkezi No": "work_center_no",
    "İşmerkezi Adı": "work_center_name",
    "İş İstasyon Adı": "station_name",
    "Stok Adı": "stock_name",
    "Vardiya": "shift",
    "A (Kullanılırlık)": "availability",
    "P (Performans)": "performance",
    "Q (Kalite)": "quality",
    "OEE": "oee",
    "Çalışma Süresi": "run_time",
    "Duruş Süresi": "down_time",
    "Planlı Duruş Süresi": "planned_down",
    "Plansız Duruş Süresi": "unplanned_down",
    "Üretilen Miktar": "produced_qty",
    "Hatalı Üretilen Miktar": "scrap_qty",
}


_ASCII_HEADER_MAP: dict[str, str] = {
    "record_id": "record_id_src",
    "tarih": "prod_date",
    "s emri no": "work_order_no",
    "is emri no": "work_order_no",
    "s merkezi no": "work_center_no",
    "is merkezi no": "work_center_no",
    "smerkezi ad": "work_center_name",
    "ismerkezi adi": "work_center_name",
    "s stasyon ad": "station_name",
    "is istasyon adi": "station_name",
    "stok ad": "stock_name",
    "stok adi": "stock_name",
    "vardiya": "shift",
    "a (kullanlrlk)": "availability",
    "a (kullanilirlik)": "availability",
    "p (performans)": "performance",
    "q (kalite)": "quality",
    "oee": "oee",
    "alma suiresi": "run_time",
    "alma sresi": "run_time",
    "alma su+resi": "run_time",
    "calisma suresi": "run_time",
    "duru suiresi": "down_time",
    "duru sresi": "down_time",
    "durus suresi": "down_time",
    "planl duru suiresi": "planned_down",
    "planl duru sresi": "planned_down",
    "planli durus suresi": "planned_down",
    "plansz duru suiresi": "unplanned_down",
    "plansz duru sresi": "unplanned_down",
    "plansiz durus suresi": "unplanned_down",
    "retilen miktar": "produced_qty",
    "uretilen miktar": "produced_qty",
    "hatal retilen miktar": "scrap_qty",
    "hatali uretilen miktar": "scrap_qty",
}


def _normalize_header(header: str) -> str:
    import re as _re

    lowered = header.strip().lower()
    lowered = (
        lowered.replace("ı", "i")
        .replace("ş", "s")
        .replace("ğ", "g")
        .replace("ü", "u")
        .replace("ö", "o")
        .replace("ç", "c")
        .replace("?", "")
        .replace("\ufffd", "")
    )
    lowered = _re.sub(r"[^a-z0-9()\s]", "", lowered)
    return _re.sub(r"\s+", " ", lowered).strip()


def map_columns(raw_columns: list[str]) -> list[str]:
    out: list[str] = []
    for c in raw_columns:
        key = c.strip()
        if key in _COLUMN_MAP:
            out.append(_COLUMN_MAP[key])
            continue
        ascii_key = _normalize_header(key)
        if ascii_key in _ASCII_HEADER_MAP:
            out.append(_ASCII_HEADER_MAP[ascii_key])
            continue
        out.append(key)
    return out


def normalize_row(raw: dict[str, object]) -> dict[str, object]:
    out: dict[str, object] = {}
    for col in _COLUMNS_PERCENT:
        out[col] = _to_float(raw.get(col))
    for col in _COLUMNS_INT:
        out[col] = _to_int(raw.get(col))
    for col in _COLUMNS_STRING_LOWER:
        out[col] = _normalize_str(raw.get(col), lower=True)
    for col in _COLUMNS_FLOAT:
        out[col] = _to_float(raw.get(col))
    out["prod_date"] = _detect_date(raw.get("prod_date") or raw.get("Tarih"))
    return out


def rescale_percent_columns(rows: list[dict[str, object]]) -> None:
    for col in _COLUMNS_PERCENT:
        col_values = [r.get(col) for r in rows]
        col_values_float: list[Optional[float]] = [
            v if isinstance(v, (int, float)) else None for v in col_values
        ]
        rescaled = _rescale_to_percent(col_values_float)
        for r, v in zip(rows, rescaled):
            r[col] = v
