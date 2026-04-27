# System Architecture (Microservices)

## Text diagram

```
Client (Mobile Web)
  |
  v
Nginx (Reverse Proxy + Static Web)
  |
  +--> /           -> Web static assets (React build)
  |
  +--> /api/*      -> API Gateway (FastAPI)
                    |
                    +--> User Service (JWT auth)
                    +--> Product Service (catalog + image upload)
                    +--> Order Service (orders)
                    +--> Notification Service (WhatsApp trigger stub)
                    |
                    +--> Redis (cache + rate limit + sessions)
```

## Service communication flow

- Web places order via WhatsApp (today): client builds a prefilled WhatsApp message from cart + custom request.
- Web (future): can POST `/orders` to gateway (server-side ordering) and the Order Service triggers `/notify/whatsapp`.
- Product Service:
  - Reads from in-memory store (now)
  - Uses Redis as a short TTL cache for `/products` list
  - Uses Redis for per-IP rate limiting (best-effort)

## Admin access (RBAC)

- Admin login is a single seeded account (env-based) in the User Service:
  - `ADMIN_DEFAULT_EMAIL`, `ADMIN_DEFAULT_PASSWORD`
- After login, JWT includes `role=admin`.
- Product management is admin-only:
  - `POST /products`, `PUT /products/{id}`, `DELETE /products/{id}`, `POST /products/{id}/image`
