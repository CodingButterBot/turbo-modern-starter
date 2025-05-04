module.exports = {
  root: true,
  extends: ["@repo/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    // Disable no-unresolved for the path aliases that ESLint can't resolve but Next.js can
    "import/no-unresolved": "off"
  },
};