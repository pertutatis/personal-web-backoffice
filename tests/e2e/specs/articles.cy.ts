describe('Gestión de Artículos', () => {
  beforeEach(() => {
    // Autenticamos al usuario antes de cada prueba
    cy.login('usuario_test', 'contraseña_test');
    cy.visit('/articulos');
    
    // Añadimos un tiempo de espera para asegurar que la página se ha cargado completamente
    cy.wait(1000);
  });

  it('Debería mostrar la lista de artículos', () => {
    // Usamos cy.wait antes de buscar la tabla para asegurar que ha tenido tiempo de cargarse
    cy.wait(1000);
    cy.get('[data-cy=articles-table]', { timeout: 10000 }).should('be.visible');
    // Verificamos que exista al menos una fila en la tabla o un mensaje de "no hay artículos"
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=article-row]').length > 0) {
        cy.get('[data-cy=article-row]').should('have.length.at.least', 1);
      } else {
        cy.contains('No hay artículos disponibles').should('be.visible');
      }
    });
  });

  it('Debería permitir crear un nuevo artículo', () => {
    // Generamos un título único con timestamp para evitar conflictos
    const uniqueTitle = `Artículo de prueba E2E ${Date.now()}`;
    const uniqueSlug = `articulo-prueba-e2e-${Date.now()}`;
    
    // Hacemos clic en el botón para crear un nuevo artículo
    cy.get('[data-cy=new-article-button]').click();
    
    // Verificamos que estamos en la página de creación de artículos
    cy.url().should('include', '/articulos/nuevo');
    
    // Rellenamos el formulario
    cy.get('[data-cy=article-title-input]').type(uniqueTitle);
    cy.get('[data-cy=article-slug-input]').clear().type(uniqueSlug);
    cy.get('[data-cy=article-excerpt-input]').type('Este es un extracto de prueba para el artículo creado durante las pruebas E2E.');
    cy.get('[data-cy=article-content-input]').type('# Título principal\n\nEste es el contenido del artículo creado durante las pruebas E2E.\n\n## Sección secundaria\n\nUn poco más de contenido para probar el funcionamiento correcto.');
    
    // Enviamos el formulario
    cy.get('[data-cy=article-submit-button]').click();
    
    // Verificamos que se haya creado correctamente y nos redirija a la página de detalles
    cy.url().should('include', '/articulos/');
    cy.get('[data-cy=article-title]').should('contain', uniqueTitle);
    
    // Verificamos que aparezca una notificación de éxito
    cy.get('[data-cy=notification]').should('be.visible');
    cy.get('[data-cy=notification-success]').should('be.visible');
  });

  it('Debería validar los campos requeridos al crear un artículo', () => {
    cy.get('[data-cy=new-article-button]').click();
    
    // Intentamos enviar el formulario vacío
    cy.get('[data-cy=article-submit-button]').click();
    
    // Verificamos que aparezcan los mensajes de error
    cy.get('[data-cy=article-title-error]').should('be.visible');
    cy.get('[data-cy=article-slug-error]').should('be.visible');
    cy.get('[data-cy=article-excerpt-error]').should('be.visible');
    cy.get('[data-cy=article-content-error]').should('be.visible');
  });

  it('Debería generar automáticamente el slug a partir del título', () => {
    cy.get('[data-cy=new-article-button]').click();
    
    // Escribimos solo el título
    const uniqueTitle = `Título automático ${Date.now()}`;
    cy.get('[data-cy=article-title-input]').type(uniqueTitle);
    
    // Verificamos que el slug se genera automáticamente
    cy.get('[data-cy=article-slug-input]').should('have.value', `titulo-automatico-${Date.now()}`.toLowerCase());
  });

  it('Debería permitir ver detalles de un artículo existente', () => {
    // Primero verificamos si hay artículos
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=article-row]').length > 0) {
        // Hacemos clic en el primer artículo para ver sus detalles
        cy.get('[data-cy=view-article-button]').first().click();
        
        // Verificamos que estamos en la página de detalles
        cy.url().should('include', '/articulos/');
        cy.get('[data-cy=article-title]').should('be.visible');
        cy.get('[data-cy=article-excerpt]').should('be.visible');
        cy.get('[data-cy=article-content]').should('be.visible');
      } else {
        // Si no hay artículos, simplemente terminamos el test
        cy.log('No hay artículos existentes, se omite esta prueba');
        return;
      }
    });
  });

  it('Debería permitir editar un artículo existente', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=article-row]').length > 0) {
        // Hacemos clic en el botón de editar del primer artículo
        cy.get('[data-cy=edit-article-button]').first().click();
        
        // Verificamos que estamos en la página de edición
        cy.url().should('include', '/editar');
        
        // Modificamos el título y el extracto
        const newTitle = `Artículo editado E2E ${Date.now()}`;
        cy.get('[data-cy=article-title-input]').clear().type(newTitle);
        cy.get('[data-cy=article-excerpt-input]').clear().type('Nuevo extracto editado en prueba E2E');
        
        // Guardamos los cambios
        cy.get('[data-cy=article-submit-button]').click();
        
        // Verificamos que los cambios se hayan aplicado
        cy.url().should('include', '/articles/');
        cy.get('[data-cy=article-title]').should('contain', newTitle);
        cy.get('[data-cy=notification-success]').should('be.visible');
      } else {
        cy.log('No hay artículos para editar, se omite esta prueba');
        return;
      }
    });
  });

  it('Debería mostrar la vista previa del contenido en markdown', () => {
    cy.get('[data-cy=new-article-button]').click();
    
    // Agregamos contenido markdown para ver la vista previa
    cy.get('[data-cy=article-content-input]').type('# Título en Markdown\n\nEste es un **párrafo** con *formato*.');
    
    // Verificamos que la vista previa se muestra correctamente
    cy.contains('h3', 'Vista previa').should('be.visible');
    cy.get('.prose h1').should('contain', 'Título en Markdown');
    cy.get('.prose strong').should('contain', 'párrafo');
    cy.get('.prose em').should('contain', 'formato');
  });

  it('Debería permitir eliminar un artículo', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=article-row]').length > 0) {
        // Guardamos el número inicial de artículos
        cy.get('[data-cy=article-row]').then($rows => {
          const initialCount = $rows.length;
          
          // Hacemos clic en el botón de eliminar del primer artículo
          cy.get('[data-cy=delete-article-button]').first().click();
          
          // Confirmamos la eliminación en el modal de confirmación
          cy.get('[data-cy=confirm-delete-button]').click();
          
          // Verificamos que se ha eliminado (hay un artículo menos o aparece "No hay artículos")
          cy.get('[data-cy=notification-success]').should('be.visible');
          
          if (initialCount > 1) {
            cy.get('[data-cy=article-row]').should('have.length', initialCount - 1);
          } else {
            cy.contains('No hay artículos disponibles').should('be.visible');
          }
        });
      } else {
        cy.log('No hay artículos para eliminar');
        return;
      }
    });
  });

  it('Debería permitir gestionar enlaces relacionados', () => {
    cy.get('[data-cy=new-article-button]').click();
    
    // Rellenamos los campos obligatorios
    cy.get('[data-cy=article-title-input]').type(`Artículo con enlaces ${Date.now()}`);
    cy.get('[data-cy=article-excerpt-input]').type('Extracto para prueba de enlaces relacionados');
    cy.get('[data-cy=article-content-input]').type('Contenido básico para prueba de enlaces');
    
    // Añadimos un enlace relacionado
    cy.contains('button', 'Añadir enlace relacionado').click();
    cy.get('input[placeholder="Texto del enlace"]').first().type('Sitio web oficial');
    cy.get('input[placeholder="URL"]').first().type('https://ejemplo.com');
    
    // Añadimos un segundo enlace y luego lo eliminamos
    cy.contains('button', 'Añadir enlace relacionado').click();
    cy.get('input[placeholder="Texto del enlace"]').eq(1).type('Enlace a eliminar');
    cy.get('input[placeholder="URL"]').eq(1).type('https://eliminar.com');
    
    // Eliminamos el segundo enlace
    cy.get('button').contains('×').eq(1).click();
    
    // Verificamos que solo queda un enlace
    cy.get('input[placeholder="Texto del enlace"]').should('have.length', 1);
    cy.get('input[placeholder="URL"]').should('have.length', 1);
    
    // Enviamos el formulario
    cy.get('[data-cy=article-submit-button]').click();
    
    // Verificamos que se creó exitosamente
    cy.get('[data-cy=notification-success]').should('be.visible');
  });

  it('Debería permitir seleccionar libros relacionados', () => {
    cy.get('[data-cy=new-article-button]').click();
    
    // Rellenamos los campos obligatorios
    cy.get('[data-cy=article-title-input]').type(`Artículo con libros relacionados ${Date.now()}`);
    cy.get('[data-cy=article-excerpt-input]').type('Extracto para prueba de libros relacionados');
    cy.get('[data-cy=article-content-input]').type('Contenido básico para prueba de libros relacionados');
    
    // Verificamos si hay libros disponibles para seleccionar
    cy.get('body').then(($body) => {
      const hasBooks = !$body.text().includes('No hay libros disponibles');
      
      if (hasBooks) {
        // Seleccionamos el primer libro de la lista
        cy.get('input[type="checkbox"]').first().check();
        
        // Enviamos el formulario
        cy.get('[data-cy=article-submit-button]').click();
        
        // Verificamos que se creó exitosamente
        cy.get('[data-cy=notification-success]').should('be.visible');
      } else {
        cy.log('No hay libros disponibles para seleccionar');
        // Continuamos con el formulario sin seleccionar libros
        cy.get('[data-cy=article-submit-button]').click();
        cy.get('[data-cy=notification-success]').should('be.visible');
      }
    });
  });
});
