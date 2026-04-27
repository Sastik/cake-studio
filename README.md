# Cake Web (Mobile‑First Ordering)

Modern, premium, mobile‑first cake ordering platform with WhatsApp-based ordering and an AI-ready backend architecture.

## Repo layout

- `apps/web` — React + TypeScript + Tailwind + Framer Motion frontend
- `services/*` — FastAPI microservices + API gateway
- `infra/nginx` — reverse proxy config
- `docker-compose.yml` — local multi-service stack (web + gateway + services + redis)

## Frontend (local dev)

```bash
cd apps/web
npm i
npm run dev
```

Dev API calls use a Vite proxy: `http://localhost:5173/api/*` -> `http://localhost:8000/*`.

Create `.env.local`:

```bash
VITE_WHATSAPP_NUMBER=15551234567
VITE_BUSINESS_NAME=Cake Studio
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

## Backend (local dev)

Each service is a standalone FastAPI app.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r services/requirements.txt
export GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
export ADMIN_DEFAULT_EMAIL=admin@cakeweb.com
export ADMIN_DEFAULT_PASSWORD=Admin@12345
uvicorn services/api_gateway/main:app --reload --port 8000
```

## Docker

```bash
docker compose up --build
```

Frontend: `http://localhost:8080`  
API gateway: `http://localhost:8080/api`
