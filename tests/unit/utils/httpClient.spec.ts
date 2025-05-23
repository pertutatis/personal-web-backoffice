import { describe, expect, it, beforeEach, vi } from 'vitest'
import type { Mock } from 'vitest'
import { httpClient } from '@/utils/httpClient'
import { useAuth } from '@/composables/api/useAuth'
import type { AuthTokens } from '@/types/auth'

// Mock de useAuth
vi.mock('@/composables/api/useAuth', () => ({
  useAuth: () => ({
    encryptTokens: (tokens: AuthTokens) => btoa(JSON.stringify(tokens)),
    decryptTokens: (encrypted: string) => {
      try { return JSON.parse(atob(encrypted)) }
      catch { return null }
    },
    getStoredTokens: vi.fn()
  })
}))

// Mock de notifications
vi.mock('@/composables/useNotifications', () => ({
  notifications: {
    error: vi.fn()
  }
}))

// Helper para crear respuestas mock
const createMockResponse = (data: any, status = 200): Promise<Response> => {
  return Promise.resolve(new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  }))
}

describe('httpClient', () => {
  let fetchMock: Mock

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    // Mock de fetch global
    fetchMock = vi.fn()
    global.fetch = fetchMock
  })

  describe('requests básicos', () => {
    it('debería hacer una petición GET exitosa', async () => {
      const mockData = { id: 1, name: 'Test' }
      fetchMock.mockImplementationOnce(() => createMockResponse(mockData))

      const result = await httpClient.get('/test')
      
      expect(result).toEqual(mockData)
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({ method: 'GET' })
      )
    })

    it('debería hacer una petición POST exitosa', async () => {
      const mockData = { id: 1 }
      const postData = { name: 'Test' }
      fetchMock.mockImplementationOnce(() => createMockResponse(mockData))

      const result = await httpClient.post('/test', postData)
      
      expect(result).toEqual(mockData)
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData)
        })
      )
    })
  })

  describe('manejo de autenticación', () => {
    it('debería incluir token en headers si está autenticado', async () => {
      const tokens = {
        token: 'test-token',
        refreshToken: 'test-refresh'
      }

      vi.mocked(useAuth().getStoredTokens).mockReturnValue(tokens)
      fetchMock.mockImplementationOnce(() => createMockResponse({}))

      await httpClient.get('/test')
      
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${tokens.token}`
          })
        })
      )
    })

    it('no debería incluir token en peticiones públicas', async () => {
      const tokens = {
        token: 'test-token',
        refreshToken: 'test-refresh'
      }

      vi.mocked(useAuth().getStoredTokens).mockReturnValue(tokens)
      fetchMock.mockImplementationOnce(() => createMockResponse({}))

      await httpClient.public('/test')
      
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/test',
        expect.not.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.any(String)
          })
        })
      )
    })
  })

  describe('renovación de token', () => {
    it('debería renovar token y reintentar petición cuando el token expire', async () => {
      const oldTokens = {
        token: 'old-token',
        refreshToken: 'old-refresh'
      }

      const newTokens = {
        token: 'new-token',
        refreshToken: 'new-refresh'
      }

      fetchMock
        .mockImplementationOnce(() => createMockResponse({ message: 'Token expired' }, 401))
        .mockImplementationOnce(() => createMockResponse(newTokens))
        .mockImplementationOnce(() => createMockResponse({ data: 'success' }))

      vi.mocked(useAuth().getStoredTokens)
        .mockReturnValueOnce(oldTokens)  // Primera llamada
        .mockReturnValueOnce(oldTokens)  // Refresh token
        .mockReturnValueOnce(newTokens)  // Reintento

      const result = await httpClient.get('/test')

      expect(result).toEqual({ data: 'success' })
      expect(fetchMock).toHaveBeenCalledTimes(3)
      
      expect(fetchMock).toHaveBeenCalledTimes(3)

      const lastCall = fetchMock.mock.calls[2]
      expect(lastCall).toBeDefined()
      expect(lastCall[1]).toMatchObject({
        headers: expect.objectContaining({
          'Authorization': `Bearer ${newTokens.token}`
        })
      })
    })

    it('debería redirigir a login cuando falla la renovación del token', async () => {
      const tokens = {
        token: 'expired-token',
        refreshToken: 'expired-refresh'
      }

      // Mock window.location
      const locationMock = { href: '' }
      Object.defineProperty(window, 'location', {
        value: locationMock,
        writable: true
      })

      fetchMock
        .mockImplementationOnce(() => createMockResponse({ message: 'Token expired' }, 401))
        .mockImplementationOnce(() => createMockResponse({ message: 'Invalid refresh token' }, 401))

      vi.mocked(useAuth().getStoredTokens).mockReturnValue(tokens)

      await expect(httpClient.get('/test'))
        .rejects.toThrow('Sesión expirada')

      expect(window.location.href).toBe('/login')
      expect(localStorage.getItem('auth_tokens')).toBeNull()
    })
  })

  describe('manejo de errores', () => {
    it('debería manejar timeout', async () => {
      const mockAbortError = new Error('AbortError')
      mockAbortError.name = 'AbortError'

      fetchMock.mockRejectedValueOnce(mockAbortError)

      await expect(httpClient.get('/test', { timeout: 5000 }))
        .rejects.toThrow('La petición ha excedido el tiempo límite')
    })

    it('debería manejar errores de red', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))

      await expect(httpClient.get('/test'))
        .rejects.toThrow('Network error')
    })

    it('debería manejar errores del servidor', async () => {
      const errorMessage = 'Error interno del servidor'
      fetchMock.mockImplementationOnce(() => 
        createMockResponse({ message: errorMessage }, 500)
      )

      await expect(httpClient.get('/test'))
        .rejects.toThrow(errorMessage)
    })
  })
})
