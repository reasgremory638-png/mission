/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        nature: {
          50: "#f0f7ee",
          100: "#dcefd8",
          200: "#b9dfb1",
          300: "#8bc34a",
          400: "#6aaf3a",
          500: "#4caf50",
          600: "#388e3c",
          700: "#2e7d32",
          800: "#1b5e20",
          900: "#0d3b12",
        },
        sand: {
          50: "#fdf6e3",
          100: "#faf0cc",
          200: "#f5e0a0",
          300: "#d4a76a",
          400: "#c8964f",
          500: "#b07c38",
          600: "#8d6030",
        },
        warm: {
          400: "#a1887f",
          500: "#8d6e63",
          600: "#795548",
          700: "#5d4037",
          800: "#4e342e",
        },
        calm: {
          100: "#e3f2fd",
          200: "#bbdefb",
          300: "#90caf9",
          400: "#64b5f6",
          500: "#42a5f5",
          600: "#1e88e5",
        },
        sky: {
          light: "#e8f4fd",
          mid: "#b3d9f5",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "sans-serif"],
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        sway: "sway 4s ease-in-out infinite",
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
        "slide-in-up": "slide-in-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-soft": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(139, 195, 74, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(139, 195, 74, 0)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "slide-in-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};
