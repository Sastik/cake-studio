from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from time import time

from .schemas import OrderCreate, Order

app = FastAPI(title="Order Service", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_orders: dict[str, Order] = {}


@app.get("/health")
def health():
    return {"ok": True, "service": "order"}


@app.post("/orders", response_model=Order)
def create_order(body: OrderCreate):
    if not body.lines and not body.custom_request:
        raise HTTPException(status_code=400, detail="Order must have cart lines or a custom request")
    order_id = str(uuid4())
    order = Order(
        id=order_id,
        created_at=int(time()),
        customer_name=body.customer_name,
        phone_number=body.phone_number,
        delivery_address=body.delivery_address,
        delivery_date=body.delivery_date,
        delivery_time=body.delivery_time,
        notes=body.notes,
        lines=body.lines,
        custom_request=body.custom_request,
    )
    _orders[order_id] = order
    return order


@app.get("/orders/{order_id}", response_model=Order)
def get_order(order_id: str):
    order = _orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Not found")
    return order


@app.get("/orders", response_model=list[Order])
def list_orders():
    return list(_orders.values())
