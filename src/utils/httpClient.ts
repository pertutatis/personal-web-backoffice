import { useNotifications } from '@/composables/useNotifications'
import { useAuth } from '@/composables/api/useAuth'
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
    // Verificar si estamos configurados para usar renovación de tokens
    if (!tokenConfig.useTokenRefresh) {
      return false
    }

    try {
      const { getStoredTokens, encryptTokens } = useAuth()
      const tokens = getStoredTokens()
      if (!tokens?.refreshToken) {
        return false
      }

      const response = await this.public<any>(authEndpoints.refreshToken, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.refreshToken}`
        }
      })
      
      // Verificar si la respuesta contiene token directamente o dentro de data
      const responseData = response.data ? response.data : response;
      
      // Analizar la estructura para identificar los tokens
      const tokenValue = responseData.token || responseData.access_token;
      
      // Si no hay token, no podemos continuar
      if (!tokenValue) {
        return false
      }
      
      // Si el backend no proporciona refreshToken, usamos el mismo token para ambos casos
      const refreshTokenValue = responseData.refreshToken || responseData.refresh_token || tokenValue;

      // Construir el nuevo objeto de tokens
      const newTokens = {
        token: tokenValue,
        refreshToken: refreshTokenValue,
        email: tokens.email || responseData.email || ''
      }
      
      const encrypted = encryptTokens(newTokens)
      localStorage.setItem(tokenConfig.storageKey, encrypted)
      return true
    } catch (error: any) {
   
      // Detectar específicamente si el endpoint no existe (404)
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        // Desactivar la renovación de tokens para futuras solicitudes
        // @ts-ignore - Modificamos una propiedad readonly solo en tiempo de ejecución
        tokenConfig.useTokenRefresh = false
        
        const { warning } = useNotifications()
        warning('Su sesión ha expirado. Por favor, vuelva a iniciar sesión.')
      }
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

    // Verificar si la URL es para autenticación (login, register)
    const isAuthOperation = url === authEndpoints.login || url === authEndpoints.register || url === authEndpoints.refreshToken
    
    // Agregar token de autenticación si no es una petición pública y no es login/register
    if (!isPublic && !isAuthOperation) {
      const { getStoredTokens } = useAuth()
      const tokens = getStoredTokens()
      
      if (tokens?.token) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Authorization': `Bearer ${tokens.token}`
        }
      }
    }

    const makeRequestWithTimeout = async (): Promise<T> => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      fetchOptions.signal = controller.signal

      try {
        // Realizar la petición
        let response = await fetch(fullUrl, fetchOptions)
        clearTimeout(timeoutId)

        // Si el token expiró y no estamos en una operación de autenticación, intentar renovarlo
        const isAuthOperation = url === authEndpoints.login || url === authEndpoints.register || url === authEndpoints.refreshToken
        
        if (response.status === 401 && !isPublic && !isAuthOperation) {
        
          // Solo intentar renovar si la característica está habilitada
          if (tokenConfig.useTokenRefresh) {
            const refreshed = await this.refreshTokens()
            
            if (refreshed) {
              // Actualizar token en headers y reintentar
              const { getStoredTokens } = useAuth()
              const tokens = getStoredTokens()
              
              if (tokens?.token) {
                // Crear nueva petición con el token actualizado
                fetchOptions.headers = {
                  ...fetchOptions.headers,
                  'Authorization': `Bearer ${tokens.token}`
                }
                
                try {
                  response = await fetch(fullUrl, fetchOptions)
                } catch (retryError) {
                  throw retryError
                }
              }
            } else {
              // Si no se pudo renovar, limpiar tokens y redirigir a login
              localStorage.removeItem(tokenConfig.storageKey)
              
              
              try {
                const { error: showError } = useNotifications()
                showError('Su sesión ha expirado. Por favor, inicie sesión nuevamente.')
              } catch (notificationError) {
                console.warn('[httpClient] Error al mostrar notificación de sesión expirada', notificationError)
              }
              
              // Dar tiempo al usuario para ver la notificación antes de redirigir
              setTimeout(() => {
                window.location.href = '/login'
              }, 1500)
              
              throw new Error('Sesión expirada')
            }
          } else {
            // La renovación de tokens está desactivada, ir directamente a login
            console.warn('[httpClient] Renovación de tokens desactivada, redirigiendo a login')
            localStorage.removeItem(tokenConfig.storageKey)
            
            try {
              const { error: showError } = useNotifications()
              showError('Su sesión ha expirado. Por favor, inicie sesión nuevamente.')
            } catch (notificationError) {
              console.warn('[httpClient] Error al mostrar notificación de sesión expirada', notificationError)
            }
            
            // Dar tiempo al usuario para ver la notificación antes de redirigir
            setTimeout(() => {
              window.location.href = '/login'
            }, 1500)
            
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
        
        // Obtener y procesar la respuesta JSON
        const jsonData = await response.json()
        
        return jsonData
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error('La petición ha excedido el tiempo límite')
          }
          
          // En caso de error 401 ya manejado por el flujo de renovación de token,
          // no mostrar notificación adicional
          if (error.message === 'Sesión expirada') {
            throw error
          }
          
          const errorMessage = error.message || 'Error desconocido en la petición'
          console.error(`[httpClient] Error en petición a ${url}:`, errorMessage)
          
          try {
            const { error: showError } = useNotifications()
            showError(errorMessage)
          } catch (notificationError) {
            // Si hay un error al mostrar la notificación, solo lo registramos
            console.warn('Error al mostrar notificación:', notificationError)
          }
          
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

/**
 * Función para desactivar la renovación de tokens
 * Útil cuando el backend no tiene el endpoint necesario para refrescar tokens
 */
export const disableTokenRefresh = () => {
  if (tokenConfig.useTokenRefresh) {
    // @ts-ignore - Modificamos la propiedad readonly en tiempo de ejecución
    tokenConfig.useTokenRefresh = false;
    return true;
  }
  return false;
}

/**
 * Función para activar la renovación de tokens
 */
export const enableTokenRefresh = () => {
  if (!tokenConfig.useTokenRefresh) {
    // @ts-ignore - Modificamos la propiedad readonly en tiempo de ejecución
    tokenConfig.useTokenRefresh = true;
    return true;
  }
  return false;
}

// Exponer funciones de configuración en el objeto window
if (typeof window !== 'undefined') {
  const w = window as any;
  w.httpClientConfig = {
    disableTokenRefresh,
    enableTokenRefresh,
    getConfig: () => ({
      baseUrl: httpConfig.baseUrl,
      useTokenRefresh: tokenConfig.useTokenRefresh,
      loginEndpoint: authEndpoints.login,
      refreshEndpoint: authEndpoints.refreshToken,
    })
  };
}
