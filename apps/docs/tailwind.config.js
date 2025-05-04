const sharedConfig = require('tailwindcss/defaultTheme');
const { createPreset } = require('fumadocs-ui/tailwind-plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/fumadocs-ui/dist/**/*.js'
  ],
  presets: [createPreset()],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...sharedConfig.fontFamily.sans],
      },
    },
  },
};