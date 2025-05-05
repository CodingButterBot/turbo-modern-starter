/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./options.html",
    "./sidepanel.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class', // This enables the 'dark' variant with class strategy
  theme: {
    extend: {},
  },
  plugins: [],
}