module.exports = {
  extends: ["@repo/eslint-config/library"],
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/triple-slash-reference": "off",
    "import/order": "off",
    "tailwindcss/enforces-shorthand": "off",
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/classnames-order": "off"
  }
};