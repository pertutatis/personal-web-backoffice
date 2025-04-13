// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Cypress namespace declaration
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Comando personalizado para iniciar sesión
       * @example cy.login('username', 'password')
       */
      login(username: string, password: string): Chainable<void>;
      
      /**
       * Comando personalizado para verificar existencia de notificación
       * @example cy.checkNotification('success', 'Libro creado correctamente')
       */
      checkNotification(type: string, message: string): Chainable<void>;
      
      /**
       * Comando personalizado para crear un libro
       * @example cy.createBook({ title: 'Nuevo libro', author: 'Autor', isbn: '1234567890123' })
       */
      createBook(bookData: Record<string, any>): Chainable<void>;
      
      /**
       * Comando personalizado para crear un artículo
       * @example cy.createArticle({ title: 'Nuevo artículo', content: 'Contenido...' })
       */
      createArticle(articleData: Record<string, any>): Chainable<void>;
    }
  }
}

// Implementación de comandos personalizados
Cypress.Commands.add('login', (username, password) => {
  // Simular inicio de sesión (ajustar según la implementación real)
  cy.visit('/login');
  cy.get('[data-cy=username-input]').type(username);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-button]').click();
  // Verificar que el inicio de sesión fue exitoso (ajustar según la implementación real)
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('checkNotification', (type, message) => {
  cy.get('.notification')
    .should('be.visible')
    .and('contain', message);
  
  if (type) {
    cy.get(`.notification.${type}`).should('exist');
  }
});

Cypress.Commands.add('createBook', (bookData) => {
  cy.visit('/libros/nuevo');
  
  // Rellenar formulario
  cy.get('[data-cy=book-title-input]').type(bookData.title || 'Libro de prueba');
  cy.get('[data-cy=book-author-input]').type(bookData.author || 'Autor de prueba');
  cy.get('[data-cy=book-isbn-input]').type(bookData.isbn || '9783161484100');
  
  if (bookData.description) {
    cy.get('[data-cy=book-description-input]').type(bookData.description);
  }
  
  if (bookData.purchaseLink) {
    cy.get('[data-cy=book-purchase-link-input]').type(bookData.purchaseLink);
  }
  
  // Enviar formulario
  cy.get('[data-cy=book-submit-button]').click();
  
  // Verificar que se ha creado correctamente
  cy.url().should('include', '/libros/');
  cy.checkNotification('success', 'Libro creado correctamente');
});

Cypress.Commands.add('createArticle', (articleData) => {
  cy.visit('/articulos/nuevo');
  
  // Rellenar formulario
  cy.get('[data-cy=article-title-input]').type(articleData.title || 'Artículo de prueba');
  cy.get('[data-cy=article-content-input]').type(articleData.content || 'Contenido de prueba');
  
  if (articleData.excerpt) {
    cy.get('[data-cy=article-excerpt-input]').type(articleData.excerpt);
  }
  
  if (articleData.tags) {
    cy.get('[data-cy=article-tags-input]').type(articleData.tags.join(', '));
  }
  
  // Enviar formulario
  cy.get('[data-cy=article-submit-button]').click();
  
  // Verificar que se ha creado correctamente
  cy.url().should('include', '/articulos/');
  cy.checkNotification('success', 'Artículo creado correctamente');
});

// Este es un export vacío necesario para que TypeScript reconozca este archivo como un módulo
export {};
