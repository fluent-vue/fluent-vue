module.exports = {
  'extends': [
    '@antfu'
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    'pnpm-lock.yaml',
    '*.js'
  ],
  rules: {
    "vue/component-definition-name-casing": ["error", "kebab-case"]
  }
}
