import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Clinical, calm palette — deliberately non-alarming
        ink: {
          DEFAULT: "#0B1220",
          soft: "#1B2437",
          muted: "#4B5565"
        },
        paper: {
          DEFAULT: "#F7F8FB",
          raised: "#FFFFFF",
          sunk: "#EEF1F6"
        },
        accent: {
          DEFAULT: "#2F6FEB",
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
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Inter", "sans-serif"]
      },
      borderRadius: {
        bento: "1.25rem"
      },
      boxShadow: {
        bento: "0 1px 2px rgba(11,18,32,0.04), 0 8px 24px rgba(11,18,32,0.06)"
      }
    }
  },
  plugins: []
};

export default config;
