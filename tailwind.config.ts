import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0A0B0D",
        surface: "#131518",
        "surface-elevated": "#1C2026",
        parchment: "#ECE6DC",
        "parchment-border": "#D5CEBF",
        ink: "#1A1A1A",
        crimson: "#9E2A2B",
        gold: "#E5B869",
        "text-primary": "#FFFFFF",
        "text-secondary": "#C5CBD3",
        "border-dark": "#2A2F36",
        gryffindor: "#8B0000",
        slytherin: "#1E5631",
        ravenclaw: "#1B2A56",
        hufflepuff: "#E0A628",
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "2px",
        lg: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
