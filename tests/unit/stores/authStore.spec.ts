import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import type { AuthTokens, User } from '@/types/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    // Crear una nueva instancia de Pinia para cada test
    setActivePinia(createPinia())

    // Mock de localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    }
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  })

  describe('initial state', () => {
    it('debería tener el estado inicial correcto', () => {
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(false)
      expect(store.tokens).toBeNull()
      expect(store.user).toBeNull()
    })
  })

  describe('getters', () => {
    it('currentToken debería retornar null cuando no hay tokens', () => {
      const store = useAuthStore()
      expect(store.currentToken).toBeNull()
    })

    it('currentToken debería retornar el token cuando existe', () => {
      const store = useAuthStore()
      const tokens: AuthTokens = {
        token: 'test-token',
        refreshToken: 'test-refresh'
      }
      const user: User = {
        email: 'test@example.com'
      }
      store.setAuthData(tokens, user)
      expect(store.currentToken).toBe('test-token')
    })

    it('hasAuth debería ser true cuando hay autenticación', () => {
      const store = useAuthStore()
      const tokens: AuthTokens = {
        token: 'test-token',
        refreshToken: 'test-refresh'
      }
      const user: User = {
        email: 'test@example.com'
      }
      store.setAuthData(tokens, user)
      expect(store.hasAuth).toBe(true)
    })

    it('userEmail debería retornar el email del usuario', () => {
      const store = useAuthStore()
      const tokens: AuthTokens = {
        token: 'test-token',
        refreshToken: 'test-refresh'
      }
      const user: User = {
        email: 'test@example.com'
      }
      store.setAuthData(tokens, user)
      expect(store.userEmail).toBe('test@example.com')
    })
  })

  describe('actions', () => {
    it('setAuthData debería actualizar el estado y localStorage', () => {
      const store = useAuthStore()
      const tokens: AuthTokens = {
        token: 'test-token',
        refreshToken: 'test-refresh'
      }
      const user: User = {
        email: 'test@example.com'
      }

      store.setAuthData(tokens, user)

      expect(store.isAuthenticated).toBe(true)
      expect(store.tokens).toEqual(tokens)
      expect(store.user).toEqual(user)
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'auth_data',
        JSON.stringify({ tokens, user })
      )
    })

    it('clearAuth debería limpiar el estado y localStorage', () => {
      const store = useAuthStore()
      const tokens: AuthTokens = {
        token: 'test-token',
        refreshToken: 'test-refresh'
      }
      const user: User = {
        email: 'test@example.com'
      }

      store.setAuthData(tokens, user)
      store.clearAuth()

      expect(store.isAuthenticated).toBe(false)
      expect(store.tokens).toBeNull()
      expect(store.user).toBeNull()
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_data')
    })

    it('initialize debería cargar el estado desde localStorage', () => {
      const store = useAuthStore()
      const storedData = {
        tokens: {
          token: 'test-token',
          refreshToken: 'test-refresh'
        },
        user: {
          email: 'test@example.com'
        }
      }

      localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(storedData))

      store.initialize()

      expect(store.isAuthenticated).toBe(true)
      expect(store.tokens).toEqual(storedData.tokens)
      expect(store.user).toEqual(storedData.user)
    })

    it('initialize debería manejar datos inválidos en localStorage', () => {
      const store = useAuthStore()
      localStorage.getItem = vi.fn().mockReturnValue('invalid json')

      store.initialize()

      expect(store.isAuthenticated).toBe(false)
      expect(store.tokens).toBeNull()
      expect(store.user).toBeNull()
    })

    it('updateTokens debería mantener la información del usuario', () => {
      const store = useAuthStore()
      const initialTokens: AuthTokens = {
        token: 'old-token',
        refreshToken: 'old-refresh'
      }
      const user: User = {
        email: 'test@example.com'
      }
      store.setAuthData(initialTokens, user)

      const newTokens: AuthTokens = {
        token: 'new-token',
        refreshToken: 'new-refresh'
      }
      store.updateTokens(newTokens)

      expect(store.tokens).toEqual(newTokens)
      expect(store.user).toEqual(user)
      expect(store.isAuthenticated).toBe(true)
    })
  })
})
