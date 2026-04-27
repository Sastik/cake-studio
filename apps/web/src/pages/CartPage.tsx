import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../state/cart";
import { formatINR } from "../lib/currency";

export default function CartPage() {
  const cart = useCart();
  const empty = cart.lines.length === 0;

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl shadow-soft p-5">
        <h1 className="text-xl font-extrabold text-slate-900">Cart</h1>
        <p className="mt-1 text-sm text-slate-700">
          Review items and add any delivery/pickup notes.
        </p>
      </div>

      {empty ? (
        <div className="glass rounded-2xl shadow-soft p-5">
          <div className="text-sm font-extrabold text-slate-900">Your cart is empty</div>
          <div className="mt-1 text-sm text-slate-700">Add a cake to get started.</div>
          <Link to="/cakes" className="mt-4 inline-flex btn-primary">
            Browse cakes
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.lines.map((l) => (
            <div key={l.id} className="glass rounded-2xl shadow-soft p-4">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl overflow-hidden border border-white/70 bg-white/70 shrink-0">
                  {l.image ? <img src={l.image} alt="" className="h-full w-full object-cover" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold text-slate-900 truncate">{l.name}</div>
                  <div className="text-xs text-slate-600">
                    {formatINR(l.price)} • Line total {formatINR(l.price * l.qty)}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button className="btn-secondary px-3 py-2" onClick={() => cart.dec(l.id)}>
                      −
                    </button>
                    <div className="w-10 text-center text-sm font-bold text-slate-900">{l.qty}</div>
                    <button className="btn-secondary px-3 py-2" onClick={() => cart.inc(l.id)}>
                      +
                    </button>
                    <button
                      className="ml-auto text-sm font-semibold text-slate-700 underline"
                      onClick={() => cart.remove(l.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="glass rounded-2xl shadow-soft p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold text-slate-900">Subtotal</div>
              <div className="text-sm font-extrabold text-slate-900">{formatINR(cart.subtotal)}</div>
            </div>
            <div className="mt-1 text-xs text-slate-600">
              Final pricing may vary with customization and delivery.
            </div>

            <label className="mt-4 block space-y-1">
              <div className="text-xs font-semibold text-slate-700">Order notes</div>
              <textarea
                value={cart.notes}
                onChange={(e) => cart.setNotes(e.target.value)}
                rows={3}
                placeholder="Delivery address, time, eggless preference, message on cake..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-soft outline-none focus:border-blush-200"
              />
            </label>

            <div className="mt-4 flex items-center gap-3">
              <Link to="/cakes" className="btn-secondary">
                Add more
              </Link>
              <Link to="/checkout" className="btn-primary ml-auto">
                Checkout
              </Link>
              <motion.button
                whileTap={{ scale: 0.99 }}
                className="btn-secondary"
                onClick={() => cart.clear()}
              >
                Clear cart
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
