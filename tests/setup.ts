import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock global
(global as any).fetch = vi.fn()
;(global as any).ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Configuración Vue Test Utils
config.global.mocks = {
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn()
  },
  $route: {
    params: {},
    query: {},
    name: 'test'
  }
}

// Configuración Vue
// Esto permite que los componentes no exporten por defecto
config.global.components = {}

// Limpiar todos los mocks después de cada test
beforeEach(() => {
  vi.clearAllMocks()
})

// Mock console en tests
console.warn = vi.fn()
console.error = vi.fn()

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  writable: true
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})
