from datetime import datetime, timedelta, timezone
from typing import Any
import jwt


def create_access_token(
    subject: str,
    secret: str,
    expires_minutes: int = 60,
    extra_claims: dict[str, Any] | None = None,
) -> str:
    now = datetime.now(tz=timezone.utc)
    payload = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=expires_minutes)).timestamp()),
    }
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, secret, algorithm="HS256")


def verify_token(token: str, secret: str) -> dict[str, Any]:
    payload = jwt.decode(token, secret, algorithms=["HS256"])
    subject = payload.get("sub")
    if not subject or not isinstance(subject, str):
        raise jwt.InvalidTokenError("Invalid subject")
    return payload
