import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a", // bleu ardoise plus clair
        foreground: "#0b1120",
        primary: {
          50: "#e0f2ff",
          100: "#bae6fd",
          500: "#38bdf8", // bleu néon logo
          600: "#0ea5e9"
        },
        neonBlue: "#22d3ee",
        accent: "#facc15", // petite touche jaune humoristique
        muted: "#64748b",
        card: "#e2e8f0"
      },
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "neon-pink": "0 0 25px rgba(51, 179, 255, 0.6)",
        "neon-blue": "0 0 35px rgba(0, 184, 255, 0.85)"
      }
    }
  },
  plugins: []
};

export default config;
