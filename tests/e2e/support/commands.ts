/// <reference types="cypress" />

interface AuthTokens {
  token: string;
  refreshToken: string;
}

// Utilidad para encriptar tokens (TODO: implementar encriptación real)
const encryptTokens = (tokens: AuthTokens): string => btoa(JSON.stringify(tokens));

// Comando de login
Cypress.Commands.add('login', (email: string, password: string) => {
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
      register(email: string, password: string): void
      logout(): void
    }
  }
}

export {}; // Convertir archivo en módulo ES
