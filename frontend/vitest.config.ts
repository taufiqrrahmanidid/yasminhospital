import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/__tests__/**',
        'dist/'
      ],
      thresholds: {
        branches: 40,
        functions: 40,
        lines: 40,
        statements: 40
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})