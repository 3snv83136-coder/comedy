import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617", // fond plus sombre type nuit
        foreground: "#e5f0ff",
        primary: {
          50: "#e0f2ff",
          100: "#bae6fd",
          500: "#38bdf8", // bleu néon logo
          600: "#0ea5e9"
        },
        neonBlue: "#22d3ee",
        accent: "#facc15",
        muted: "#9ca3af",
        card: "#02091a"
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
