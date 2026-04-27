from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import WhatsAppNotification, NotificationResult

app = FastAPI(title="Notification Service", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True, "service": "notification"}


@app.post("/notify/whatsapp", response_model=NotificationResult)
def notify_whatsapp(body: WhatsAppNotification):
    # Stub: replace with WhatsApp Business API / Twilio / provider integration later.
    # Keep the API stable so the Order Service can trigger it.
    _ = body
    return NotificationResult(ok=True, provider="stub", queued=True)

