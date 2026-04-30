from pydantic import BaseModel, Field, EmailStr


class WhatsAppNotification(BaseModel):
    phone_number: str = Field(min_length=7, max_length=20)
    message: str = Field(min_length=1, max_length=2000)


class NotificationResult(BaseModel):
    ok: bool = True
    provider: str = "stub"
    queued: bool = True

class EmailNotification(BaseModel):
    to_email: EmailStr
    subject: str
    message: str

