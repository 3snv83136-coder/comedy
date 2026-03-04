import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617", // bleu nuit très sombre
        foreground: "#e5f0ff", // texte légèrement bleuté
        primary: {
          50: "#e0f2ff",
          100: "#b3e0ff",
          500: "#33b3ff", // bleu néon proche du logo
          600: "#0090ff"
        },
        neonBlue: "#00b8ff",
        accent: "#38bdf8", // bleu clair complémentaire
        muted: "#64748b",
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
