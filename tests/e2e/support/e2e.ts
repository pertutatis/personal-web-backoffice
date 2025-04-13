// ***********************************************************
// This is the main support file for E2E tests
//
// Lees más sobre la configuración aquí:
// https://on.cypress.io/configuration
// ***********************************************************

// Importar comandos personalizados
import './commands';

// Ignorar errores no deseados en la aplicación
// Esto evitará que Cypress falle en caso de que haya errores de consola en la aplicación
Cypress.on('uncaught:exception', (err) => {
  // returning false aquí evita que Cypress falle la prueba
  console.log('Error no capturado en la aplicación:', err.message);
  return false;
});
