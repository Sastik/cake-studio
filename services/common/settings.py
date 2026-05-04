from pydantic import BaseModel
import os

class Settings(BaseModel):
    service_name: str = "service"
    jwt_secret: str = os.getenv("JWT_SECRET", "dev_secret_change_me")
    redis_url: str | None = os.getenv("REDIS_URL")
    google_client_id: str | None = os.getenv("GOOGLE_CLIENT_ID")
    admin_default_email: str = os.getenv("ADMIN_DEFAULT_EMAIL", "admin@cakeweb.com").strip().lower()
    admin_default_password: str = os.getenv("ADMIN_DEFAULT_PASSWORD", "Admin@12345").strip()
    admin_emails: list[str] = [
        e.strip().lower()
        for e in os.getenv("ADMIN_EMAILS", "").split(",")
        if e.strip()
    ]


settings = Settings()
