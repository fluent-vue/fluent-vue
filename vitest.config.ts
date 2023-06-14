import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
      '__tests__/**/*.spec.ts',
    ],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcovonly'],
    },
    environment: 'happy-dom',
  },
})
