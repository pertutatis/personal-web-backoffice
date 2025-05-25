// Tokens de autenticación
export interface AuthTokens {
  token: string
  refreshToken: string
  email: string
}

// Respuesta de la API de autenticación
export interface AuthResponse {
  token: string
  refreshToken: string
  email: string
}

// Error de autenticación
export interface AuthError {
  type: string
  message: string
}

// Credenciales de login
export interface LoginCredentials {
  email: string
  password: string
}

// Credenciales de registro
export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string
}
