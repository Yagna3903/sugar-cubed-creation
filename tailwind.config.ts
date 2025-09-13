import type { Config } from "tailwindcss"
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: { pink:"#F6D5E1", brown:"#5C3A21", cream:"#FFF8F2", black:"#18181B" } },
      borderRadius: { xl:"1.25rem", "2xl":"1.75rem" },
      boxShadow: { soft: "0 10px 20px rgba(0,0,0,0.06)" },
    },
  },
  plugins: [],
} satisfies Config
