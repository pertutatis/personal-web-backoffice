# OBR 003: Reglas de Negocio para Autenticación

## Resumen
Este documento define las reglas de negocio y casos de uso para la autenticación de usuarios en el backoffice.

## Casos de Uso

### 1. Login de Usuario

#### Flujo Principal
1. Usuario accede a la página de login
2. Ingresa email y contraseña
3. Sistema valida credenciales contra API
4. Sistema genera y almacena tokens
5. Usuario es redirigido al dashboard

#### Reglas de Negocio
- El email debe ser un email válido
- La contraseña debe tener al menos 8 caracteres
- Los tokens deben almacenarse de forma segura
- El access token debe incluirse en todas las peticiones posteriores

#### Casos de Error
- Credenciales incorrectas
- Email no registrado
- Problemas de conexión con API

### 2. Registro de Usuario

#### Flujo Principal
1. Usuario accede a página de registro
2. Ingresa email y contraseña
3. Sistema valida datos
4. Sistema registra usuario en API
5. Sistema realiza login automático
6. Usuario es redirigido al dashboard

#### Reglas de Negocio
- Email debe ser único en el sistema
- Contraseña debe cumplir requisitos mínimos de seguridad
- No se permiten múltiples cuentas con el mismo email

#### Casos de Error
- Email ya registrado
- Datos inválidos
- Problemas de conexión con API

### 3. Logout de Usuario

#### Flujo Principal
1. Usuario hace click en botón de logout
2. Sistema elimina tokens almacenados
3. Usuario es redirigido a página de login

#### Reglas de Negocio
- Eliminar todos los datos de sesión
- Invalidar tokens en cliente
- Limpiar estado de la aplicación

### 4. Renovación de Token

#### Flujo Principal
1. Sistema detecta token expirado
2. Utiliza refresh token para obtener nuevo access token
3. Actualiza token almacenado
4. Continúa operación original

#### Reglas de Negocio
- Renovar token antes de expiración
- Validar refresh token antes de usar
- Mantener una única sesión activa

#### Casos de Error
- Refresh token expirado
- Refresh token inválido
- Error de renovación

## Escenarios de Prueba

### Tests E2E

1. Login Exitoso
```typescript
it('Debería permitir login con credenciales válidas', () => {
  cy.visit('/login')
  cy.get('[data-test="email"]').type('user@example.com')
  cy.get('[data-test="password"]').type('password123')
  cy.get('[data-test="login-button"]').click()
  
  // Verificar redirección al dashboard
  cy.url().should('include', '/dashboard')
  // Verificar presencia de token
  cy.window().its('localStorage.token').should('exist')
})
```

2. Registro Exitoso
```typescript
it('Debería permitir registro de nuevo usuario', () => {
  cy.visit('/register')
  cy.get('[data-test="email"]').type('newuser@example.com')
  cy.get('[data-test="password"]').type('password123')
  cy.get('[data-test="register-button"]').click()
  
  // Verificar registro exitoso (código 201)
  cy.url().should('include', '/dashboard')
  // Verificar tokens generados
  cy.window().its('localStorage.token').should('exist')
  cy.window().its('localStorage.refreshToken').should('exist')
})
```

3. Logout Exitoso
```typescript
it('Debería permitir cerrar sesión correctamente', () => {
  // Login primero
  cy.login('user@example.com', 'password123')
  
  // Realizar logout
  cy.get('[data-test="logout-button"]').click()
  
  // Verificar redirección a login
  cy.url().should('include', '/login')
  // Verificar eliminación de tokens
  cy.window().its('localStorage.token').should('not.exist')
  cy.window().its('localStorage.refreshToken').should('not.exist')
})
```

4. Manejo de Errores
```typescript
describe('Manejo de errores de autenticación', () => {
  it('Debería mostrar error con credenciales inválidas', () => {
    cy.visit('/login')
    cy.get('[data-test="email"]').type('user@example.com')
    cy.get('[data-test="password"]').type('wrongpass')
    cy.get('[data-test="login-button"]').click()
    
    // Verificar mensaje de error (código 400)
    cy.get('[data-test="error-message"]')
      .should('be.visible')
      .and('contain', 'Credenciales inválidas')
  })

  it('Debería mostrar error cuando el email ya está registrado', () => {
    cy.visit('/register')
    cy.get('[data-test="email"]').type('existing@example.com')
    cy.get('[data-test="password"]').type('password123')
    cy.get('[data-test="register-button"]').click()
    
    // Verificar mensaje de error (código 409)
    cy.get('[data-test="error-message"]')
      .should('be.visible')
      .and('contain', 'El email ya está registrado')
  })
})
```

### Tests de Integración

1. Interceptor HTTP
```typescript
describe('HTTP Client Interceptor', () => {
  it('Debería incluir token en headers', () => {
    const token = 'test-token'
    localStorage.setItem('token', token)
    
    // Verificar que el token se incluye en el header
    cy.request({
      url: '/api/backoffice/articles',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  it('Debería manejar errores de autorización', () => {
    localStorage.setItem('token', 'invalid-token')
    
    cy.request({
      url: '/api/backoffice/articles',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
    })
  })
})
```

2. Renovación de Token
```typescript
describe('Token Refresh', () => {
  it('Debería renovar token automáticamente', () => {
    const expiredToken = 'expired-token'
    const refreshToken = 'valid-refresh-token'
    const newToken = 'new-token'
    
    localStorage.setItem('token', expiredToken)
    localStorage.setItem('refreshToken', refreshToken)
    
    // Simular request con token expirado
    cy.request({
      url: '/api/backoffice/articles',
      headers: {
        Authorization: `Bearer ${expiredToken}`
      },
      failOnStatusCode: false
    }).then((response) => {
      // Verificar que se obtuvo nuevo token
      expect(localStorage.getItem('token')).to.eq(newToken)
      // Verificar que la request original se completó
      expect(response.status).to.eq(200)
    })
  })

  it('Debería redireccionar a login si falla la renovación', () => {
    localStorage.setItem('token', 'expired-token')
    localStorage.setItem('refreshToken', 'expired-refresh-token')
    
    cy.request({
      url: '/api/backoffice/auth/refresh-token',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      cy.url().should('include', '/login')
    })
  })
})
```

## Validación de Implementación

### Criterios de Aceptación
1. Todos los casos de uso implementados
2. Tests pasando al 100%
3. Manejo correcto de errores
4. UI/UX coherente y amigable
5. Documentación actualizada

### Métricas de Calidad
1. Cobertura de tests > 90%
2. Tiempo de respuesta < 2s
3. Tasa de errores < 1%
4. Experiencia de usuario satisfactoria

## Referencias
- [ADR 006: Arquitectura de Autenticación](../adr/006-autenticacion.md)
- [OpenAPI Spec](../api/openapi.json)
