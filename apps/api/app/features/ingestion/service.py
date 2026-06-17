"""Ingestion service — CSV oku, normalize, import, duplicate kontrol."""
from __future__ import annotations

import io
import time
from collections.abc import Iterable
from typing import Optional

import pandas as pd
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.oee import recompute_oee
from app.db import models
from app.features.ingestion.hashers import file_hash_from_bytes, row_hash_from_mapping
from app.features.ingestion.normalizer import (
    map_columns,
    normalize_row,
    rescale_percent_columns,
)
from app.features.ingestion.schemas import ImportPreview, ImportSummary, NormalizedRow


_PREVIEW_LIMIT: int = 10
_FAILED_SAMPLE_MAX: int = 5


def _read_dataframe(file_bytes: bytes) -> tuple[pd.DataFrame, str]:
    encodings: tuple[str, ...] = ("utf-8", "cp1254", "latin-1")
    last_err: Optional[Exception] = None
    for enc in encodings:
        try:
            df = pd.read_csv(io.BytesIO(file_bytes), encoding=enc, dtype=str, keep_default_na=False)
            return df, enc
        except UnicodeDecodeError as exc:
            last_err = exc
            continue
        except Exception as exc:
            last_err = exc
            continue
    raise ValueError(f"CSV okunamadı: {last_err}")


def _df_to_dicts(df: pd.DataFrame) -> Iterable[dict[str, object]]:
    for _, row in df.iterrows():
        yield {k: row.get(k) for k in df.columns}


def preview_csv(file_bytes: bytes, filename: str) -> ImportPreview:
    df, enc = _read_dataframe(file_bytes)
    df.columns = map_columns(list(df.columns))
    rows_iter = _df_to_dicts(df)
    sample: list[dict[str, object]] = []
    for raw in rows_iter:
        if len(sample) >= _PREVIEW_LIMIT:
            break
        norm = normalize_row(raw)
        sample.append(norm)
    rescale_percent_columns(sample)
    for i, n in enumerate(sample):
        n["row_hash"] = row_hash_from_mapping(n)
        sample[i] = n
    return ImportPreview(
        filename=filename,
        file_hash=file_hash_from_bytes(file_bytes),
        total_rows=len(df),
        sample=[NormalizedRow(**n) for n in sample],
        detected_columns=list(df.columns),
        encoding=enc,
    )


def import_csv(db: Session, file_bytes: bytes, filename: str) -> ImportSummary:
    started = time.perf_counter()
    df, _enc = _read_dataframe(file_bytes)
    df.columns = map_columns(list(df.columns))
    total = len(df)

    fhash = file_hash_from_bytes(file_bytes)
    duplicate_file: bool = db.execute(
        select(models.ImportBatch).where(models.ImportBatch.file_hash == fhash)
    ).first() is not None

    existing_hashes: set[str] = set(
        db.execute(select(models.ProductionRecord.row_hash)).scalars().all()
    )

    rows_buffer: list[dict[str, object]] = []
    for raw in _df_to_dicts(df):
        try:
            norm = normalize_row(raw)
            rows_buffer.append(norm)
        except Exception as exc:  # noqa: BLE001
            rows_buffer.append({"_parse_error": str(exc), "_raw": raw})
    rescale_percent_columns([r for r in rows_buffer if "_parse_error" not in r])

    batch = models.ImportBatch(
        filename=filename,
        file_hash=fhash,
        total_rows=total,
        imported_rows=0,
        rejected_rows=0,
        suspect_rows=0,
        status="processing",
    )
    db.add(batch)
    db.flush()

    imported: int = 0
    parse_failed: int = 0
    duplicate_row_skipped: int = 0
    failed_samples: list[dict[str, str]] = []
    parse_failed_normalized: dict[str, int] = {}

    for r in rows_buffer:
        if "_parse_error" in r:
            parse_failed += 1
            if len(failed_samples) < _FAILED_SAMPLE_MAX:
                raw = r.get("_raw") or {}
                failed_samples.append(
                    {
                        "reason": str(r.get("_parse_error", "parse_error")),
                        "row": {k: ("" if v is None else str(v)) for k, v in raw.items()},
                    }
                )
            continue
        rhash = row_hash_from_mapping(r)
        if rhash in existing_hashes:
            duplicate_row_skipped += 1
            continue
        existing_hashes.add(rhash)
        record = models.ProductionRecord(
            import_batch_id=batch.id,
            record_id_src=r.get("record_id_src") if isinstance(r.get("record_id_src"), int) else None,
            prod_date=r.get("prod_date"),
            work_order_no=r.get("work_order_no"),
            work_center_no=r.get("work_center_no"),
            work_center_name=r.get("work_center_name"),
            station_name=r.get("station_name"),
            stock_name=r.get("stock_name"),
            shift=r.get("shift") if isinstance(r.get("shift"), int) else None,
            availability=r.get("availability"),
            performance=r.get("performance"),
            quality=r.get("quality"),
            oee=r.get("oee"),
            run_time=r.get("run_time"),
            down_time=r.get("down_time"),
            planned_down=r.get("planned_down"),
            unplanned_down=r.get("unplanned_down"),
            produced_qty=r.get("produced_qty") if isinstance(r.get("produced_qty"), int) else None,
            scrap_qty=r.get("scrap_qty") if isinstance(r.get("scrap_qty"), int) else None,
            oee_recomputed=recompute_oee(
                run_time=r.get("run_time"),
                unplanned_down=r.get("unplanned_down"),
                performance=r.get("performance"),
                produced_qty=r.get("produced_qty") if isinstance(r.get("produced_qty"), int) else None,
                scrap_qty=r.get("scrap_qty") if isinstance(r.get("scrap_qty"), int) else None,
            ),
            row_hash=rhash,
            status="pending",
        )
        db.add(record)
        imported += 1

    batch.imported_rows = imported
    batch.rejected_rows = 0
    batch.suspect_rows = 0
    if parse_failed > 0:
        parse_failed_normalized["parse_failed"] = parse_failed
    batch.status = "duplicate" if duplicate_file else "completed"
    if duplicate_file:
        batch.error_message = "Bu dosya daha önce import edilmiş (file_hash)."

    db.flush()

    elapsed_ms = int((time.perf_counter() - started) * 1000)
    return ImportSummary(
        batch_id=batch.id,
        filename=filename,
        file_hash=fhash,
        total_rows=total,
        imported_rows=imported,
        duplicate_file=duplicate_file,
        duplicate_row_skipped=duplicate_row_skipped,
        parse_failed_count=parse_failed,
        failed_rows_sample=failed_samples,
        status=batch.status,
        elapsed_ms=elapsed_ms,
    )
