const sharedConfig = require("../../packages/ui/tailwind.config.js");

module.exports = {
  ...sharedConfig,
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ]
};