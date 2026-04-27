from pydantic import BaseModel, Field


class OrderLine(BaseModel):
    product_id: str
    name: str
    price: int = Field(ge=0)
    qty: int = Field(ge=1, le=50)


class OrderCreate(BaseModel):
    user_id: str | None = None
    customer_name: str = Field(min_length=1, max_length=80)
    phone_number: str = Field(min_length=7, max_length=20)
    delivery_address: str = Field(default="", max_length=400)
    delivery_date: str = Field(default="", max_length=32)
    delivery_time: str = Field(default="", max_length=64)
    notes: str = Field(default="", max_length=500)
    lines: list[OrderLine] = Field(default_factory=list)
    custom_request: dict[str, str] = Field(default_factory=dict)


class Order(BaseModel):
    id: str
    status: str = "pending"
    created_at: int
    customer_name: str
    phone_number: str
    delivery_address: str = ""
    delivery_date: str = ""
    delivery_time: str = ""
    notes: str = ""
    lines: list[OrderLine] = []
    custom_request: dict[str, str] = {}
