import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";

export default function AuthCard3D({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rx = useTransform(my, [0, 1], [10, -10]);
  const ry = useTransform(mx, [0, 1], [-12, 12]);
  const rotateX = useSpring(rx, { stiffness: 180, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 180, damping: 18 });

  return (
    <motion.div
      className="relative"
      onPointerMove={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mx.set(Math.min(1, Math.max(0, x)));
        my.set(Math.min(1, Math.max(0, y)));
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="glass rounded-2xl shadow-soft overflow-hidden border border-white/70"
      >
        <div className="relative p-6">
          <div className="absolute -top-24 -right-20 h-56 w-56 rounded-full bg-blush-200/40 blur-2xl" />
          <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-blush-100/60 blur-2xl" />

          <div className="relative" style={{ transform: "translateZ(30px)" }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1 text-xs font-semibold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-blush-200" />
              Secure checkout
            </div>
            <h1 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-700">{subtitle}</p>
          </div>

          <div className="relative mt-5" style={{ transform: "translateZ(18px)" }}>
            {children}
          </div>

          <motion.div
            aria-hidden
            className="absolute right-6 top-6 h-14 w-14 rounded-[1.6rem] bg-gradient-to-br from-blush-200 via-white to-blush-50 shadow-glow border border-white/80"
            animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ transform: "translateZ(45px)" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

