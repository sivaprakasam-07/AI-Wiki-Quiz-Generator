from __future__ import annotations

from datetime import datetime
from sqlalchemy import String, Text, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


class QuizEntry(Base):
    __tablename__ = "quiz_entries"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    url: Mapped[str] = mapped_column(String(500), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(300))
    summary: Mapped[str] = mapped_column(Text)
    key_entities: Mapped[dict] = mapped_column(JSON)
    sections: Mapped[list] = mapped_column(JSON)
    quiz: Mapped[list] = mapped_column(JSON)
    related_topics: Mapped[list] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
