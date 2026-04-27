import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#111827",
          800: "#1F2937",
          700: "#374151",
          600: "#4B5563",
        },
        blush: {
          50: "#FFF0F5",
          100: "#FADADD",
          200: "#FFC0CB",
        },
        cream: "#FFFFFF",
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(17, 24, 39, 0.10)",
        glow: "0 10px 30px rgba(255, 192, 203, 0.30)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
} satisfies Config;
