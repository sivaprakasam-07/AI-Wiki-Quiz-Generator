from __future__ import annotations

import hashlib
import json
from datetime import datetime, timedelta
from typing import Any, Dict, Optional


class SimpleCache:
    """In-memory cache with TTL support."""

    def __init__(self, ttl_minutes: int = 60):
        self.cache: Dict[str, tuple[Any, datetime]] = {}
        self.ttl = timedelta(minutes=ttl_minutes)

    def get(self, key: str) -> Optional[Any]:
        if key not in self.cache:
            return None
        value, expiry = self.cache[key]
        if datetime.utcnow() > expiry:
            del self.cache[key]
            return None
        return value

    def set(self, key: str, value: Any) -> None:
        expiry = datetime.utcnow() + self.ttl
        self.cache[key] = (value, expiry)

    def clear_expired(self) -> None:
        now = datetime.utcnow()
        expired_keys = [k for k, (_, exp) in self.cache.items() if now > exp]
        for k in expired_keys:
            del self.cache[k]


# Global cache instance
quiz_cache = SimpleCache(ttl_minutes=60)


def get_cache_key(url: str) -> str:
    """Generate cache key from URL."""
    return hashlib.md5(url.encode()).hexdigest()
