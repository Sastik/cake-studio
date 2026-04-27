import { motion } from "framer-motion";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import { useCart } from "../state/cart";

export default function StickyWhatsAppCTA() {
  const cart = useCart();
  const location = useLocation();

  const number = import.meta.env.VITE_WHATSAPP_NUMBER ?? "";
  const businessName = import.meta.env.VITE_BUSINESS_NAME ?? "Cake Studio";

  const url = useMemo(() => {
    if (!number) return null;
    return buildWhatsAppUrl({
      phoneNumber: number,
      businessName,
      cartLines: cart.lines,
      notes: cart.notes,
      customRequest: cart.customRequest,
    });
  }, [number, businessName, cart.lines, cart.notes, cart.customRequest]);

  const hidden = location.pathname.startsWith("/cart") && cart.totalItems === 0;
  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto w-full max-w-[1100px] px-4 pb-4">
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-2xl shadow-soft px-3 py-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-slate-900">
                Order on WhatsApp
              </div>
              <div className="text-xs text-slate-600 truncate">
                {cart.totalItems > 0
                  ? `${cart.totalItems} item(s) in cart • Tap to send message`
                  : "Quick order • Tap to start chat"}
              </div>
            </div>

            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary whitespace-nowrap active:scale-[0.99] transition"
              >
                WhatsApp
              </a>
            ) : (
              <button className="btn-primary opacity-60 cursor-not-allowed" disabled>
                Set number
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

