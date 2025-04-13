describe('Autenticación', () => {
  beforeEach(() => {
    // Visitar la página de login antes de cada prueba
    cy.visit('/login');
  });

  it('Debería mostrar formulario de login', () => {
    cy.get('[data-cy=login-form]').should('be.visible');
    cy.get('[data-cy=username-input]').should('be.visible');
    cy.get('[data-cy=password-input]').should('be.visible');
    cy.get('[data-cy=login-button]').should('be.visible');
  });

  it('Debería mostrar error con credenciales incorrectas', () => {
    cy.get('[data-cy=username-input]').type('usuario_incorrecto');
    cy.get('[data-cy=password-input]').type('contraseña_incorrecta');
    cy.get('[data-cy=login-button]').click();
    
    // Verificar mensaje de error
    cy.get('[data-cy=login-error]')
      .should('be.visible')
      .and('contain', 'Credenciales incorrectas');
  });

  it('Debería permitir iniciar sesión con credenciales correctas', () => {
    // Nota: Usar credenciales de prueba que funcionen en tu entorno
    cy.get('[data-cy=username-input]').type('usuario_test');
    cy.get('[data-cy=password-input]').type('contraseña_test');
    cy.get('[data-cy=login-button]').click();
    
    // Verificar que redirige al dashboard tras login exitoso
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy=user-greeting]').should('contain', 'usuario_test');
  });

  it('Debería permitir cerrar sesión', () => {
    // Primero nos logueamos
    cy.login('usuario_test', 'contraseña_test');
    
    // Luego cerramos sesión
    cy.get('[data-cy=logout-button]').click();
    
    // Verificamos que estamos en la página de login
    cy.url().should('include', '/login');
  });
});
