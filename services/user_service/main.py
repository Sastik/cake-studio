from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
import hashlib
import jwt
from jwt import PyJWKClient
import os
import random
import time
import smtplib
from email.mime.text import MIMEText
from common.settings import settings
from common.security import create_access_token, verify_token
# from services.common.settings import settings
# from services.common.common.security import create_access_token, verify_token
from schemas import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserPublic,
    GoogleAuthRequest,
    OtpRequest,
    OtpVerify,
)

app = FastAPI(title="User Service", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_users_by_email: dict[str, dict] = {}
_users_by_id: dict[str, dict] = {}
_otp_by_email: dict[str, dict] = {}

OTP_TTL_SECONDS = 10 * 60


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def _role_for_email(email: str) -> str:
    email_l = email.lower()
    if email_l == settings.admin_default_email:
        return "admin"
    return "admin" if email_l in settings.admin_emails else "user"


def _issue_token(user: dict) -> str:
    return create_access_token(
        subject=user["id"],
        secret=settings.jwt_secret,
        expires_minutes=60,
        extra_claims={"role": user["role"], "email": user["email"]},
    )


def _verify_google_id_token(id_token: str) -> dict:
    if not settings.google_client_id:
        raise HTTPException(status_code=400, detail="Google OAuth not configured")
    jwks_url = "https://www.googleapis.com/oauth2/v3/certs"
    try:
        jwk_client = PyJWKClient(jwks_url)
        signing_key = jwk_client.get_signing_key_from_jwt(id_token)
        payload = jwt.decode(
            id_token,
            signing_key.key,
            algorithms=["RS256"],
            audience=settings.google_client_id,
        )
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")


def _rate_limit_key(prefix: str, request: Request) -> str:
    ip = request.client.host if request.client else "unknown"
    return f"{prefix}:{ip}:{int(time.time() // 60)}"


def _check_rate_limit(prefix: str, request: Request, limit_per_minute: int):
    # Best-effort in-memory limit for sandbox/dev; swap to Redis later at gateway.
    key = _rate_limit_key(prefix, request)
    bucket = _otp_by_email.setdefault("__rl__", {})
    bucket[key] = int(bucket.get(key, 0)) + 1
    if bucket[key] > limit_per_minute:
        raise HTTPException(status_code=429, detail="Too many requests")


def _generate_code() -> str:
    return f"{random.randint(0, 999999):06d}"


def _send_email_otp_stub(email: str, code: str):
    sender_email = os.getenv("GMAIL_EMAIL")
    app_password = os.getenv("GMAIL_APP_PASSWORD")

    subject = "Your OTP Code"
    body = f"Your OTP is: {code}. It expires in 10 minutes."

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = email

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, app_password)
            server.sendmail(sender_email, email, msg.as_string())
    except Exception as e:
        print("Email send failed:", e)


def _seed_admin():
    email = settings.admin_default_email
    if not email:
        return
    if email in _users_by_email:
        _users_by_email[email]["role"] = "admin"
        return
    user_id = str(uuid4())
    user = {
        "id": user_id,
        "email": email,
        "name": "Admin",
        "role": "admin",
        "password_hash": _hash_password(settings.admin_default_password),
    }
    _users_by_email[email] = user
    _users_by_id[user_id] = user


_seed_admin()


@app.get("/health")
def health():
    return {"ok": True, "service": "user"}


@app.post("/auth/register", response_model=UserPublic)
def register(body: RegisterRequest):
    if body.email in _users_by_email:
        raise HTTPException(status_code=409, detail="Email already registered")
    user_id = str(uuid4())
    user = {
        "id": user_id,
        "email": body.email,
        "name": body.name,
        "role": _role_for_email(body.email),
        "password_hash": _hash_password(body.password),
    }
    _users_by_email[body.email] = user
    _users_by_id[user_id] = user
    return {"id": user_id, "email": body.email, "name": body.name, "role": user["role"]}


@app.post("/auth/login", response_model=TokenResponse)
def login(body: LoginRequest):
    user = _users_by_email.get(body.email)
    if not user or user["password_hash"] != _hash_password(body.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user["role"] = _role_for_email(user["email"])
    token = _issue_token(user)
    return {"access_token": token, "token_type": "bearer"}


@app.post("/auth/google", response_model=TokenResponse)
def google_auth(body: GoogleAuthRequest):
    payload = _verify_google_id_token(body.id_token)
    email = (payload.get("email") or "").strip()
    name = (payload.get("name") or payload.get("given_name") or "Customer").strip()
    if not email:
        raise HTTPException(status_code=400, detail="Google token missing email")

    user = _users_by_email.get(email)
    if not user:
        user_id = str(uuid4())
        user = {
            "id": user_id,
            "email": email,
            "name": name[:80],
            "role": _role_for_email(email),
            "password_hash": _hash_password(str(uuid4())),
        }
        _users_by_email[email] = user
        _users_by_id[user_id] = user
    else:
        user["role"] = _role_for_email(user["email"])

    token = _issue_token(user)
    return {"access_token": token, "token_type": "bearer"}


@app.post("/auth/otp/request")
def request_otp(body: OtpRequest, request: Request):
    _check_rate_limit("otp_req", request, limit_per_minute=10)
    email = body.email.lower()
    code = _generate_code()
    _otp_by_email[email] = {"code": code, "exp": int(time.time()) + OTP_TTL_SECONDS}
    _send_email_otp_stub(email, code)

    # For local dev/testing only. Do not enable in production.
    echo = os.getenv("DEV_OTP_ECHO", "false").lower() in {"1", "true", "yes"}
    return {"ok": True, "ttl_seconds": OTP_TTL_SECONDS, "dev_code": code if echo else None}


@app.post("/auth/otp/verify", response_model=TokenResponse)
def verify_otp(body: OtpVerify, request: Request):
    _check_rate_limit("otp_verify", request, limit_per_minute=20)
    email = body.email.lower()
    record = _otp_by_email.get(email)
    if not record:
        raise HTTPException(status_code=400, detail="OTP not requested")
    if int(time.time()) > int(record.get("exp", 0)):
        _otp_by_email.pop(email, None)
        raise HTTPException(status_code=400, detail="OTP expired")
    if body.code.strip() != str(record.get("code")):
        raise HTTPException(status_code=401, detail="Invalid OTP")
    _otp_by_email.pop(email, None)

    user = _users_by_email.get(email)
    if not user:
        user_id = str(uuid4())
        user = {
            "id": user_id,
            "email": email,
            "name": "Customer",
            "role": _role_for_email(email),
            "password_hash": _hash_password(str(uuid4())),
        }
        _users_by_email[email] = user
        _users_by_id[user_id] = user
    else:
        user["role"] = _role_for_email(user["email"])

    token = _issue_token(user)
    return {"access_token": token, "token_type": "bearer"}


@app.get("/me", response_model=UserPublic)
def me(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1].strip()
    try:
        payload = verify_token(token, settings.jwt_secret)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = _users_by_id.get(payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["role"] = _role_for_email(user["email"])
    return {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]}


@app.get("/admin/ping")
def admin_ping(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1].strip()
    try:
        payload = verify_token(token, settings.jwt_secret)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return {"ok": True, "role": "admin"}
