from __future__ import annotations

from fastapi import FastAPI, HTTPException, UploadFile, File, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from pathlib import Path
import json
import time
from common.settings import settings
from common.redis_client import get_redis
from common.security import verify_token
from schemas import (Product, ProductCreate, ProductUpdate)

app = FastAPI(title="Product Service", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

redis = get_redis()

_products: dict[str, Product] = {}


def _seed():
    initial = [
        Product(
            id="strawberry-cloud",
            name="Strawberry Cloud",
            description="Soft vanilla sponge, strawberry compote, silky whipped frosting.",
            price=799,
            tags=["Best seller", "Eggless option"],
            occasions=["Birthday", "Anniversary", "Kids"],
            available_weights=["0.5kg", "1kg", "2kg"],
            colors=["Pink", "White"],
            image="https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="choco-truffle",
            name="Chocolate Truffle",
            description="Deep cocoa cake with smooth ganache and a glossy finish.",
            price=899,
            tags=["Rich", "Classic"],
            occasions=["Birthday", "Congratulations"],
            available_weights=["0.5kg", "1kg", "2kg"],
            colors=["Brown", "Gold"],
            image="https://images.unsplash.com/photo-1601979031925-424e53b6caaa?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="red-velvet-blush",
            name="Red Velvet Blush",
            description="Velvety crumb with cream cheese frosting. Balanced sweetness.",
            price=999,
            tags=["Premium", "Party"],
            occasions=["Anniversary", "Valentine", "Birthday"],
            available_weights=["1kg", "2kg", "3kg"],
            colors=["Red", "White", "Pink"],
            image="https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="mango-mousse",
            name="Mango Mousse",
            description="Seasonal mango mousse layered over soft sponge — sunshine in a slice.",
            price=849,
            tags=["Seasonal", "Light"],
            occasions=["Birthday", "Summer", "Kids"],
            available_weights=["0.5kg", "1kg", "2kg"],
            colors=["Yellow", "White"],
            image="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="coffee-caramel",
            name="Coffee Caramel",
            description="Espresso notes, caramel swirl, and a creamy finish.",
            price=949,
            tags=["Grown-up", "Bold"],
            occasions=["Congratulations", "Farewell", "Office"],
            available_weights=["1kg", "2kg"],
            colors=["Beige", "Brown"],
            image="https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="black-forest",
            name="Black Forest",
            description="Chocolate sponge, cherries, whipped cream, and dark chocolate shavings.",
            price=899,
            tags=["Classic", "Crowd favorite"],
            occasions=["Birthday", "Anniversary"],
            available_weights=["0.5kg", "1kg", "2kg", "3kg"],
            colors=["Black", "White", "Red"],
            image="https://images.unsplash.com/photo-1549277513-f1b32fe1f8f5?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="rasmalai-fusion",
            name="Rasmalai Fusion",
            description="Soft sponge soaked with saffron milk and rasmalai notes.",
            price=1099,
            tags=["Indian", "Premium"],
            occasions=["Birthday", "Festival"],
            available_weights=["1kg", "2kg"],
            colors=["Cream", "Gold"],
            image="https://images.unsplash.com/photo-1608830597604-619220679440?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="oreo-crunch",
            name="Oreo Crunch",
            description="Chocolate cake with Oreo crumble layers and cookie frosting.",
            price=949,
            tags=["Kids", "Crunchy"],
            occasions=["Kids", "Birthday"],
            available_weights=["0.5kg", "1kg", "2kg"],
            colors=["Black", "White"],
            image="https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="butterscotch-classic",
            name="Butterscotch Classic",
            description="Caramel-butterscotch cream with crunchy praline bits.",
            price=849,
            tags=["Classic", "Best seller"],
            occasions=["Birthday", "Anniversary", "Office"],
            available_weights=["0.5kg", "1kg", "2kg", "3kg"],
            colors=["Gold", "Cream"],
            image="https://images.unsplash.com/photo-1563729784474-d77dbb933a9f?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="blueberry-cheesecake",
            name="Blueberry Cheesecake",
            description="Creamy cheesecake topped with blueberry compote.",
            price=1299,
            tags=["Premium", "No-bake feel"],
            occasions=["Anniversary", "Birthday"],
            available_weights=["1kg", "2kg"],
            colors=["Purple", "White"],
            image="https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="unicorn-pastel",
            name="Unicorn Pastel",
            description="Pastel swirls, sprinkle confetti, and a soft vanilla base.",
            price=1199,
            tags=["Trending", "Photo-ready"],
            occasions=["Kids", "Birthday"],
            available_weights=["1kg", "2kg"],
            colors=["Pink", "Purple", "Blue", "White"],
            image="https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="minimal-white-gold",
            name="Minimal White & Gold",
            description="Clean white frosting with subtle gold accents — ultra premium look.",
            price=1399,
            tags=["Premium", "Minimal"],
            occasions=["Anniversary", "Engagement", "Congratulations"],
            available_weights=["1kg", "2kg", "3kg"],
            colors=["White", "Gold"],
            image="https://images.unsplash.com/photo-1558024920-b41e188fe0f0?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="pink-rose",
            name="Pink Rose Garden",
            description="Soft blush buttercream roses with a light vanilla base.",
            price=1299,
            tags=["Floral", "Premium"],
            occasions=["Anniversary", "Valentine", "Birthday"],
            available_weights=["1kg", "2kg"],
            colors=["Pink", "White"],
            image="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="choco-hazelnut",
            name="Choco Hazelnut",
            description="Nutty hazelnut cream with chocolate layers and crunch.",
            price=1149,
            tags=["Premium", "Nutty"],
            occasions=["Birthday", "Office", "Farewell"],
            available_weights=["1kg", "2kg"],
            colors=["Brown", "Gold"],
            image="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="vanilla-fresh-fruit",
            name="Vanilla Fresh Fruit",
            description="Vanilla cream topped with seasonal fruits for a fresh finish.",
            price=999,
            tags=["Light", "Fresh"],
            occasions=["Birthday", "Summer", "Get well soon"],
            available_weights=["0.5kg", "1kg", "2kg"],
            colors=["White", "Green"],
            image="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="rainbow-layer",
            name="Rainbow Layer",
            description="Colorful layers with smooth frosting — maximum celebration vibes.",
            price=1249,
            tags=["Kids", "Party"],
            occasions=["Kids", "Birthday", "Congratulations"],
            available_weights=["1kg", "2kg"],
            colors=["Red", "Orange", "Yellow", "Green", "Blue", "Purple"],
            image="https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="lotus-biscoff",
            name="Lotus Biscoff",
            description="Caramel biscuit spread with crunchy biscoff crumb.",
            price=1199,
            tags=["Trending", "Premium"],
            occasions=["Birthday", "Office", "Anniversary"],
            available_weights=["1kg", "2kg"],
            colors=["Gold", "Cream"],
            image="https://images.unsplash.com/photo-1614707267537-2c84a61c5a61?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="pistachio-raspberry",
            name="Pistachio Raspberry",
            description="Pistachio cream with tangy raspberry notes — refined and light.",
            price=1399,
            tags=["Premium", "Light"],
            occasions=["Anniversary", "Engagement"],
            available_weights=["1kg", "2kg"],
            colors=["Green", "Pink", "White"],
            image="https://images.unsplash.com/photo-1607478900766-efe13248b125?auto=format&fit=crop&w=1200&q=60",
        ),
        Product(
            id="midnight-choco",
            name="Midnight Choco",
            description="Dark chocolate ganache with a glossy mirror finish.",
            price=1299,
            tags=["Premium", "Rich"],
            occasions=["Birthday", "Farewell", "Office"],
            available_weights=["1kg", "2kg", "3kg"],
            colors=["Black", "Gold"],
            image="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=60",
        ),
    ]
    for p in initial:
        _products[p.id] = p


_seed()


def _rate_limit_key(request: Request) -> str:
    ip = request.client.host if request.client else "unknown"
    return f"rl:products:{ip}:{int(time.time() // 60)}"


def _check_rate_limit(request: Request, limit_per_minute: int = 120):
    if not redis:
        return


def _require_admin(authorization: str | None):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1].strip()
    try:
        payload = verify_token(token, settings.jwt_secret)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return payload
    key = _rate_limit_key(request)
    try:
        value = redis.incr(key)
        if value == 1:
            redis.expire(key, 70)
        if value > limit_per_minute:
            raise HTTPException(status_code=429, detail="Too many requests")
    except HTTPException:
        raise
    except Exception:
        return


