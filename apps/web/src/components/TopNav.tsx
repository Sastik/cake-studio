import { Link, NavLink } from "react-router-dom";
import { useCart } from "../state/cart";
import { useAuth } from "../state/auth";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-2xl px-3 py-2 text-sm font-semibold transition",
          isActive
            ? "bg-white shadow-soft border border-slate-200"
            : "text-slate-700 hover:bg-white/70 hover:shadow-soft hover:border hover:border-white/80",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

export default function TopNav() {
  const cart = useCart();
  const auth = useAuth();
  const [open, setOpen] = useState(false);

  const cartBadge =
    cart.totalItems > 0 ? (
      <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-blush-200 px-1.5 text-xs">
        {cart.totalItems}
      </span>
    ) : null;

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/50 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-blush-200 to-white shadow-glow border border-white/80" />
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-slate-900">
              {import.meta.env.VITE_BUSINESS_NAME ?? "Cake Studio"}
            </div>
            <div className="text-[11px] text-slate-600">Homemade. Fresh. Premium.</div>
          </div>
        </Link>

        <nav className="hidden sm:flex items-center gap-2">
          <NavItem to="/cakes" label="Cakes" />
          <NavItem to="/custom" label="Custom" />
          {auth.user ? (
            <button
              onClick={() => auth.logout()}
              className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white/70 hover:shadow-soft hover:border hover:border-white/80"
            >
              {auth.user.role === "admin" ? "Admin" : "Account"} • Logout
            </button>
          ) : (
            <NavItem to="/login" label="Login" />
          )}
          <Link
            to="/cart"
            className="relative rounded-2xl px-3 py-2 text-sm font-semibold bg-white shadow-soft border border-slate-200"
          >
            Cart
            {cartBadge}
          </Link>
        </nav>

        <div className="flex sm:hidden items-center gap-2">
          <Link
            to="/cart"
            className="relative rounded-2xl px-3 py-2 text-sm font-semibold bg-white shadow-soft border border-slate-200"
            onClick={() => setOpen(false)}
          >
            Cart{cartBadge}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-2xl px-3 py-2 text-sm font-semibold bg-white shadow-soft border border-slate-200"
            aria-expanded={open}
            aria-label="Menu"
          >
            Menu
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="sm:hidden overflow-hidden border-t border-white/60 bg-white/60 backdrop-blur-md"
          >
            <div className="mx-auto w-full max-w-[1100px] px-4 py-3">
              <div className="grid gap-2">
                <Link
                  to="/cakes"
                  className="btn-secondary justify-start"
                  onClick={() => setOpen(false)}
                >
                  Cakes
                </Link>
                <Link
                  to="/custom"
                  className="btn-secondary justify-start"
                  onClick={() => setOpen(false)}
                >
                  Custom request
                </Link>
                {!auth.user ? (
                  <Link
                    to="/login"
                    className="btn-primary justify-start"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                ) : (
                  <button
                    className="btn-primary justify-start"
                    onClick={() => {
                      setOpen(false);
                      auth.logout();
                    }}
                  >
                    Logout ({auth.user.role})
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
