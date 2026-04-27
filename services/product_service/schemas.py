from pydantic import BaseModel, Field


class Product(BaseModel):
    id: str
    name: str
    description: str
    price: int = Field(ge=0)
    tags: list[str] = []
    image: str | None = None
    occasions: list[str] = []
    available_weights: list[str] = []
    colors: list[str] = []


class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1, max_length=500)
    price: int = Field(ge=0)
    tags: list[str] = []
    occasions: list[str] = []
    available_weights: list[str] = []
    colors: list[str] = []


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = Field(default=None, min_length=1, max_length=500)
    price: int | None = Field(default=None, ge=0)
    tags: list[str] | None = None
    occasions: list[str] | None = None
    available_weights: list[str] | None = None
    colors: list[str] | None = None