@app.get("/health")
def health():
    return {"ok": True, "service": "product", "redis": bool(redis)}


@app.get("/products", response_model=list[Product])
def list_products(request: Request):
    _check_rate_limit(request)
    cache_key = "cache:products:v1"
    if redis:
        try:
            cached = redis.get(cache_key)
            if cached:
                return [Product.model_validate(x) for x in json.loads(cached)]
        except Exception:
            pass
    out = list(_products.values())
    if redis:
        try:
            redis.setex(cache_key, 30, json.dumps([p.model_dump() for p in out]))
        except Exception:
            pass
    return out


@app.get("/products/{product_id}", response_model=Product)
def get_product(product_id: str, request: Request):
    _check_rate_limit(request)
    product = _products.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Not found")
    return product


@app.put("/products/{product_id}", response_model=Product)
def update_product(
    product_id: str,
    body: ProductUpdate,
    request: Request,
    authorization: str | None = Header(default=None),
):
    _check_rate_limit(request, limit_per_minute=60)
    _require_admin(authorization)
    product = _products.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Not found")
    data = body.model_dump(exclude_unset=True)
    updated = product.model_copy(update=data)
    _products[product_id] = updated
    if redis:
        try:
            redis.delete("cache:products:v1")
        except Exception:
            pass
    return updated


@app.delete("/products/{product_id}")
def delete_product(
    product_id: str,
    request: Request,
    authorization: str | None = Header(default=None),
):
    _check_rate_limit(request, limit_per_minute=60)
    _require_admin(authorization)
    if product_id not in _products:
        raise HTTPException(status_code=404, detail="Not found")
    _products.pop(product_id, None)
    if redis:
        try:
            redis.delete("cache:products:v1")
        except Exception:
            pass
    return {"ok": True}


@app.post("/products", response_model=Product)
def create_product(
    body: ProductCreate,
    request: Request,
    authorization: str | None = Header(default=None),
):
    _check_rate_limit(request, limit_per_minute=60)
    _require_admin(authorization)
    product_id = str(uuid4())
    product = Product(id=product_id, image=None, **body.model_dump())
    _products[product_id] = product
    if redis:
        try:
            redis.delete("cache:products:v1")
        except Exception:
            pass
    return product


@app.post("/products/{product_id}/image")
async def upload_image(
    product_id: str,
    file: UploadFile = File(...),
    authorization: str | None = Header(default=None),
):
    _require_admin(authorization)
    product = _products.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Not found")

    ext = (Path(file.filename or "").suffix or ".jpg")[:10]
    out_dir = Path("/tmp/cake_uploads")
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{product_id}{ext}"
    content = await file.read()
    out_path.write_bytes(content)
    product.image = f"/uploads/{out_path.name}"
    _products[product_id] = product

    if redis:
        try:
            redis.delete("cache:products:v1")
        except Exception:
            pass

    return {"ok": True, "path": product.image}
