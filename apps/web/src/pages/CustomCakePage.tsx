import { motion } from "framer-motion";
import { useCart } from "../state/cart";

function Field({
  label,
  placeholder,
  value,
  onChange,
  type,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block space-y-1">
      <div className="text-xs font-semibold text-slate-700">{label}</div>
      <input
        type={type ?? "text"}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-soft outline-none focus:border-blush-200"
      />
    </label>
  );
}

export default function CustomCakePage() {
  const cart = useCart();
  const cr = cart.customRequest;

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl shadow-soft p-5">
        <h1 className="text-xl font-extrabold text-slate-900">Custom cake request</h1>
        <p className="mt-1 text-sm text-slate-700">
          Minimal typing. Fill what you know — the WhatsApp message will include these details.
        </p>
      </div>

      <div className="glass rounded-2xl shadow-soft p-5 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Occasion"
            placeholder="Birthday, anniversary..."
            value={cr.occasion}
            onChange={(v) => cart.setCustom("occasion", v)}
          />
          <Field
            label="Flavors"
            placeholder="Chocolate, strawberry..."
            value={cr.flavors}
            onChange={(v) => cart.setCustom("flavors", v)}
          />
          <Field
            label="Size"
            placeholder="0.5kg, 1kg..."
            value={cr.size}
            onChange={(v) => cart.setCustom("size", v)}
          />
          <Field
            label="Budget"
            placeholder="₹700–₹1200"
            value={cr.budget}
            onChange={(v) => cart.setCustom("budget", v)}
          />
          <Field
            label="Delivery date"
            type="date"
            value={cr.date}
            onChange={(v) => cart.setCustom("date", v)}
          />
        </div>

        <label className="block space-y-1">
          <div className="text-xs font-semibold text-slate-700">Message / design notes</div>
          <textarea
            value={cr.message}
            placeholder="Theme colors, name on cake, reference ideas..."
            onChange={(e) => cart.setCustom("message", e.target.value)}
            rows={4}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-soft outline-none focus:border-blush-200"
          />
        </label>

        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            This saves locally on your device (no account needed).
          </div>
          <motion.button
            whileTap={{ scale: 0.99 }}
            className="btn-secondary"
            onClick={() => {
              cart.setCustom("occasion", "");
              cart.setCustom("flavors", "");
              cart.setCustom("size", "");
              cart.setCustom("budget", "");
              cart.setCustom("date", "");
              cart.setCustom("message", "");
            }}
          >
            Clear
          </motion.button>
        </div>
      </div>
    </div>
  );
}

