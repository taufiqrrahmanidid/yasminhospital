import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Clear DOM after each test
afterEach(() => {
  cleanup()
})

// Mock fetch for API tests (no-op, just define it)
if (!global.fetch) {
  global.fetch = vi.fn()
}
