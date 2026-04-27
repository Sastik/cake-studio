import { apiJson } from "./api";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  image?: string | null;
  occasions?: string[];
  available_weights?: string[];
  colors?: string[];
};

export async function fetchProducts(): Promise<Product[]> {
  return apiJson<Product[]>("/products", { method: "GET" });
}

export async function fetchProduct(id: string): Promise<Product> {
  return apiJson<Product>(`/products/${encodeURIComponent(id)}`, { method: "GET" });
}
