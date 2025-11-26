import type { Config } from "tailwindcss"

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: "#fce7ef",
          "pink-dark": "#f9d5e3",
          brown: "#6b4226",
          "brown-hover": "#5a3720",
          "brown-light": "#8b5a3c",
          cream: "#fff8f2",
          "cream-dark": "#fef5ed",
          black: "#18181B",
        },
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(107, 66, 38, 0.08)",
        medium: "0 8px 30px rgba(107, 66, 38, 0.12)",
        strong: "0 12px 40px rgba(107, 66, 38, 0.16)",
      },
      animation: {
        "fade-in": "fadeIn 0.35s ease-out",
        "slide-up": "slideUp 0.35s ease-out",
        "scale-in": "scaleIn 0.25s ease-out",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config
