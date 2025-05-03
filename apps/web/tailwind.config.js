/** @type {import('tailwindcss').Config} */
const sharedConfig = require("../../packages/ui/tailwind.config.js");

module.exports = {
  ...sharedConfig,
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
};