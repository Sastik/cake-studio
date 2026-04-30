from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import WhatsAppNotification, NotificationResult, EmailNotification
import smtplib
from email.mime.text import MIMEText
import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

app = FastAPI(title="Notification Service", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#  Brevo (formerly Sendinblue) API integration for SMS sending. You can replace this with Twilio or any other provider as needed.

def send_sms(phone: str, message: str):
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = "YOUR_API_KEY"

    api_instance = sib_api_v3_sdk.TransactionalSMSApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    sms = sib_api_v3_sdk.SendTransacSms(
        sender="MyApp",
        recipient=phone,  # e.g. +919876543210
        content=message
    )

    try:
        response = api_instance.send_transac_sms(sms)
        print(response)
        return True
    except ApiException as e:
        print("SMS error:", e)
        return False
    

def _send_gmail(to_email: str, subject: str, message: str):
    sender_email = os.getenv("GMAIL_EMAIL")
    app_password = os.getenv("GMAIL_APP_PASSWORD")

    msg = MIMEText(message, "html")
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_email

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, app_password)
            server.sendmail(sender_email, to_email, msg.as_string())
        return True
    except Exception as e:
        print("Email error:", e)
        return False


@app.get("/health")
def health():
    return {"ok": True, "service": "notification"}


@app.post("/notify/whatsapp", response_model=NotificationResult)
def notify_whatsapp(body: WhatsAppNotification):
    # Stub: replace with WhatsApp Business API / Twilio / provider integration later.
    # Keep the API stable so the Order Service can trigger it.
    _ = body
    return NotificationResult(ok=True, provider="stub", queued=True)

@app.post("/notify/email", response_model=NotificationResult)
def notify_email(body: EmailNotification):
    success = _send_gmail(body.to_email, body.subject, body.message)

    return NotificationResult(
        ok=success,
        provider="gmail",
        queued=False
    )