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
        canvas: "#0D0B12",
        surface: "#16131C",
        "surface-elevated": "#211D2A",
        parchment: "#F4EFE6",
        "parchment-border": "#D8CFBC",
        ink: "#181512",
        crimson: "#9E2A2B",
        gold: "#E5B869",
        "text-primary": "#FFFFFF",
        "text-secondary": "#C5CBD3",
        "border-dark": "#2E2838",
        "olive-wood": "#5A5265",
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
