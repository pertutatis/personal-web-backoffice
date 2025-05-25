import { defineStore } from 'pinia'
import type { PiniaPluginContext } from 'pinia'
import type { AuthTokens } from '@/types/auth'
import { useAuth } from '@/composables/api/useAuth'
import type { Router } from 'vue-router'

interface AuthState {
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  userEmail: string | null
}

// Store de autenticación
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    loading: false,
    error: null,
    userEmail: null
  }),

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      
      try {
        const { login } = useAuth()
        await login(email, password)
        const { getStoredTokens } = useAuth()
        const tokens = getStoredTokens()
        this.isAuthenticated = true
        this.userEmail = tokens?.email || null
      } catch (e: any) {
        this.error = e.message
        throw e
      } finally {
        this.loading = false
      }
    },

    async register(email: string, password: string) {
      this.loading = true
      this.error = null
      
      try {
        const { register } = useAuth()
        await register(email, password)
        const { getStoredTokens } = useAuth()
        const tokens = getStoredTokens()
        this.isAuthenticated = true
        this.userEmail = tokens?.email || null
      } catch (e: any) {
        this.error = e.message
        throw e
      } finally {
        this.loading = false
      }
    },

    logout() {
      const { logout } = useAuth()
      logout()
      this.isAuthenticated = false
      this.error = null
      this.userEmail = null
    }
  },

  getters: {
    currentUserEmail: (state): string => {
      return state.userEmail || 'Usuario'
    }
  }
})

// Plugin para sincronizar el estado con localStorage
export function createAuthPlugin() {
  return ({ store }: PiniaPluginContext) => {
    if (store.$id === 'auth') {
      // Restaurar estado de autenticación al iniciar
      const { getStoredTokens } = useAuth()
      const tokens = getStoredTokens()
      if (tokens?.token) {
        store.$state.isAuthenticated = true
        store.$state.userEmail = tokens.email
      }

      // Suscribirse a cambios en el estado
      store.$subscribe((_mutation: unknown, state: AuthState) => {
        // Si cambia isAuthenticated y es false, limpiar tokens
        if (!state.isAuthenticated) {
          localStorage.removeItem('auth_tokens')
        }
      })
    }
  }
}
