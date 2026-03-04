"""
app/database/session.py
-----------------------
Database engine and session factory.

SQLite is used by default (file: skillsync.db in the project root).
Switch to PostgreSQL by setting DATABASE_URL in your environment:

    export DATABASE_URL="postgresql+psycopg2://user:pass@localhost/skillsync"
"""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------

DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "sqlite:///./skillsync.db",
)

# connect_args is required for SQLite to work with FastAPI's threaded workers.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False,          # Set True to log all SQL statements during development
    pool_pre_ping=True,  # Reconnect dropped connections automatically
)

# ---------------------------------------------------------------------------
# Session factory
# ---------------------------------------------------------------------------

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# ---------------------------------------------------------------------------
# Declarative base (shared by all models)
# ---------------------------------------------------------------------------

class Base(DeclarativeBase):
    pass


# ---------------------------------------------------------------------------
# Dependency — injected into every route that needs a DB session
# ---------------------------------------------------------------------------

def get_db():
    """
    FastAPI dependency that yields a SQLAlchemy session and guarantees
    it is closed after the request finishes — even on exception.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
