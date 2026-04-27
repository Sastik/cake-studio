import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../lib/productsApi";
import { formatINR } from "../lib/currency";
import { useAuth } from "../state/auth";

export default function CakeCard({ cake }: { cake: Product }) {
  const occasions = cake.occasions ?? [];
  const colors = cake.colors ?? [];
  const auth = useAuth();
  const nav = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className="glass rounded-2xl shadow-soft overflow-hidden"
    >
      <Link
        to={`/cakes/${cake.id}`}
        className="block"
        onClick={(e) => {
          if (!auth.user) {
            e.preventDefault();
            const next = encodeURIComponent(`/cakes/${cake.id}`);
            nav(`/login?next=${next}`);
          }
        }}
      >
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={
              cake.image ??
              "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=60"
            }
            alt={cake.name}
            loading="lazy"
            className="h-full w-full object-cover scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/0 to-white/0" />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-slate-900 truncate">{cake.name}</div>
              <div className="mt-1 text-xs text-slate-600 overflow-hidden max-h-10">
                {cake.description}
              </div>
            </div>
            <div className="shrink-0 text-sm font-extrabold text-slate-900">
              {formatINR(cake.price)}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {cake.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/70 bg-white/60 px-2 py-1 text-[11px] font-semibold text-slate-700"
              >
                {t}
              </span>
            ))}
            {occasions.slice(0, 1).map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/70 bg-blush-50/80 px-2 py-1 text-[11px] font-semibold text-slate-700"
              >
                {t}
              </span>
            ))}
            {colors.slice(0, 1).map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/70 bg-white/60 px-2 py-1 text-[11px] font-semibold text-slate-700"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
