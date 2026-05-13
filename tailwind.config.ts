import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

// Droposit Tailwind config — design tokens mirror Style_guide.jsonc exactly.
// Colors, radii, shadows, motion all sourced from the single source of truth.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Emerald primary — used ONLY for primary actions, confirmations, active states.
        primary: {
          50: "#edfdf3",
          100: "#d4f7e1",
          200: "#acefc5",
          300: "#73e09d",
          400: "#3bcf73",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          DEFAULT: "#22c55e",
        },
        // Warm tan secondary — premium warmth, used sparingly.
        secondary: {
          50: "#faf7f2",
          100: "#f3ede4",
          200: "#e8dac5",
          300: "#d8bf98",
          400: "#c69d6d",
          500: "#b67f4b",
          600: "#9f6739",
          700: "#84512f",
          800: "#6d4429",
          900: "#5b3925",
          DEFAULT: "#b67f4b",
        },
        gray: {
          0: "#ffffff",
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          850: "#161b22",
          900: "#0f1115",
          950: "#090b0f",
        },
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#3b82f6",
        // Semantic surface tokens — referenced via class names.
        ink: "#0f1115",
        surface: "#161b22",
        elevated: "#1f2937",
      },
      borderRadius: {
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "40px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.08)",
        card: "0 12px 40px rgba(0,0,0,0.12)",
        floating: "0 18px 60px rgba(0,0,0,0.18)",
        glow: "0 0 30px rgba(34,197,94,0.28)",
        "glow-lg": "0 0 60px rgba(34,197,94,0.35)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      backdropBlur: {
        glass: "20px",
        overlay: "40px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "400ms",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      fontSize: {
        display: ["48px", { lineHeight: "52px", fontWeight: "700", letterSpacing: "-0.02em" }],
        h1: ["36px", { lineHeight: "42px", fontWeight: "700", letterSpacing: "-0.02em" }],
        h2: ["28px", { lineHeight: "34px", fontWeight: "700", letterSpacing: "-0.01em" }],
        h3: ["22px", { lineHeight: "28px", fontWeight: "600" }],
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        small: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "500", letterSpacing: "0.02em" }],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0f1115 0%, #14532d 55%, #84cc16 100%)",
        "card-gradient":
          "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.0) 100%)",
        "ambient-glow":
          "radial-gradient(60% 50% at 50% 0%, rgba(34,197,94,0.18) 0%, transparent 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 30px rgba(34,197,94,0.28)" },
          "50%": { boxShadow: "0 0 50px rgba(34,197,94,0.45)" },
        },
      },
      animation: {
        "fade-up": "fade-up 400ms cubic-bezier(0.4, 0, 0.2, 1) both",
        shimmer: "shimmer 1.8s linear infinite",
        "scan-line": "scan-line 2.2s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
