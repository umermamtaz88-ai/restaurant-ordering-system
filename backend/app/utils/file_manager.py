"""PostgreSQL-backed data access (replaces JSON file storage)."""

from app.db.repository import DbRepository, FileManager

__all__ = ["DbRepository", "FileManager"]
