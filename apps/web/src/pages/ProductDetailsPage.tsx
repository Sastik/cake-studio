import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingScreen from "../components/LoadingScreen";
import { formatINR } from "../lib/currency";
import { useCart } from "../state/cart";
import { useProduct } from "../lib/hooks/useProduct";
import { useAuth } from "../state/auth";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { item: cake, isLoading, error } = useProduct(id);
  const cart = useCart();
  const auth = useAuth();
  const nav = useNavigate();

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="glass rounded-2xl shadow-soft p-5">
        <div className="text-sm font-extrabold text-slate-900">Could not load cake</div>
        <div className="mt-1 text-sm text-slate-700">{error}</div>
        <Link to="/cakes" className="mt-3 inline-flex text-sm font-semibold underline">
          Back to cakes
        </Link>
      </div>
    );
  }

  if (!cake) {
    return (
      <div className="glass rounded-2xl shadow-soft p-5">
        <div className="text-sm font-extrabold text-slate-900">Cake not found</div>
        <Link to="/cakes" className="mt-3 inline-flex text-sm font-semibold underline">
          Back to cakes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl shadow-soft overflow-hidden">
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <img
            src={
              cake.image ??
              "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=60"
            }
            alt={cake.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/75 via-white/0 to-white/0" />
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-extrabold text-slate-900">{cake.name}</h1>
              <p className="mt-1 text-sm text-slate-700">{cake.description}</p>
            </div>
            <div className="shrink-0 text-lg font-extrabold text-slate-900">
              {formatINR(cake.price)}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {cake.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/70 bg-white/60 px-2 py-1 text-[11px] font-semibold text-slate-700"
              >
                {t}
              </span>
            ))}
            {(cake.occasions ?? []).slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/70 bg-blush-50/80 px-2 py-1 text-[11px] font-semibold text-slate-700"
              >
                {t}
              </span>
            ))}
            {(cake.colors ?? []).slice(0, 2).map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/70 bg-white/60 px-2 py-1 text-[11px] font-semibold text-slate-700"
              >
                {t}
              </span>
            ))}
          </div>

          {(cake.available_weights ?? []).length > 0 ? (
            <div className="rounded-2xl border border-white/70 bg-white/60 p-4">
              <div className="text-xs font-semibold text-slate-600">Available weights</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(cake.available_weights ?? []).map((w) => (
                  <span
                    key={w}
                    className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-800"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <motion.button
              whileTap={{ scale: 0.99 }}
              className="btn-primary"
              onClick={() => {
                if (!auth.user) {
                  const next = encodeURIComponent(`/cakes/${cake.id}`);
                  nav(`/login?next=${next}`);
                  return;
                }
                cart.add(
                  {
                    id: cake.id,
                    name: cake.name,
                    price: cake.price,
                    image: cake.image ?? undefined,
                  },
                  1,
                );
                nav("/cart");
              }}
            >
              Add to cart
            </motion.button>
            <Link to="/cart" className="btn-secondary">
              Go to cart
            </Link>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/60 p-4">
            <div className="text-sm font-extrabold text-slate-900">Quick notes</div>
            <div className="mt-1 text-sm text-slate-700">
              Mention eggless preference, delivery/pickup time, and a message for the cake while
              ordering.
            </div>
          </div>
        </div>
      </div>

      <Link to="/cakes" className="text-sm font-semibold text-slate-900 underline">
        Back to cakes
      </Link>
    </div>
  );
}
