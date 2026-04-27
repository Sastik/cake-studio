import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../lib/ordersApi";
import { formatINR } from "../lib/currency";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import AuthField from "../components/auth/AuthField";
import { useCart } from "../state/cart";
import { useAuth } from "../state/auth";

export default function CheckoutPage() {
  const cart = useCart();
  const auth = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState(auth.user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const whatsAppUrl = useMemo(() => {
    const number = import.meta.env.VITE_WHATSAPP_NUMBER ?? "";
    const businessName = import.meta.env.VITE_BUSINESS_NAME ?? "Cake Studio";
    if (!number) return null;
    return buildWhatsAppUrl({
      phoneNumber: number,
      businessName,
      cartLines: cart.lines,
      notes: `Name: ${name}\nPhone: ${phone}\nAddress: ${address}\nDate: ${date}\nTime: ${time}\n\n${cart.notes}`.trim(),
      customRequest: cart.customRequest,
    });
  }, [cart.lines, cart.notes, cart.customRequest, name, phone, address, date, time]);

  const empty = cart.lines.length === 0;
  if (empty) {
    return (
      <div className="space-y-4">
        <div className="glass rounded-2xl shadow-soft p-5">
          <div className="text-sm font-extrabold text-slate-900">Nothing to checkout</div>
          <div className="mt-1 text-sm text-slate-700">Add items to cart first.</div>
          <Link to="/cakes" className="mt-4 inline-flex btn-primary">
            Browse cakes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl shadow-soft p-5">
        <h1 className="text-xl font-extrabold text-slate-900">Checkout</h1>
        <p className="mt-1 text-sm text-slate-700">
          Confirm delivery details and place your order.
        </p>
      </div>

      <div className="glass rounded-2xl shadow-soft p-5 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <AuthField
            label="Full name"
            value={name}
            onChange={setName}
            placeholder="Your name"
            autoComplete="name"
          />
          <AuthField
            label="Phone number"
            value={phone}
            onChange={setPhone}
            placeholder="+91 98765 43210"
            autoComplete="tel"
          />
          <div className="sm:col-span-2">
            <label className="block space-y-1">
              <div className="text-xs font-semibold text-slate-700">Delivery address</div>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="House/Street, Landmark, Area, City, Pincode"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-soft outline-none focus:border-blush-200"
              />
            </label>
          </div>
          <AuthField label="Delivery date" value={date} onChange={setDate} type="date" />
          <AuthField
            label="Delivery time"
            value={time}
            onChange={setTime}
            placeholder="6–8 PM"
            autoComplete="off"
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}

        <div className="rounded-2xl border border-white/70 bg-white/60 p-4">
          <div className="text-sm font-extrabold text-slate-900">Order summary</div>
          <div className="mt-2 space-y-2">
            {cart.lines.map((l) => (
              <div key={l.id} className="flex items-center justify-between text-sm">
                <div className="text-slate-800">
                  {l.name} × {l.qty}
                </div>
                <div className="font-semibold text-slate-900">{formatINR(l.price * l.qty)}</div>
              </div>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-slate-200/60 pt-3">
              <div className="text-sm font-extrabold text-slate-900">Subtotal</div>
              <div className="text-sm font-extrabold text-slate-900">{formatINR(cart.subtotal)}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <motion.button
            whileTap={{ scale: 0.99 }}
            className="btn-primary"
            disabled={busy}
            onClick={async () => {
              setError(null);
              if (!name.trim()) return setError("Enter your name");
              if (!phone.trim()) return setError("Enter your phone number");
              if (!address.trim()) return setError("Enter delivery address");
              if (!date.trim()) return setError("Select delivery date");
              if (!time.trim()) return setError("Enter delivery time window");

              setBusy(true);
              try {
                const order = await createOrder({
                  customer_name: name.trim(),
                  phone_number: phone.trim(),
                  delivery_address: address.trim(),
                  delivery_date: date.trim(),
                  delivery_time: time.trim(),
                  notes: cart.notes,
                  lines: cart.lines.map((l) => ({
                    product_id: l.id,
                    name: l.name,
                    price: l.price,
                    qty: l.qty,
                  })),
                  custom_request: cart.customRequest,
                });
                cart.clear();
                cart.setNotes("");
                nav(`/orders/${order.id}`);
              } catch (e: any) {
                setError(e?.message ?? "Order failed");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Placing…" : "Place order"}
          </motion.button>

          {whatsAppUrl ? (
            <a className="btn-secondary" href={whatsAppUrl} target="_blank" rel="noreferrer">
              Order via WhatsApp
            </a>
          ) : (
            <div className="btn-secondary opacity-60 cursor-not-allowed">WhatsApp not set</div>
          )}
        </div>

        <div className="text-xs text-slate-600">
          You’re logged in as <span className="font-semibold">{auth.user?.email}</span>.
        </div>
      </div>
    </div>
  );
}

