from __future__ import annotations

import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

load_dotenv()

from .db import SessionLocal, Base, get_engine
from .schemas import QuizRequest, QuizEntryResponse, QuizHistoryItem
from .scraper import fetch_article
from .llm import generate_quiz_payload, generate_related_topics
from .crud import get_quiz_by_url, create_quiz_entry, list_quizzes, get_quiz_by_id, update_quiz_entry
from .cache import quiz_cache, get_cache_key

app = FastAPI(title="AI Wiki Quiz Generator")

origins = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else []
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=get_engine())


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/api/quizzes/generate", response_model=QuizEntryResponse)
def generate_quiz(request: QuizRequest, db: Session = Depends(get_db)):
    # Check cache first to prevent duplicate scraping
    cache_key = get_cache_key(str(request.url))
    cached_result = quiz_cache.get(cache_key)
    if cached_result and not request.force:
        return cached_result

    existing = get_quiz_by_url(db, request.url)
    if existing and not request.force:
        # Store in cache for next request
        quiz_cache.set(cache_key, existing)
        return existing

    try:
        title, summary, sections, article_text = fetch_article(str(request.url))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    try:
        quiz_payload = generate_quiz_payload(article_text, title, summary, sections)
        related_topics = generate_related_topics(article_text, title, summary, sections)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM error: {exc}") from exc

    entry_payload = {
        "url": str(request.url),
        "title": title,
        "summary": summary,
        "key_entities": quiz_payload.get("key_entities", {}),
        "sections": sections,
        "quiz": quiz_payload.get("quiz", []),
        "related_topics": related_topics,
    }

    if existing and request.force:
        result = update_quiz_entry(db, existing, entry_payload)
        quiz_cache.set(cache_key, result)  # Update cache after DB update
        return result

    result = create_quiz_entry(db, entry_payload) if not existing else existing
    quiz_cache.set(cache_key, result)  # Cache the new entry
    return result


@app.get("/api/quizzes", response_model=list[QuizHistoryItem])
def quiz_history(db: Session = Depends(get_db)):
    return [
        QuizHistoryItem(id=item.id, url=item.url, title=item.title, created_at=item.created_at)
        for item in list_quizzes(db)
    ]


@app.get("/api/quizzes/{quiz_id}", response_model=QuizEntryResponse)
def quiz_detail(quiz_id: int, db: Session = Depends(get_db)):
    entry = get_quiz_by_id(db, quiz_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return entry
