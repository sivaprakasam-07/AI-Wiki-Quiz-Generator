from __future__ import annotations

import re
from typing import Tuple
import requests
from bs4 import BeautifulSoup

WIKI_HOST = "wikipedia.org"


def validate_wikipedia_url(url: str) -> None:
    if WIKI_HOST not in url:
        raise ValueError("Only Wikipedia article URLs are supported.")


def fetch_article(url: str) -> Tuple[str, str, list[str], str]:
    validate_wikipedia_url(url)
    headers = {"User-Agent": "QuizGenBot/1.0"}
    response = requests.get(url, timeout=20, headers=headers)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    title = soup.find("h1")
    title_text = title.get_text(strip=True) if title else ""

    content = soup.find("div", {"id": "mw-content-text"})
    if not content:
        raise ValueError("Could not extract article content.")

    paragraphs = content.find_all("p")
    summary = " ".join(p.get_text(" ", strip=True) for p in paragraphs[:2]).strip()
    if not summary:
        summary = " ".join(p.get_text(" ", strip=True) for p in paragraphs[:4]).strip()

    sections = [
        h.get_text(" ", strip=True)
        for h in content.find_all("h2")
        if h.get_text(strip=True) and "References" not in h.get_text()
    ]

    article_text = "\n".join(p.get_text(" ", strip=True) for p in paragraphs)
    article_text = re.sub(r"\s+", " ", article_text).strip()

    return title_text, summary, sections, article_text
