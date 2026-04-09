import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f8ff",
          500: "#3461ff",
          700: "#2047d8"
        }
      }
    }
  },
  plugins: []
};

export default config;
