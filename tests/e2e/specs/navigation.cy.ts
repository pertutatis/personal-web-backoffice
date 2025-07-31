describe('Navegación básica', () => {
  beforeEach(() => {
    // Autenticamos al usuario antes de cada prueba
    cy.login('usuario_test', 'contraseña_test');
  });
  
  it('Debería mostrar el título del dashboard', () => {
    cy.get('[data-cy=page-title]').should('contain', 'Dashboard');
  });
  
  it('Debería navegar al listado de libros', () => {
    cy.get('[data-cy=sidebar]').should('be.visible');
    cy.get('[data-cy=nav-books]').click();
    
    cy.url().should('include', '/libros');
    cy.get('[data-cy=books-table]').should('be.visible');
    cy.get('[data-cy=new-book-button]').should('be.visible');
  });
  
  it('Debería navegar al listado de artículos', () => {
    cy.get('[data-cy=nav-articles]').click();
    
    cy.url().should('include', '/articulos');
    cy.get('[data-cy=articles-table]').should('be.visible');
    cy.get('[data-cy=new-article-button]').should('be.visible');
  });
  
  // TO DO: no cambia colores
  it('Debería cambiar entre modo claro y oscuro', () => {
    // Verificar el estado inicial (normalmente modo claro)
    cy.get('html').should('not.have.class', 'dark');
    
    // Cambiar a modo oscuro
    cy.get('[data-cy=theme-toggle]').click();
    cy.get('html').should('have.class', 'dark');
    
    // Volver a modo claro
    cy.get('[data-cy=theme-toggle]').click();
    cy.get('html').should('not.have.class', 'dark');
  });
  
  //not ready to responsive
  it.skip('Debería colapsar y expandir el sidebar en dispositivos móviles', () => {
    // Establecer viewport de móvil
    cy.viewport('iphone-x');
    
    // El sidebar debería estar oculto inicialmente en móvil
    cy.get('[data-cy=sidebar]').should('not.be.visible');
    
    // Abrir el sidebar
    cy.get('[data-cy=menu-toggle]').click();
    cy.get('[data-cy=sidebar]').should('be.visible');
    
    // Seleccionar una opción debería cerrar el sidebar
    cy.get('[data-cy=nav-books]').click();
    cy.get('[data-cy=sidebar]').should('not.be.visible');
    cy.url().should('include', '/libros');
  });
});
