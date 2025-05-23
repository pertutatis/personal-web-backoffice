import '@testing-library/jest-dom'
import { vi, expect } from 'vitest'

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

// Mock de fetch
const fetchMock = vi.fn()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })
Object.defineProperty(window, 'fetch', { value: fetchMock })

// Limpiar todos los mocks después de cada test
afterEach(() => {
  vi.clearAllMocks()
  localStorageMock.clear()
})

// Extensiones de matchers personalizados
const customMatchers = {
  toHaveBeenCalledWithToken(received: ReturnType<typeof vi.fn>, token: string) {
    const calls = (received as any).mock.calls
    const hasToken = calls.some((call: any[]) => 
      call[1]?.headers?.Authorization === `Bearer ${token}`
    )

    return {
      pass: hasToken,
      message: () => hasToken
        ? `Expected fetch not to have been called with token ${token}`
        : `Expected fetch to have been called with token ${token}`
    }
  }
}

expect.extend(customMatchers)

// Tipos globales para TypeScript
declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
  }
  interface CustomMatchers {
    toHaveBeenCalledWithToken(token: string): void
  }
}

// Configuración global de timeouts
vi.setConfig({
  testTimeout: 10000
})

// Silenciar warnings de consola en tests
console.warn = vi.fn()
console.error = vi.fn()

export { localStorageMock, fetchMock }
