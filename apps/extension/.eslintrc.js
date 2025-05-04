module.exports = {
  root: true,
  extends: ["@repo/eslint-config/next"],
  settings: {
    react: {
      version: "18.2.0"
    },
    "next": {
      "rootDir": "/dev/null" // Disable Next.js specific rules
    }
  },
  env: {
    browser: true
  },
  rules: {
    "tailwindcss/classnames-order": "warn",
    "no-undef": "off",
    "@next/next/no-html-link-for-pages": "off"
  }
};