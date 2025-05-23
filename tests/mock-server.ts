import { createServer, Response } from 'miragejs'
import type { AuthResponse, AuthResponseWithUser } from '@/types/auth'

const TEST_USER = {
  email: 'test@example.com',
  password: 'password123'
}

export function startMockServer() {
  return createServer({
    routes() {
      this.namespace = 'api/backoffice'

      // Auth endpoints
      this.post('/auth/login', (schema, request) => {
        const credentials = JSON.parse(request.requestBody)

        if (credentials.email === TEST_USER.email && credentials.password === TEST_USER.password) {
          const response: AuthResponseWithUser = {
            token: 'fake-auth-token',
            refreshToken: 'fake-refresh-token',
            user: {
              email: TEST_USER.email
            }
          }
          return response
        }

        return new Response(
          401,
          { 'Content-Type': 'application/json' },
          { message: 'Credenciales inválidas', type: 'INVALID_CREDENTIALS' }
        )
      })

      this.post('/auth/register', (schema, request) => {
        const userData = JSON.parse(request.requestBody)

        if (userData.email === TEST_USER.email) {
          return new Response(
            409,
            { 'Content-Type': 'application/json' },
            { message: 'El email ya está registrado', type: 'EMAIL_IN_USE' }
          )
        }

        const response: AuthResponseWithUser = {
          token: 'fake-auth-token',
          refreshToken: 'fake-refresh-token',
          user: {
            email: userData.email
          }
        }
        return response
      })

      this.post('/auth/refresh-token', (schema, request) => {
        const authHeader = request.requestHeaders.Authorization

        if (!authHeader || !authHeader.includes('fake-refresh-token')) {
          return new Response(
            401,
            { 'Content-Type': 'application/json' },
            { message: 'Token inválido', type: 'INVALID_TOKEN' }
          )
        }

        const response: AuthResponse = {
          token: 'new-fake-auth-token',
          refreshToken: 'new-fake-refresh-token'
        }
        return response
      })

      // Stats endpoint
      this.get('/stats', () => {
        return {
          articles: 5,
          books: 3
        }
      })

      // Fallback para rutas no definidas
      this.passthrough()
    }
  })
}
