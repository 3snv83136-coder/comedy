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
        foreground: "#f9fafb",
        primary: {
          50: "#e0f2ff",
          100: "#bae6fd",
          500: "#38bdf8", // bleu néon logo
          600: "#0ea5e9"
        },
        neonBlue: "#22d3ee",
        accent: "#facc15", // jaune humour
        muted: "#64748b",
        card: "#1e293b"
      },
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "neon-pink": "0 0 18px rgba(56, 189, 248, 0.6)",
        "neon-blue": "0 0 26px rgba(34, 211, 238, 0.9)"
      }
    }
  },
  plugins: []
};

export default config;
