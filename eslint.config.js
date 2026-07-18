import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  ignores: [
    'README.md',
    'docs/**',
  ],
  pnpm: {
    catalogs: false,
  },
}, {
  // TODO: Remove when Vue 2 support is dropped
  files: ['pnpm-workspace.yaml'],
  rules: {
    'pnpm/yaml-no-duplicate-catalog-item': 'off',
    'pnpm/yaml-no-unused-catalog-item': 'off',
  },
})
