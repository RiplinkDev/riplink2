import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#29B1FF",
          violet: "#6D58FF",
          coral: "#FF6A7A",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
