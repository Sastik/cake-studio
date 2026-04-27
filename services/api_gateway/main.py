from __future__ import annotations

import os
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(title="API Gateway", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:8001")
PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://localhost:8002")
ORDER_SERVICE_URL = os.getenv("ORDER_SERVICE_URL", "http://localhost:8003")
NOTIFICATION_SERVICE_URL = os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:8004")


def upstream_for_path(path: str) -> str | None:
    if (
        path.startswith("/users")
        or path.startswith("/auth")
        or path.startswith("/me")
        or path.startswith("/admin")
    ):
        return USER_SERVICE_URL
    if path.startswith("/products"):
        return PRODUCT_SERVICE_URL
    if path.startswith("/orders"):
        return ORDER_SERVICE_URL
    if path.startswith("/notify"):
        return NOTIFICATION_SERVICE_URL
    return None


@app.get("/health")
def health():
    return {
        "ok": True,
        "service": "gateway",
        "upstreams": {
            "user": USER_SERVICE_URL,
            "product": PRODUCT_SERVICE_URL,
            "order": ORDER_SERVICE_URL,
            "notification": NOTIFICATION_SERVICE_URL,
        },
    }


@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
async def proxy(path: str, request: Request):
    target_path = "/" + path
    upstream = upstream_for_path(target_path)
    if not upstream:
        return Response(status_code=404, content=b"Not found")

    url = upstream.rstrip("/") + target_path
    headers = dict(request.headers)
    headers.pop("host", None)

    body = await request.body()

    async with httpx.AsyncClient(timeout=20) as client:
        upstream_resp = await client.request(
            request.method,
            url,
            params=dict(request.query_params),
            content=body,
            headers=headers,
        )

    excluded = {"content-encoding", "transfer-encoding", "connection"}
    out_headers = [(k, v) for k, v in upstream_resp.headers.items() if k.lower() not in excluded]
    return Response(
        content=upstream_resp.content,
        status_code=upstream_resp.status_code,
        headers=dict(out_headers),
        media_type=upstream_resp.headers.get("content-type"),
    )
