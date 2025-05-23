describe('Autenticación', () => {
  describe('Login', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('Debería mostrar formulario de login', () => {
      cy.get('[data-test="login-form"]').should('be.visible');
      cy.get('[data-test="email"]').should('be.visible');
      cy.get('[data-test="password"]').should('be.visible');
      cy.get('[data-test="login-button"]').should('be.visible');
    });

    it('Debería validar campos requeridos', () => {
      cy.get('[data-test="login-button"]').click();
      
      cy.get('[data-test="email-error"]')
        .should('be.visible')
        .and('contain', 'El email es requerido');
      
      cy.get('[data-test="password-error"]')
        .should('be.visible')
        .and('contain', 'La contraseña es requerida');
    });

    it('Debería validar formato de email', () => {
      cy.get('[data-test="email"]').type('email_invalido');
      cy.get('[data-test="login-button"]').click();
      
      cy.get('[data-test="email-error"]')
        .should('be.visible')
        .and('contain', 'Email inválido');
    });

    it('Debería mostrar error con credenciales incorrectas', () => {
      cy.intercept('POST', '/api/backoffice/auth/login', {
        statusCode: 400,
        body: {
          type: 'ValidationError',
          message: 'Credenciales inválidas'
        }
      }).as('loginFailed');

      cy.get('[data-test="email"]').type('noexiste@test.com');
      cy.get('[data-test="password"]').type('contraseña_incorrecta');
      cy.get('[data-test="login-button"]').click();
      
      cy.wait('@loginFailed');
      cy.get('[data-test="error-message"]')
        .should('be.visible')
        .and('contain', 'Credenciales inválidas');
    });

    it('Debería permitir iniciar sesión con credenciales correctas', () => {
      cy.intercept('POST', '/api/backoffice/auth/login', {
        statusCode: 200,
        body: {
          token: 'test-token',
          refreshToken: 'test-refresh-token'
        }
      }).as('loginSuccess');

      cy.get('[data-test="email"]').type('usuario@test.com');
      cy.get('[data-test="password"]').type('contraseña123');
      cy.get('[data-test="login-button"]').click();
      
      cy.wait('@loginSuccess');
      cy.url().should('include', '/dashboard');
      cy.window().its('localStorage')
        .invoke('getItem', 'auth_tokens')
        .should('exist');
    });
  });

  describe('Registro', () => {
    beforeEach(() => {
      cy.visit('/register');
    });

    it('Debería mostrar formulario de registro', () => {
      cy.get('[data-test="register-form"]').should('be.visible');
      cy.get('[data-test="email"]').should('be.visible');
      cy.get('[data-test="password"]').should('be.visible');
      cy.get('[data-test="confirm-password"]').should('be.visible');
      cy.get('[data-test="register-button"]').should('be.visible');
    });

    it('Debería validar campos requeridos', () => {
      cy.get('[data-test="register-button"]').click();
      
      cy.get('[data-test="email-error"]')
        .should('be.visible')
        .and('contain', 'El email es requerido');
      
      cy.get('[data-test="password-error"]')
        .should('be.visible')
        .and('contain', 'La contraseña es requerida');
    });

    it('Debería validar contraseñas que coincidan', () => {
      cy.get('[data-test="email"]').type('nuevo@test.com');
      cy.get('[data-test="password"]').type('contraseña123');
      cy.get('[data-test="confirm-password"]').type('contraseña456');
      cy.get('[data-test="register-button"]').click();
      
      cy.get('[data-test="password-error"]')
        .should('be.visible')
        .and('contain', 'Las contraseñas no coinciden');
    });

    it('Debería validar requisitos de contraseña', () => {
      cy.get('[data-test="email"]').type('nuevo@test.com');
      cy.get('[data-test="password"]').type('123');
      cy.get('[data-test="confirm-password"]').type('123');
      cy.get('[data-test="register-button"]').click();
      
      cy.get('[data-test="password-error"]')
        .should('be.visible')
        .and('contain', 'La contraseña debe tener al menos 8 caracteres');
    });

    it('Debería mostrar error si el email ya existe', () => {
      cy.intercept('POST', '/api/backoffice/auth/register', {
        statusCode: 409,
        body: {
          type: 'ValidationError',
          message: 'El email ya está registrado'
        }
      }).as('registerFailed');

      cy.get('[data-test="email"]').type('existente@test.com');
      cy.get('[data-test="password"]').type('contraseña123');
      cy.get('[data-test="confirm-password"]').type('contraseña123');
      cy.get('[data-test="register-button"]').click();
      
      cy.wait('@registerFailed');
      cy.get('[data-test="error-message"]')
        .should('be.visible')
        .and('contain', 'El email ya está registrado');
    });

    it('Debería registrar un nuevo usuario correctamente', () => {
      cy.intercept('POST', '/api/backoffice/auth/register', {
        statusCode: 201,
        body: {
          token: 'test-token',
          refreshToken: 'test-refresh-token'
        }
      }).as('registerSuccess');

      const email = `test${Date.now()}@test.com`;
      cy.get('[data-test="email"]').type(email);
      cy.get('[data-test="password"]').type('contraseña123');
      cy.get('[data-test="confirm-password"]').type('contraseña123');
      cy.get('[data-test="register-button"]').click();
      
      cy.wait('@registerSuccess');
      cy.url().should('include', '/dashboard');
      cy.window().its('localStorage')
        .invoke('getItem', 'auth_tokens')
        .should('exist');
    });
  });

  describe('Gestión de sesión', () => {
    beforeEach(() => {
      cy.login('usuario@test.com', 'contraseña123');
    });

    it('Debería permitir cerrar sesión', () => {
      cy.get('[data-test="logout-button"]').click();
      
      cy.url().should('include', '/login');
      cy.window().its('localStorage')
        .invoke('getItem', 'auth_tokens')
        .should('not.exist');
    });

    it('Debería renovar el token automáticamente', () => {
      cy.intercept('GET', '/api/backoffice/articles', {
        statusCode: 401,
        body: {
          type: 'TokenExpiredError',
          message: 'Token expired'
        }
      }).as('expiredToken');

      cy.intercept('POST', '/api/backoffice/auth/refresh-token', {
        statusCode: 200,
        body: {
          token: 'new-token',
          refreshToken: 'new-refresh-token'
        }
      }).as('refreshToken');

      cy.intercept('GET', '/api/backoffice/articles', {
        statusCode: 200,
        body: {
          items: [],
          page: 1,
          limit: 10,
          total: 0
        }
      }).as('retryRequest');

      cy.visit('/articulos');
      
      cy.wait('@expiredToken');
      cy.wait('@refreshToken');
      cy.wait('@retryRequest');
      
      cy.url().should('include', '/articulos');
    });

    it('Debería redirigir a login cuando falla la renovación del token', () => {
      cy.intercept('GET', '/api/backoffice/articles', {
        statusCode: 401,
        body: {
          type: 'TokenExpiredError',
          message: 'Token expired'
        }
      }).as('expiredToken');

      cy.intercept('POST', '/api/backoffice/auth/refresh-token', {
        statusCode: 401,
        body: {
          type: 'ValidationError',
          message: 'Refresh token inválido'
        }
      }).as('refreshFailed');

      cy.visit('/articulos');
      
      cy.wait('@expiredToken');
      cy.wait('@refreshFailed');
      
      cy.url().should('include', '/login');
      cy.window().its('localStorage')
        .invoke('getItem', 'auth_tokens')
        .should('not.exist');
    });
  });
});
