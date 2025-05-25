interface ApiConfig {
  baseUrl: string
  timeout: number
}

export const httpConfig: ApiConfig = {
  baseUrl: 'http://localhost:3000/api',
  timeout: 5000
}

// Headers por defecto para las peticiones
export const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

// Códigos de error comunes y sus mensajes
export const errorMessages: Record<number, string> = {
  400: 'Solicitud inválida',
  401: 'No autorizado',
  403: 'Acceso prohibido',
  404: 'No encontrado',
  409: 'Conflicto - El recurso ya existe',
  500: 'Error interno del servidor',
  502: 'Error de gateway',
  503: 'Servicio no disponible'
}

// Endpoints de autenticación
export const authEndpoints = {
  login: '/backoffice/auth/login',
  register: '/backoffice/auth/register',
  refreshToken: '/backoffice/auth/refresh-token'
}

// Configuración de tokens
export const tokenConfig = {
  storageKey: 'auth_tokens',
  headerName: 'Authorization',
  tokenPrefix: 'Bearer',
  refreshThreshold: 5 * 60 * 1000 // 5 minutos en milisegundos
}

// Rutas públicas que no requieren autenticación
export const publicPaths = [
  authEndpoints.login,
  authEndpoints.register
]

// Configuración de reintentos
export const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000, // 1 segundo
  retryStatusCodes: [408, 500, 502, 503, 504]
}
