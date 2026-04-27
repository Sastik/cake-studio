import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { fetchOrder } from "../lib/ordersApi";
import type { Order } from "../lib/ordersApi";
import { formatINR } from "../lib/currency";

export default function OrderStatusPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchOrder(id);
        if (!cancelled) setOrder(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Could not load order");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="glass rounded-2xl shadow-soft p-5">
        <div className="text-sm font-extrabold text-slate-900">Order not available</div>
        <div className="mt-1 text-sm text-slate-700">{error}</div>
        <Link to="/" className="mt-4 inline-flex btn-primary">
          Back home
        </Link>
      </div>
    );
  }

  if (!order) return null;

  const subtotal = order.lines.reduce((s, l) => s + l.price * l.qty, 0);

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl shadow-soft p-5">
        <div className="text-xs font-semibold text-slate-600">Order ID</div>
        <div className="text-sm font-extrabold text-slate-900 break-all">{order.id}</div>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1 text-xs font-semibold text-slate-700">
          <span className="h-2 w-2 rounded-full bg-blush-200" />
          Status: {order.status}
        </div>
      </div>

      <div className="glass rounded-2xl shadow-soft p-5 space-y-3">
        <div className="text-sm font-extrabold text-slate-900">Delivery</div>
        <div className="text-sm text-slate-700">
          <div>
            <span className="font-semibold">Name:</span> {order.customer_name}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {order.phone_number}
          </div>
          {order.delivery_date ? (
            <div>
              <span className="font-semibold">Date:</span> {order.delivery_date}
            </div>
          ) : null}
          {order.delivery_time ? (
            <div>
              <span className="font-semibold">Time:</span> {order.delivery_time}
            </div>
          ) : null}
          {order.delivery_address ? (
            <div className="mt-2 rounded-2xl border border-white/70 bg-white/60 p-4">
              <div className="text-xs font-semibold text-slate-600">Address</div>
              <div className="mt-1 text-sm text-slate-800 whitespace-pre-wrap">
                {order.delivery_address}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="glass rounded-2xl shadow-soft p-5 space-y-3">
        <div className="text-sm font-extrabold text-slate-900">Items</div>
        <div className="space-y-2">
          {order.lines.map((l) => (
            <div key={l.product_id} className="flex items-center justify-between text-sm">
              <div className="text-slate-800">
                {l.name} × {l.qty}
              </div>
              <div className="font-semibold text-slate-900">{formatINR(l.price * l.qty)}</div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
            <div className="text-sm font-extrabold text-slate-900">Subtotal</div>
            <div className="text-sm font-extrabold text-slate-900">{formatINR(subtotal)}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/" className="btn-primary">
          Continue shopping
        </Link>
        <Link to="/cakes" className="btn-secondary">
          View cakes
        </Link>
      </div>
    </div>
  );
}

