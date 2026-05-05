import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Clinical, professional palette
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc8fb",
          400: "#36acf7",
          500: "#0c92eb",
          600: "#0074ca",
          700: "#005ca5",
          800: "#004f89",
          900: "#064271",
          950: "#042a4a",
          DEFAULT: "#0c92eb",
        },
        ink: {
          DEFAULT: "#0B1220",
          soft: "#1B2437",
          muted: "#4B5565",
          onbrand: "#FFFFFF"
        },
        paper: {
          DEFAULT: "#F7F8FB",
          raised: "#FFFFFF",
          sunk: "#EEF1F6",
          dark: "#0F172A",
          "dark-raised": "#1E293B"
        },
        accent: {
          DEFAULT: "#0c92eb",
          soft: "#DDE7FB"
        },
        caution: {
          DEFAULT: "#B45309",
          soft: "#FEF3C7"
        },
        halt: {
          DEFAULT: "#B91C1C",
          soft: "#FEE2E2"
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        bento: "1.25rem",
        "2xl": "1rem",
        "3xl": "1.5rem"
      },
      boxShadow: {
        bento: "0 1px 2px rgba(11,18,32,0.04), 0 8px 24px rgba(11,18,32,0.06)",
        "premium": "0 0 0 1px rgba(0,0,0,.03),0 2px 4px rgba(0,0,0,.05),0 12px 24px rgba(0,0,0,.05)",
        "premium-dark": "0 0 0 1px rgba(255,255,255,.05),0 2px 4px rgba(0,0,0,.2),0 12px 24px rgba(0,0,0,.2)"
      },
      animation: {
        "pulse-subtle": "pulse-subtle 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" },
        }
      }
    }
  },
  plugins: []
};

export default config;
