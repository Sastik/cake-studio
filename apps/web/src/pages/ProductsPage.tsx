import CakeCard from "../components/CakeCard";
import LoadingScreen from "../components/LoadingScreen";
import { useProducts } from "../lib/hooks/useProducts";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const { items, isLoading, error } = useProducts();
  const [q, setQ] = useState("");
  const [occasion, setOccasion] = useState<string>("All");
  const [weight, setWeight] = useState<string>("All");
  const [color, setColor] = useState<string>("All");

  const filterOptions = useMemo(() => {
    const occasions = new Set<string>();
    const weights = new Set<string>();
    const colors = new Set<string>();
    for (const p of items) {
      for (const o of p.occasions ?? []) occasions.add(o);
      for (const w of p.available_weights ?? []) weights.add(w);
      for (const c of p.colors ?? []) colors.add(c);
    }
    const sortAlpha = (a: string, b: string) => a.localeCompare(b);
    return {
      occasions: ["All", ...Array.from(occasions).sort(sortAlpha)],
      weights: ["All", ...Array.from(weights).sort(sortAlpha)],
      colors: ["All", ...Array.from(colors).sort(sortAlpha)],
    };
  }, [items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((p) => {
      if (needle) {
        const hay = `${p.name} ${p.description} ${(p.tags ?? []).join(" ")} ${(p.occasions ?? []).join(
          " ",
        )}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (occasion !== "All") {
        if (!(p.occasions ?? []).includes(occasion)) return false;
      }
      if (weight !== "All") {
        if (!(p.available_weights ?? []).includes(weight)) return false;
      }
      if (color !== "All") {
        if (!(p.colors ?? []).includes(color)) return false;
      }
      return true;
    });
  }, [items, q, occasion, weight, color]);

  // Red-velvet style hero image (reliable static Unsplash CDN url).
  const heroImage =
    "https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=1600&q=60";

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-2xl shadow-soft border border-white/70 bg-white/55 backdrop-blur-md">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,192,203,0.30),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(250,218,221,0.45),transparent_50%),radial-gradient(circle_at_30%_85%,rgba(255,240,245,0.85),transparent_55%)]" />
        </div>

        <motion.div
          className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-blush-100/65 blur-2xl"
          animate={{ x: [0, 22, 0], y: [0, 14, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-10 -right-28 h-80 w-80 rounded-full bg-blush-200/45 blur-2xl"
          animate={{ x: [0, -18, 0], y: [0, 16, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative p-5 sm:p-7 pb-32 sm:pb-16">
          <div className="grid gap-6 sm:grid-cols-2 items-center">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1 text-xs font-semibold text-slate-700">
                <span className="h-2 w-2 rounded-full bg-blush-200" />
                Party-ready cakes • Made fresh
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Your celebration, but make it premium.
              </h1>
              <p className="text-sm text-slate-700">
                Big flavors, soft aesthetics, and a clean checkout flow.
              </p>
            </div>

            <div className="relative h-56 sm:h-72">
              <motion.div
                className="absolute inset-0 grid place-items-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ perspective: 1100 }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 1.5, 0] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="h-52 w-52 sm:h-64 sm:w-64 rounded-[2.9rem] bg-gradient-to-br from-blush-200 via-white to-blush-50 shadow-glow border border-white/80" />
                  <div className="absolute inset-4 rounded-[2.5rem] bg-white/45 border border-white/80 backdrop-blur-xs" />
                  <div className="absolute inset-7 rounded-[2.3rem] overflow-hidden border border-white/70 bg-white/60">
                    <img
                      src={heroImage}
                      alt="Featured cake"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/0 to-white/0" />
                  </div>
                  <motion.div
                    aria-hidden
                    className="absolute -top-3 -left-3 h-10 w-10 rounded-2xl bg-white/70 border border-white/80 shadow-soft"
                    animate={{ rotate: [0, 8, 0], y: [0, -4, 0] }}
                    transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    aria-hidden
                    className="absolute -bottom-3 -right-3 h-10 w-10 rounded-2xl bg-blush-100/80 border border-white/80 shadow-soft"
                    animate={{ rotate: [0, -10, 0], y: [0, 5, 0] }}
                    transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 h-12 w-60 rounded-full bg-slate-900/10 blur-xl" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          <div className="absolute left-0 right-0 -bottom-14 sm:-bottom-10 px-5 sm:px-7">
            <div className="glass rounded-2xl shadow-soft p-4 sm:p-5 space-y-3">
              <label className="block space-y-1">
                <div className="text-xs font-semibold text-slate-700">Search</div>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Chocolate, birthday, pink, 1kg..."
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-soft outline-none focus:border-blush-200"
                />
              </label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <label className="block space-y-1">
                  <div className="text-xs font-semibold text-slate-700">Occasion</div>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-soft outline-none focus:border-blush-200"
                  >
                    {filterOptions.occasions.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-1">
                  <div className="text-xs font-semibold text-slate-700">Weight</div>
                  <select
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-soft outline-none focus:border-blush-200"
                  >
                    {filterOptions.weights.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-1 col-span-2 sm:col-span-1">
                  <div className="text-xs font-semibold text-slate-700">Color</div>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-soft outline-none focus:border-blush-200"
                  >
                    {filterOptions.colors.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  Showing{" "}
                  <span className="font-semibold text-slate-900">{filtered.length}</span> cake(s)
                </div>
                <button
                  className="btn-secondary px-3 py-2"
                  onClick={() => {
                    setQ("");
                    setOccasion("All");
                    setWeight("All");
                    setColor("All");
                  }}
                  type="button"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isLoading ? <LoadingScreen /> : null}

      {error ? (
        <div className="glass rounded-2xl shadow-soft p-5">
          <div className="text-sm font-extrabold text-slate-900">Could not load cakes</div>
          <div className="mt-1 text-sm text-slate-700">{error}</div>
        </div>
      ) : null}

      {!isLoading && !error ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {filtered.map((cake) => (
            <CakeCard key={cake.id} cake={cake} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
