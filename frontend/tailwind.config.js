/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ FIXED HERE
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
