from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, HttpUrl, Field


class QuizRequest(BaseModel):
    url: HttpUrl
    force: bool = False


class QuizQuestion(BaseModel):
    question: str
    options: list[str] = Field(min_items=4, max_items=4)
    answer: str
    difficulty: str
    explanation: str
    section: str = Field(default="General")


class QuizEntryBase(BaseModel):
    id: int
    url: str
    title: str
    summary: str
    key_entities: dict
    sections: list[str]
    quiz: list[QuizQuestion]
    related_topics: list[str]
    created_at: datetime


class QuizHistoryItem(BaseModel):
    id: int
    url: str
    title: str
    created_at: datetime


class QuizEntryResponse(QuizEntryBase):
    raw_html: str | None = None
