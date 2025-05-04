module.exports = {
  extends: ['@repo/eslint-config/next'],
  rules: {
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/order': 'off',
    'mdx/no-unescaped-entities': 'off'
  },
  ignorePatterns: ['content/**/*.mdx']
};