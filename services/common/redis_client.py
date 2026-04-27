from __future__ import annotations

from redis import Redis
import os


def get_redis() -> Redis | None:
    url = os.getenv("REDIS_URL")
    if not url:
        return None
    try:
        client = Redis.from_url(url, decode_responses=True)
        client.ping()
        return client
    except Exception:
        return None

