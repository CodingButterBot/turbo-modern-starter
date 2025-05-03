const sharedConfig = require("../../packages/ui/tailwind.config.js");

module.exports = {
  ...sharedConfig,
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./content/docs/**/*.{md,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../node_modules/fumadocs-ui/dist/**/*.js"
  ]
};