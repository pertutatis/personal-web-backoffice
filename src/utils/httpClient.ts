import { useNotifications } from '@/composables/useNotifications'
import { useAuth } from '@/composables/api/useAuth'
import type { AuthTokens } from '@/types/auth'
import {
  httpConfig,
  defaultHeaders,
  errorMessages,
  tokenConfig,
  publicPaths,
  retryConfig,
  authEndpoints
} from '@/config/http'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>
  timeout?: number
  retry?: boolean
}

interface HttpClient {
  get<T>(url: string, options?: RequestOptions): Promise<T>
  post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T>
  put<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T>
  patch<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T>
  delete<T>(url: string, options?: RequestOptions): Promise<T>
  public<T>(url: string, options?: RequestOptions): Promise<T>
}

class HttpClientImpl implements HttpClient {
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = 'Error desconocido'
    try {
      const data = await response.json()
      errorMessage = data.message || errorMessage
    } catch {
      errorMessage = response.statusText || errorMessage
    }

    const error = new Error(errorMessage)
    error.name = 'HttpError'
    ;(error as any).status = response.status
    throw error
  }

  private addQueryParams(url: string, params?: Record<string, string | number>): string {
    if (!params) return url

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })

    const queryString = searchParams.toString()
    return queryString ? `${url}?${queryString}` : url
  }

  private async refreshTokens(): Promise<boolean> {
    try {
      const { getStoredTokens, encryptTokens } = useAuth()
      const tokens = getStoredTokens()
      if (!tokens?.refreshToken) return false

      const response = await this.public<AuthTokens>('/backoffice/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.refreshToken}`
        }
      })

      localStorage.setItem('auth_tokens', encryptTokens(response))
      return true
    } catch {
      return false
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async retryRequest<T>(
    request: () => Promise<T>,
    retries: number = retryConfig.maxRetries
  ): Promise<T> {
    try {
      return await request()
    } catch (error) {
      if (retries === 0 || !error || typeof error !== 'object' || !('status' in error)) {
        throw error
      }

      const status = (error as any).status
      if (!retryConfig.retryStatusCodes.includes(status)) {
        throw error
      }

      await this.sleep(retryConfig.retryDelay)
      return this.retryRequest(request, retries - 1)
    }
  }

  private async makeRequest<T>(
    url: string,
    options: RequestOptions = {},
    isPublic = false
  ): Promise<T> {
    const { params, timeout = httpConfig.timeout, retry = true, ...fetchOptions } = options

    // Agregar prefijo base y parámetros de consulta
    const fullUrl = this.addQueryParams(`${httpConfig.baseUrl}${url}`, params)

    // Configurar headers
    fetchOptions.headers = {
      ...defaultHeaders,
      ...fetchOptions.headers
    }

    // Agregar token de autenticación si no es una petición pública
    if (!isPublic) {
      const { getStoredTokens } = useAuth()
      const tokens = getStoredTokens()
      if (tokens?.token) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          [tokenConfig.headerName]: `${tokenConfig.tokenPrefix} ${tokens.token}`
        }
      }
    }

    const makeRequestWithTimeout = async (): Promise<T> => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      fetchOptions.signal = controller.signal

      try {
        let response = await fetch(fullUrl, fetchOptions)
        clearTimeout(timeoutId)

        // Si el token expiró, intentar renovarlo
        if (response.status === 401 && !isPublic && url !== authEndpoints.refreshToken) {
          const refreshed = await this.refreshTokens()
          if (refreshed) {
            // Actualizar token en headers y reintentar
            const { getStoredTokens } = useAuth()
            const tokens = getStoredTokens()
            if (tokens?.token) {
              fetchOptions.headers = {
                ...fetchOptions.headers,
                'Authorization': `Bearer ${tokens.token}`
              }
              response = await fetch(fullUrl, fetchOptions)
            }
          } else {
            // Si no se pudo renovar, limpiar tokens y redirigir a login
            localStorage.removeItem(tokenConfig.storageKey)
            window.location.href = '/login'
            throw new Error('Sesión expirada')
          }
        }

        // Manejar respuesta
        if (!response.ok) {
          await this.handleErrorResponse(response)
        }

        // Si es una respuesta vacía (204 No Content)
        if (response.status === 204) {
          return {} as T
        }

        return response.json()
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error('La petición ha excedido el tiempo límite')
          }
          const errorMessage = error.message || 'Error desconocido en la petición'
          const { error: showError } = useNotifications()
          showError(errorMessage)
          throw error
        }
        throw new Error('Error desconocido en la petición')
      }
    }

    return retry ? this.retryRequest(makeRequestWithTimeout) : makeRequestWithTimeout()
  }

  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'GET'
    })
  }

  async post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async patch<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'DELETE'
    })
  }

  async public<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(url, options, true)
  }
}

// Instancia única del cliente HTTP
export const httpClient = new HttpClientImpl()
