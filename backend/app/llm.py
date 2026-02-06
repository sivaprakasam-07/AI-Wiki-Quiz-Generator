from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Dict, List

from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser

PROMPT_DIR = Path(__file__).parent / "prompts"


def load_prompt(name: str) -> str:
    path = PROMPT_DIR / name
    return path.read_text(encoding="utf-8")


def _safe_json_load(text: str) -> Dict[str, Any]:
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("LLM response did not contain JSON.")
    payload = text[start : end + 1]
    return json.loads(payload)


def _normalize_quiz_items(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    normalized = []
    for item in items:
        options = item.get("options") or []
        options = options[:4]
        while len(options) < 4:
            options.append("Option")
        normalized.append(
            {
                "question": item.get("question", ""),
                "options": options,
                "answer": item.get("answer", ""),
                "difficulty": item.get("difficulty", "medium"),
                "explanation": item.get("explanation", ""),
                "section": item.get("section", "General"),
            }
        )
    return normalized


def _fallback_payload(summary: str, sections: List[str]) -> Dict[str, Any]:
    questions = []
    base = sections[:5] or ["Overview", "Background", "Legacy", "Impact", "Details"]
    for idx, section in enumerate(base, start=1):
        questions.append(
            {
                "question": f"Which section discusses {section.lower()}?",
                "options": ["Introduction", section, "References", "See also"],
                "answer": section,
                "difficulty": "easy" if idx < 3 else "medium",
                "explanation": f"This question relates to the '{section}' section.",
                "section": section,
            }
        )
    return {
        "key_entities": {"people": [], "organizations": [], "locations": []},
        "quiz": questions,
    }


def generate_quiz_payload(
    article_text: str,
    title: str,
    summary: str,
    sections: List[str],
) -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return _fallback_payload(summary, sections)

    llm = ChatGoogleGenerativeAI(model=os.getenv("LLM_MODEL", "gemini-1.5-flash"))
    prompt = PromptTemplate.from_template(load_prompt("quiz_prompt.txt"))
    chain = prompt | llm | StrOutputParser()
    response = chain.invoke(
        {
            "title": title,
            "summary": summary,
            "sections": ", ".join(sections),
            "article_text": article_text[:12000],
        }
    )
    payload = _safe_json_load(response)
    payload["quiz"] = _normalize_quiz_items(payload.get("quiz", []))
    payload.setdefault("key_entities", {"people": [], "organizations": [], "locations": []})
    return payload


def generate_related_topics(
    article_text: str,
    title: str,
    summary: str,
    sections: List[str],
) -> List[str]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return ["Computer science", "History", "Mathematics"]

    llm = ChatGoogleGenerativeAI(model=os.getenv("LLM_MODEL", "gemini-1.5-flash"))
    prompt = PromptTemplate.from_template(load_prompt("related_topics_prompt.txt"))
    chain = prompt | llm | StrOutputParser()
    response = chain.invoke(
        {
            "title": title,
            "summary": summary,
            "sections": ", ".join(sections),
            "article_text": article_text[:8000],
        }
    )
    payload = _safe_json_load(response)
    return payload.get("related_topics", [])
