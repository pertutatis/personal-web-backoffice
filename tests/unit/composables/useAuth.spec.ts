import { describe, expect, it, beforeEach, vi } from 'vitest'
import { useAuth } from '@/composables/api/useAuth'

describe('useAuth', () => {
  beforeEach(() => {
    // Limpiar localStorage
    localStorage.clear()
    // Resetear mocks
    vi.clearAllMocks()
  })

  describe('encryptTokens/decryptTokens', () => {
    it('debería encriptar y desencriptar tokens correctamente', () => {
      const { encryptTokens, decryptTokens } = useAuth()
      const tokens = {
        token: 'test-token',
        refreshToken: 'test-refresh'
      }

      const encrypted = encryptTokens(tokens)
      expect(encrypted).toBeTruthy()

      const decrypted = decryptTokens(encrypted)
      expect(decrypted).toEqual(tokens)
    })

    it('debería manejar errores de desencriptación', () => {
      const { decryptTokens } = useAuth()
      const result = decryptTokens('invalid-data')
      expect(result).toBeNull()
    })
  })

  describe('getStoredTokens', () => {
    it('debería retornar null si no hay tokens almacenados', () => {
      const { getStoredTokens } = useAuth()
      expect(getStoredTokens()).toBeNull()
    })

    it('debería retornar tokens almacenados', () => {
      const { encryptTokens, getStoredTokens } = useAuth()
      const tokens = {
        token: 'test-token',
        refreshToken: 'test-refresh'
      }

      localStorage.setItem('auth_tokens', encryptTokens(tokens))
      expect(getStoredTokens()).toEqual(tokens)
    })
  })

  describe('isAuthenticated', () => {
    it('debería retornar false si no hay tokens', () => {
      const { isAuthenticated } = useAuth()
      expect(isAuthenticated()).toBe(false)
    })

    it('debería retornar true si hay un token válido', () => {
      const { encryptTokens, isAuthenticated } = useAuth()
      const tokens = {
        token: 'test-token',
        refreshToken: 'test-refresh'
      }

      localStorage.setItem('auth_tokens', encryptTokens(tokens))
      expect(isAuthenticated()).toBe(true)
    })
  })

  describe('login', () => {
    it('debería almacenar tokens al hacer login exitoso', async () => {
      const { login, getStoredTokens } = useAuth()
      const mockResponse = {
        data: {
          token: 'test-token',
          refreshToken: 'test-refresh'
        }
      }

      // Mock de fetch
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      await login('test@example.com', 'password123')
      
      const storedTokens = getStoredTokens()
      expect(storedTokens).toEqual(mockResponse.data)
    })

    it('debería manejar errores de login', async () => {
      const { login, error } = useAuth()
      const errorMessage = 'Credenciales inválidas'

      // Mock de fetch con error
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage })
      })

      await expect(login('test@example.com', 'wrong-pass'))
        .rejects.toThrow(errorMessage)
      
      expect(error).toBe(errorMessage)
    })
  })

  describe('register', () => {
    it('debería almacenar tokens al registrarse exitosamente', async () => {
      const { register, getStoredTokens } = useAuth()
      const mockResponse = {
        data: {
          token: 'test-token',
          refreshToken: 'test-refresh'
        }
      }

      // Mock de fetch
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      await register('test@example.com', 'password123')
      
      const storedTokens = getStoredTokens()
      expect(storedTokens).toEqual(mockResponse.data)
    })

    it('debería manejar errores de registro', async () => {
      const { register, error } = useAuth()
      const errorMessage = 'El email ya está registrado'

      // Mock de fetch con error
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage })
      })

      await expect(register('existing@example.com', 'password123'))
        .rejects.toThrow(errorMessage)
      
      expect(error).toBe(errorMessage)
    })
  })

  describe('logout', () => {
    it('debería eliminar los tokens almacenados', () => {
      const { encryptTokens, logout, getStoredTokens } = useAuth()
      const tokens = {
        token: 'test-token',
        refreshToken: 'test-refresh'
      }

      localStorage.setItem('auth_tokens', encryptTokens(tokens))
      expect(getStoredTokens()).toBeTruthy()

      logout()
      expect(getStoredTokens()).toBeNull()
    })
  })
})
