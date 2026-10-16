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
        crimson: "#8B2222",
        gold: "#C5A059",
        "text-primary": "#F5F5F7",
        "text-secondary": "#9AA0A6",
        "border-dark": "#24282D",
        gryffindor: "#740001",
        slytherin: "#1A472A",
        ravenclaw: "#0E1A40",
        hufflepuff: "#D49B24",
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
