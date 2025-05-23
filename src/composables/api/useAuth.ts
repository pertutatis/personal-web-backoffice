import { ref } from 'vue'
import { httpClient } from '@/utils/httpClient'
import type { AuthTokens, AuthResponse, AuthError } from '@/types/auth'

export interface UseAuth {
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
  encryptTokens: (tokens: AuthTokens) => string
  decryptTokens: (encrypted: string) => AuthTokens | null
  getStoredTokens: () => AuthTokens | null
}

interface ApiResponse<T> {
  data: T
}

// Utilidades de encriptación/desencriptación
const encryptTokens = (tokens: AuthTokens): string => {
  // TODO: Implementar encriptación real
  return btoa(JSON.stringify(tokens))
}

const decryptTokens = (encrypted: string): AuthTokens | null => {
  try {
    return JSON.parse(atob(encrypted))
  } catch {
    return null
  }
}

const getStoredTokens = (): AuthTokens | null => {
  const encrypted = localStorage.getItem('auth_tokens')
  if (!encrypted) return null
  return decryptTokens(encrypted)
}

export const useAuth = (): UseAuth => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const storeTokens = (tokens: AuthTokens) => {
    const encrypted = encryptTokens(tokens)
    localStorage.setItem('auth_tokens', encrypted)
  }

  const login = async (email: string, password: string): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await httpClient.post<ApiResponse<AuthResponse>>('/backoffice/auth/login', {
        email,
        password
      })

      storeTokens(response.data)
    } catch (e: any) {
      error.value = e.message || 'Ha ocurrido un error'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const register = async (email: string, password: string): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await httpClient.post<ApiResponse<AuthResponse>>('/backoffice/auth/register', {
        email,
        password
      })

      storeTokens(response.data)
    } catch (e: any) {
      error.value = e.message || 'Ha ocurrido un error'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const logout = (): void => {
    localStorage.removeItem('auth_tokens')
  }

  const isAuthenticated = (): boolean => {
    const tokens = getStoredTokens()
    return !!tokens?.token
  }

  return {
    isLoading: isLoading.value,
    error: error.value,
    login,
    register,
    logout,
    isAuthenticated,
    encryptTokens,
    decryptTokens,
    getStoredTokens
  }
}
