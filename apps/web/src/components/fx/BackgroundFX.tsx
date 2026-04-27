import { motion } from "framer-motion";

export default function BackgroundFX() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-blush-50 via-white to-white" />

      <motion.div
        className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-blush-100/70 blur-2xl"
        animate={{ x: [0, 30, 0], y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-blush-200/50 blur-2xl"
        animate={{ x: [0, -24, 0], y: [0, 18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-white/60 blur-2xl border border-white/80"
        animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

