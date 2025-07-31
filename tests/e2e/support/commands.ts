/// <reference types="cypress" />

interface AuthTokens {
  token: string;
  refreshToken: string;
}

// Utilidad para encriptar tokens (TODO: implementar encriptación real)
const encryptTokens = (tokens: AuthTokens): string => btoa(JSON.stringify(tokens));

// Comando de login simulado para tests
Cypress.Commands.add('login', (email: string, password: string) => {
  // Simular respuesta exitosa de login
  const mockTokens = {
    token: 'mock-jwt-token-for-testing',
    refreshToken: 'mock-refresh-token-for-testing'
  };
  
  // Interceptar requests específicas de artículos (con wildcard para query params)
  cy.intercept('GET', '/api/backoffice/articles*', {
    statusCode: 200,
    body: {
      items: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Artículo de Prueba PUBLISHED',
          excerpt: 'Extracto del artículo publicado',
          content: '# Artículo publicado\n\nContenido del artículo.',
          slug: 'articulo-prueba-published',
          status: 'PUBLISHED',
          bookIds: [],
          relatedLinks: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '456e7890-e89b-12d3-a456-426614174001',
          title: 'Artículo de Prueba DRAFT',
          excerpt: 'Extracto del artículo en borrador',
          content: '# Artículo en borrador\n\nContenido del borrador.',
          slug: 'articulo-prueba-draft',
          status: 'DRAFT',
          bookIds: [],
          relatedLinks: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ],
      total: 2,
      page: 1,
      limit: 10
    }
  }).as('getArticles');
  
  // Interceptar requests específicas de artículos individuales
  cy.intercept('GET', '/api/backoffice/articles/*', (req) => {
    const articleId = req.url.split('/').pop()?.split('?')[0];
    if (articleId === '123e4567-e89b-12d3-a456-426614174000') {
      req.reply({
        statusCode: 200,
        body: {
          id: articleId,
          title: 'Artículo de Prueba PUBLISHED',
          excerpt: 'Extracto del artículo publicado',
          content: '# Artículo publicado\n\nContenido del artículo.',
          slug: 'articulo-prueba-published',
          status: 'PUBLISHED',
          bookIds: [],
          relatedLinks: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      });
    } else if (articleId === '456e7890-e89b-12d3-a456-426614174001') {
      req.reply({
        statusCode: 200,
        body: {
          id: articleId,
          title: 'Artículo de Prueba DRAFT',
          excerpt: 'Extracto del artículo en borrador',
          content: '# Artículo en borrador\n\nContenido del borrador.',
          slug: 'articulo-prueba-draft',
          status: 'DRAFT',
          bookIds: [],
          relatedLinks: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      });
    } else {
      req.reply({
        statusCode: 200,
        body: {
          id: articleId,
          title: 'Artículo Dinámico',
          excerpt: 'Extracto dinámico',
          content: '# Artículo\n\nContenido.',
          slug: 'articulo-dinamico',
          status: 'DRAFT',
          bookIds: [],
          relatedLinks: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      });
    }
  }).as('getArticle');

  // Interceptar requests generales de API
  cy.intercept('GET', '/api/backoffice/books*', { 
    statusCode: 200, 
    body: { 
      items: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Libro de Prueba E2E',
          author: 'Autor Test',
          isbn: '978-3-16-148410-0',
          description: 'Descripción del libro de prueba.',
          coverImage: null,
          purchaseLink: 'https://ejemplo.com/libro',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '456e7890-e89b-12d3-a456-426614174001',
          title: 'Segundo Libro E2E',
          author: 'Otro Autor',
          isbn: '978-0-123-45678-9',
          description: 'Otro libro para pruebas.',
          coverImage: null,
          purchaseLink: null,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z'
        }
      ], 
      total: 2, 
      page: 1, 
      limit: 10 
    } 
  });
  cy.intercept('POST', '/api/backoffice/articles', (req) => {
    const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    req.reply({
      statusCode: 201,
      body: {
        id: newId,
        ...req.body,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  }).as('createArticle');
  cy.intercept('PUT', '/api/backoffice/articles/*', (req) => {
    req.reply({
      statusCode: 200,
      body: {
        ...req.body,
        updatedAt: new Date().toISOString()
      }
    });
  }).as('updateArticle');
  cy.intercept('POST', '/api/backoffice/articles/*/publish', (req) => {
    const articleId = req.url.split('/').slice(-2, -1)[0];
    req.reply({
      statusCode: 200,
      body: {
        id: articleId,
        status: 'PUBLISHED',
        updatedAt: new Date().toISOString()
      }
    });
  }).as('publishArticle');
  
  // Interceptors para libros
  cy.intercept('PUT', '/api/backoffice/books/*', (req) => {
    req.reply({
      statusCode: 200,
      body: {
        ...req.body,
        updatedAt: new Date().toISOString()
      }
    });
  }).as('updateBook');
  cy.intercept('POST', '/api/backoffice/books', (req) => {
    const newId = `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    req.reply({
      statusCode: 201,
      body: {
        id: newId,
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  }).as('createBook');
  
  cy.intercept('GET', '/api/backoffice/books/*', (req) => {
    const bookId = req.url.split('/').pop()?.split('?')[0];
    if (bookId === 'book-123e4567-e89b-12d3-a456-426614174000') {
      req.reply({
        statusCode: 200,
        body: {
          id: bookId,
          title: 'Libro de Prueba E2E',
          author: 'Autor Test',
          isbn: '978-3-16-148410-0',
          description: 'Descripción del libro de prueba.',
          coverImage: null,
          purchaseLink: 'https://ejemplo.com/libro',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      });
    } else {
      req.reply({
        statusCode: 200,
        body: {
          id: bookId,
          title: 'Libro Dinámico',
          author: 'Autor Dinámico',
          isbn: '978-84-376-0494-7',
          description: 'Descripción dinámica.',
          coverImage: null,
          purchaseLink: null,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      });
    }
  }).as('getBook');
  
  cy.intercept('DELETE', '/api/backoffice/**', { statusCode: 204 });
  
  // Establecer tokens en localStorage
  cy.window().then((window) => {
    window.localStorage.setItem('auth_tokens', encryptTokens(mockTokens));
  });
  
  // Visitar la página de destino directamente
  cy.visit('/');
});

// Comando de registro
Cypress.Commands.add('register', (email: string, password: string) => {
  cy.intercept('POST', '/api/backoffice/auth/register').as('registerRequest');
  
  cy.visit('/register');
  cy.get('[data-test="email"]').type(email);
  cy.get('[data-test="password"]').type(password);
  cy.get('[data-test="confirm-password"]').type(password);
  cy.get('[data-test="register-button"]').click();
  
  cy.wait('@registerRequest').then((interception) => {
    const response = interception.response;
    if (response?.statusCode === 201 && response.body) {
      localStorage.setItem('auth_tokens', encryptTokens(response.body));
    }
  });

  cy.url().should('include', '/');
});

// Comando de login real para tests de autenticación
Cypress.Commands.add('realLogin', (email: string, password: string) => {
  cy.intercept('POST', '/api/backoffice/auth/login').as('loginRequest');
  
  cy.visit('/login');
  cy.get('[data-test="email"]').type(email);
  cy.get('[data-test="password"]').type(password);
  cy.get('[data-test="login-button"]').click();
  
  cy.wait('@loginRequest').then((interception) => {
    const response = interception.response;
    if (response?.statusCode === 200 && response.body) {
      localStorage.setItem('auth_tokens', encryptTokens(response.body));
    }
  });

  cy.url().should('not.include', '/login');
});

// Comando de logout 
Cypress.Commands.add('logout', () => {
  localStorage.removeItem('auth_tokens');
  cy.visit('/login');
  cy.url().should('include', '/login');
});

// Declaración de tipos para TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): void
      realLogin(email: string, password: string): void
      register(email: string, password: string): void
      logout(): void
    }
  }
}

export {}; // Convertir archivo en módulo ES
