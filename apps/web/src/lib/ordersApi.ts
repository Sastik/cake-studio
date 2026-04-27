import { apiJson } from "./api";

export type OrderLine = {
  product_id: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  status: string;
  created_at: number;
  customer_name: string;
  phone_number: string;
  delivery_address?: string;
  delivery_date?: string;
  delivery_time?: string;
  notes?: string;
  lines: OrderLine[];
  custom_request: Record<string, string>;
};

export type CreateOrderRequest = {
  customer_name: string;
  phone_number: string;
  delivery_address: string;
  delivery_date: string;
  delivery_time: string;
  notes: string;
  lines: OrderLine[];
  custom_request: Record<string, string>;
};

export async function createOrder(body: CreateOrderRequest): Promise<Order> {
  return apiJson<Order>("/orders", { method: "POST", body: JSON.stringify(body) });
}

export async function fetchOrder(orderId: string): Promise<Order> {
  return apiJson<Order>(`/orders/${encodeURIComponent(orderId)}`, { method: "GET" });
}

