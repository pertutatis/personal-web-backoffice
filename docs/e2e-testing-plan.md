# Plan de Pruebas End-to-End (E2E)

Fecha: 13 de abril de 2025

## Introducción

Este documento describe la estrategia y el plan de implementación para las pruebas end-to-end (E2E) en el proyecto Personal Web Backoffice. Las pruebas E2E validan que todos los componentes de la aplicación funcionen correctamente juntos desde la perspectiva del usuario final.

## Herramientas utilizadas

- **Cypress**: Framework principal para las pruebas E2E
- **@cypress/vue**: Plugin para integración con Vue.js
- **Docker**: Para ejecución de pruebas en entornos aislados

## Estructura de pruebas

```
tests/
  e2e/
    fixtures/       # Datos de prueba
    specs/          # Especificaciones de prueba (archivos .cy.ts)
      auth.cy.ts    # Pruebas de autenticación
      books.cy.ts   # Pruebas de gestión de libros
      articles.cy.ts # Pruebas de gestión de artículos
      navigation.cy.ts # Pruebas de navegación y UI
    support/
      commands.ts   # Comandos personalizados de Cypress
      e2e.ts        # Configuración de soporte
    downloads/      # Archivos descargados durante pruebas
    screenshots/    # Capturas de pantalla de fallos
    videos/         # Grabaciones de ejecución
```

## Casos de uso a testear

### 1. Autenticación

- Visualización del formulario de login
- Validación de credenciales incorrectas
- Inicio de sesión exitoso
- Cierre de sesión

### 2. Gestión de Libros

- Listado de libros
- Visualización de detalles
- Creación de nuevo libro
- Validación de formulario
- Edición de libro existente
- Eliminación de libro
- Validación de formato ISBN

### 3. Gestión de Artículos

- Listado de artículos
- Visualización de detalles
- Creación de nuevo artículo
- Validación de formulario
- Edición de artículo existente
- Eliminación de artículo

### 4. Navegación y UI

- Visualización de barra lateral y enlaces
- Navegación entre secciones
- Sistema de notificaciones
- Manejo de rutas no existentes (404)
- Adaptación a dispositivos móviles
- Cambio de temas (claro/oscuro)

## Comandos personalizados

Hemos implementado los siguientes comandos personalizados para facilitar las pruebas:

- `cy.login(username, password)`: Inicia sesión con credenciales dadas
- `cy.checkNotification(type, message)`: Verifica existencia de notificación
- `cy.createBook(bookData)`: Crea un libro de prueba
- `cy.createArticle(articleData)`: Crea un artículo de prueba

## Integración con CI/CD

Para facilitar la ejecución en entornos de integración continua:

1. Utilizamos Docker Compose para crear un entorno aislado
2. Configuramos scripts específicos en package.json
3. Capturamos screenshots y videos para depuración de fallos

## Recomendaciones para implementación

### Atributos data-cy

Para facilitar la selección de elementos en los tests, utilizamos atributos `data-cy` en los componentes. Ejemplos:

```html
<form data-cy="login-form">
  <input data-cy="username-input" />
  <input data-cy="password-input" />
  <button data-cy="login-button">Iniciar sesión</button>
</form>
```

### Mejores prácticas

1. **Aislamiento de pruebas**: Cada prueba debe funcionar de manera independiente
2. **Datos dinámicos**: Utilizar timestamps para crear datos únicos en cada ejecución
3. **Comandos personalizados**: Abstraer operaciones comunes en comandos reutilizables
4. **Validación visual**: Utilizar screenshots para validar estados visuales complejos
5. **Limpieza**: Cada prueba debe limpiar los datos que crea

## Scripts disponibles

```json
{
  "scripts": {
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:e2e:ci": "start-server-and-test dev http://localhost:5173 test:e2e",
    "test:e2e:docker": "docker-compose -f docker-compose.test.yml up --exit-code-from cypress"
  }
}
```

## Credenciales de prueba

Para las pruebas que requieran autenticación, utilizamos:

- **Usuario**: usuario_test
- **Contraseña**: contraseña_test

> **Nota**: Estas credenciales son exclusivas para el entorno de prueba y no deben utilizarse en producción.

## Próximos pasos

1. Añadir los atributos `data-cy` a todos los componentes
2. Implementar tests de gestión de libros
3. Implementar tests de gestión de artículos
4. Integrar las pruebas E2E en el pipeline de CI/CD
5. Ampliar la cobertura con pruebas para flujos complejos

## Referencias

- [Documentación oficial de Cypress](https://docs.cypress.io/guides/)
- [Guía de pruebas E2E para Vue.js](https://docs.cypress.io/guides/component-testing/vue/overview)
- [ADR-005: Estrategia de Testing](../adr/005-estrategia-testing.md)
