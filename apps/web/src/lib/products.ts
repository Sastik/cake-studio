export type CakeProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  image: string;
  featured?: boolean;
};

export const products: CakeProduct[] = [
  {
    id: "strawberry-cloud",
    name: "Strawberry Cloud",
    description:
      "Soft vanilla sponge, strawberry compote, and a silky whipped frosting — light, fresh, premium.",
    price: 799,
    tags: ["Best seller", "Eggless option"],
    image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1200&q=60",
    featured: true,
  },
  {
    id: "choco-truffle",
    name: "Chocolate Truffle",
    description: "Deep cocoa cake with smooth ganache and a glossy truffle finish.",
    price: 899,
    tags: ["Rich", "Classic"],
    image: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?auto=format&fit=crop&w=1200&q=60",
    featured: true,
  },
  {
    id: "red-velvet-blush",
    name: "Red Velvet Blush",
    description: "Velvety crumb with cream cheese frosting. Balanced sweetness.",
    price: 999,
    tags: ["Premium", "Party"],
    image: "https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=1200&q=60",
    featured: true,
  },
  {
    id: "mango-mousse",
    name: "Mango Mousse",
    description: "Seasonal mango mousse layered over soft sponge — sunshine in a slice.",
    price: 849,
    tags: ["Seasonal", "Light"],
    image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "coffee-caramel",
    name: "Coffee Caramel",
    description: "Espresso notes, caramel swirl, and a creamy finish.",
    price: 949,
    tags: ["Grown-up", "Bold"],
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=60",
  },
];

export function getProductById(id: string) {
  return products.find((p) => p.id === id) ?? null;
}

