import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: "#3A7BFF",
          hover: "#2A6BEF",
        },
        success: {
          DEFAULT: "#28CC8B",
          hover: "#20B878",
        },
        warning: {
          DEFAULT: "#FFB74D",
          hover: "#FFA726",
        },
        error: {
          DEFAULT: "#FF5A5A",
          hover: "#FF4444",
        },
        info: {
          DEFAULT: "#67C8FF",
          hover: "#5AB8EF",
        },
        // Gray System
        gray: {
          100: "#F6F7F9",
          200: "#ECEEF2",
          300: "#D9DEE7",
          400: "#AEB4BD",
          500: "#636B78",
          600: "#4D545E",
          700: "#2B313A",
          800: "#1A1F27",
          900: "#0C0F14",
        },
        // Dark Mode Backgrounds
        dark: {
          bg: "#0C0F14",
          card: "#14181F",
          hover: "#1A1F27",
          border: "#1F242C",
          text: "#F3F5F7",
          "text-secondary": "#9FA7B3",
          "text-disabled": "#4D545E",
        },
        // Light Mode Backgrounds
        light: {
          bg: "#FFFFFF",
          card: "#F6F7F9",
          hover: "#ECEEF2",
          border: "#D9DEE7",
          text: "#1B1E24",
          "text-secondary": "#636B78",
          "text-disabled": "#AEB4BD",
        },
        // Macro Colors
        macro: {
          protein: "#3A7BFF",
          carbs: "#67C8FF",
          fat: "#FFB74D",
          calories: "#28CC8B",
        },
      },
      borderRadius: {
        card: "16px",
        "card-lg": "20px",
        sheet: "28px",
        "sheet-lg": "32px",
      },
      boxShadow: {
        card: "0px 1px 8px rgba(0,0,0,0.08)",
        "card-dark": "0px 2px 14px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
