import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#8B2635",
        secondary: "#D4A373",
      },
      borderRadius: {
        '4xl': '2.5rem',
        '5xl': '3.5rem',
      }
    },
  },
  plugins: [],
};
export default config;
