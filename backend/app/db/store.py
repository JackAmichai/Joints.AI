"""Submission persistence.

Small SQLite-backed repo keyed by submission ID. Payloads are stored as
JSON blobs — we don't need relational queries over submission internals,
and the full IntakeSubmission schema is the source of truth.

For production, replace with Postgres + a real migration tool; the
interface below is narrow enough to swap without touching callers.
"""

from __future__ import annotations

import json
import sqlite3
import threading
from pathlib import Path

from app.config import settings
from app.schemas.intake import IntakeStatus, IntakeSubmission


class SubmissionStore:
    def __init__(self, db_path: Path) -> None:
        self._db_path = db_path
        self._db_path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        self._ensure_schema()

    def _ensure_schema(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS submissions (
                    id TEXT PRIMARY KEY,
                    status TEXT NOT NULL,
                    payload TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )
            conn.commit()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self._db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def save(self, submission: IntakeSubmission) -> None:
        payload_json = submission.model_dump_json(by_alias=True)
        created = submission.created_at.isoformat()
        with self._lock, self._connect() as conn:
            conn.execute(
                """
                INSERT INTO submissions (id, status, payload, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    status = excluded.status,
                    payload = excluded.payload,
                    updated_at = excluded.updated_at
                """,
                (submission.id, submission.status.value, payload_json, created, created),
            )
            conn.commit()

    def update_status(self, submission_id: str, status: IntakeStatus) -> None:
        with self._lock, self._connect() as conn:
            conn.execute(
                "UPDATE submissions SET status = ?, updated_at = datetime('now') WHERE id = ?",
                (status.value, submission_id),
            )
            conn.commit()

    def update(self, submission: IntakeSubmission) -> None:
        """Replace the stored payload (e.g., after extractor/retriever finish)."""
        payload_json = submission.model_dump_json(by_alias=True)
        with self._lock, self._connect() as conn:
            conn.execute(
                """
                UPDATE submissions
                SET status = ?, payload = ?, updated_at = datetime('now')
                WHERE id = ?
                """,
                (submission.status.value, payload_json, submission.id),
            )
            conn.commit()

    def get(self, submission_id: str) -> IntakeSubmission | None:
        with self._connect() as conn:
            row = conn.execute(
                "SELECT payload FROM submissions WHERE id = ?",
                (submission_id,),
            ).fetchone()
        if row is None:
            return None
        return IntakeSubmission.model_validate(json.loads(row["payload"]))


_store: SubmissionStore | None = None


def get_submission_store() -> SubmissionStore:
    global _store
    if _store is None:
        # SQLite URL parsing: strip "sqlite:///" prefix to get a local path.
        url = settings.db_url
        if url.startswith("sqlite:///"):
            path = Path(url[len("sqlite:///"):])
        else:
            path = Path(url)
        _store = SubmissionStore(path)
    return _store
