from __future__ import annotations

from sqlalchemy.orm import Session

from .models import QuizEntry


def get_quiz_by_url(db: Session, url: str) -> QuizEntry | None:
    return db.query(QuizEntry).filter(QuizEntry.url == url).first()


def get_quiz_by_id(db: Session, quiz_id: int) -> QuizEntry | None:
    return db.query(QuizEntry).filter(QuizEntry.id == quiz_id).first()


def list_quizzes(db: Session) -> list[QuizEntry]:
    return db.query(QuizEntry).order_by(QuizEntry.created_at.desc()).all()


def create_quiz_entry(db: Session, payload: dict) -> QuizEntry:
    entry = QuizEntry(**payload)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def update_quiz_entry(db: Session, entry: QuizEntry, payload: dict) -> QuizEntry:
    for key, value in payload.items():
        setattr(entry, key, value)
    db.commit()
    db.refresh(entry)
    return entry
