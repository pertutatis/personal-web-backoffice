// Tokens de autenticación
export interface AuthTokens {
  token: string
  refreshToken: string  // Aunque es técnicamente obligatorio en la interfaz, en realidad podríamos usar token
  email: string
}

// Respuesta de la API de autenticación
export interface AuthResponse {
  token: string
  refreshToken?: string  // Opcional porque algunos backends no lo incluyen
  email?: string         // Opcional porque algunos backends no lo incluyen
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
