import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CakeCard from "../components/CakeCard";
import LoadingScreen from "../components/LoadingScreen";
import { useProducts } from "../lib/hooks/useProducts";

export default function HomePage() {
  const { items, isLoading } = useProducts();
  const featured = items.slice(0, 3);
  const heroImage =
    "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1800&q=60";

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-2xl shadow-soft border border-white/70 bg-white/55 backdrop-blur-md min-h-[72vh]">
        <div className="absolute inset-0">
          <motion.img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover"
            initial={{ scale: 1.05, opacity: 0.9 }}
            animate={{ scale: [1.05, 1.1, 1.05], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/35 to-white/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,192,203,0.35),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(250,218,221,0.55),transparent_50%),radial-gradient(circle_at_30%_85%,rgba(255,240,245,0.90),transparent_55%)]" />
        </div>

        <motion.div
          className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-blush-100/65 blur-2xl"
          animate={{ x: [0, 18, 0], y: [0, 12, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-12 -right-28 h-80 w-80 rounded-full bg-blush-200/45 blur-2xl"
          animate={{ x: [0, -16, 0], y: [0, 14, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 p-5 sm:p-7 grid gap-6 sm:grid-cols-2 items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1 text-xs font-semibold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-blush-200" />
              Premium • Fresh • Party‑ready
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Premium homemade cakes, designed for your moments.
            </h1>
            <p className="text-sm text-slate-700 max-w-prose">
              Browse best sellers, add to cart, and checkout in seconds — WhatsApp ordering is always
              one tap away.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/cakes" className="btn-primary">
                Explore cakes
              </Link>
              <Link to="/custom" className="btn-secondary">
                Custom request
              </Link>
            </div>
          </div>

          <div className="relative h-64 sm:h-80">
            <motion.div
              className="absolute inset-0 grid place-items-center"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ perspective: 1100 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 1.5, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="h-56 w-56 sm:h-72 sm:w-72 rounded-[3.1rem] bg-gradient-to-br from-blush-200 via-white to-blush-50 shadow-glow border border-white/80" />
                <div className="absolute inset-4 rounded-[2.7rem] bg-white/45 border border-white/80 backdrop-blur-xs" />
                <div className="absolute inset-7 rounded-[2.5rem] overflow-hidden border border-white/70 bg-white/60">
                  <img src={heroImage} alt="Hero cake" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/65 via-white/0 to-white/0" />
                </div>
                <motion.div
                  aria-hidden
                  className="absolute -top-3 -left-3 h-10 w-10 rounded-2xl bg-white/70 border border-white/80 shadow-soft"
                  animate={{ rotate: [0, 10, 0], y: [0, -4, 0] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  aria-hidden
                  className="absolute -bottom-3 -right-3 h-10 w-10 rounded-2xl bg-blush-100/80 border border-white/80 shadow-soft"
                  animate={{ rotate: [0, -12, 0], y: [0, 5, 0] }}
                  transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-14 w-72 rounded-full bg-slate-900/10 blur-xl" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Featured</h2>
            <p className="text-sm text-slate-600">Our most-loved cakes this week.</p>
          </div>
          <Link to="/cakes" className="text-sm font-semibold text-slate-900 underline">
            View all
          </Link>
        </div>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "WhatsApp ordering",
            body: "Tap once to send a pre-filled message with cart and custom notes.",
          },
          {
            title: "Mobile-first",
            body: "Thumb-friendly layouts, sticky CTA, and minimal typing.",
          },
          {
            title: "AI-ready",
            body: "Backend designed for recommendations and “describe your cake” later.",
          },
        ].map((x) => (
          <div key={x.title} className="glass rounded-2xl shadow-soft p-4">
            <div className="text-sm font-extrabold text-slate-900">{x.title}</div>
            <div className="mt-1 text-sm text-slate-700">{x.body}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
