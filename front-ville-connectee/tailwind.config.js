/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.06)",
      },
      colors: {
        brand: {
          600: "#0B5ED7",
          700: "#0A58CA",
        }
      }
    },
  },
  plugins: [],
}
