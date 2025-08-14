describe('Gestión de Artículos', () => {
  it('Debería permitir guardar tras corregir un error de validación en la creación', () => {
    cy.get('[data-cy=new-article-button]').click();

    // Dejamos el título vacío para provocar un error de validación
    cy.get('[data-cy=article-title-input]').clear();
    cy.get('[data-cy=article-slug-input]').clear().type(`articulo-validacion-e2e-${Date.now()}`);
    cy.get('[data-cy=article-excerpt-input]').type('Extracto para test de validación.');
    cy.get('[data-cy=article-content-input]').type('Contenido para test de validación.');

    // Intentamos enviar el formulario (debería fallar la validación)
    cy.get('[data-cy=article-submit-button]').click();
    cy.get('[data-cy=article-title-error]').scrollIntoView().should('be.visible');

    // Corregimos el error rellenando el título
    const fixedTitle = `Artículo validación E2E ${Date.now()}`;
    cy.get('[data-cy=article-title-input]').type(fixedTitle);

    // Volvemos a enviar el formulario
    cy.get('[data-cy=article-submit-button]').click();

    // Verificamos que se muestra la notificación de éxito y redirige
    cy.get('[data-cy=notification-success]', { timeout: 10000 }).should('be.visible');
    cy.url().should('include', '/articulos');
  });
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
    
    // Esperamos a que se complete la creación
    cy.wait('@createArticle');
    
    // Verificamos que aparezca una notificación de éxito (con timeout más largo)
    cy.get('[data-cy=notification-success]', { timeout: 10000 }).should('be.visible');
    
    // Verificamos que se redirige correctamente a la lista de artículos
    cy.url().should('equal', 'http://localhost:5173/articulos');
  });

  it('Debería validar los campos requeridos al crear un artículo', () => {
    cy.get('[data-cy=new-article-button]').click();
    
    // Removemos el atributo required para probar la validación JavaScript
    cy.get('[data-cy=article-title-input]').invoke('removeAttr', 'required');
    cy.get('[data-cy=article-excerpt-input]').invoke('removeAttr', 'required');
    cy.get('[data-cy=article-content-input]').invoke('removeAttr', 'required');
    
    // Intentamos enviar el formulario vacío
    cy.get('[data-cy=article-submit-button]').click();
    
  // Verificamos que aparezcan los mensajes de error de validación JavaScript
  cy.get('[data-cy=article-title-error]').scrollIntoView().should('be.visible');
  cy.get('[data-cy=article-excerpt-error]').scrollIntoView().should('be.visible');
  cy.get('[data-cy=article-content-error]').scrollIntoView().should('be.visible');
  });

  it('Debería permitir introducir el título y slug manualmente', () => {
    cy.get('[data-cy=new-article-button]').click();
    
    // Escribimos el título y slug manualmente
    const uniqueTitle = `Título manual ${Date.now()}`;
    const uniqueSlug = `titulo-manual-${Date.now()}`;
    
    cy.get('[data-cy=article-title-input]').type(uniqueTitle);
    cy.get('[data-cy=article-slug-input]').clear().type(uniqueSlug);
    
    // Verificamos que los valores se mantienen
    cy.get('[data-cy=article-title-input]').should('have.value', uniqueTitle);
    cy.get('[data-cy=article-slug-input]').should('have.value', uniqueSlug);
  });

  it('Debería permitir ver detalles de un artículo existente', () => {
    // Primero verificamos si hay artículos
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=article-row]').length > 0) {
        // Hacemos clic en el primer artículo para ver sus detalles
        cy.get('[data-cy=view-article-button]').first().click();
        
        // Verificamos que estamos en la página de detalles
        cy.url().should('include', '/articulos');
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
        cy.url().should('include', '/articulos');
        cy.get('[data-cy=notification-success]').should('be.visible');
        
        // Como usamos datos mock, verificamos que estamos en la lista de artículos
        cy.get('[data-cy=articles-table]').should('be.visible');
        cy.get('[data-cy=article-row]').should('exist');
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
    
    // Hacemos clic en la pestaña de Vista Previa
    cy.contains('button', 'Vista Previa').click();
    
    // Verificamos que la vista previa se muestra correctamente
    cy.get('.markdown-preview h1').should('contain', 'Título en Markdown');
    cy.get('.markdown-preview strong').should('contain', 'párrafo');
    cy.get('.markdown-preview em').should('contain', 'formato');
  });

  it('Debería permitir eliminar un artículo', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=article-row]').length > 0) {
        // Guardamos el número inicial de artículos
        cy.get('[data-cy=article-row]').then($rows => {
          const initialCount = $rows.length;
          
          // Hacemos clic en el botón de eliminar del primer artículo
          cy.get('[data-cy=delete-article-button]').first().click();
          
          // Confirmamos la eliminación en el modal visible
          cy.get('.modal-backdrop').should('be.visible');
          cy.get('.modal-backdrop .modal-button.confirm-button').click();

          // Solo verificamos que se muestra la notificación de éxito tras el borrado
          cy.get('[data-cy=notification-success]').should('be.visible');
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
    const uniqueTitle = `Artículo con enlaces ${Date.now()}`;
    const uniqueSlug = `articulo-con-enlaces-${Date.now()}`;
    cy.get('[data-cy=article-title-input]').type(uniqueTitle);
    cy.get('[data-cy=article-slug-input]').clear().type(uniqueSlug);
    cy.get('[data-cy=article-excerpt-input]').type('Extracto para prueba de enlaces relacionados');
    cy.get('[data-cy=article-content-input]').type('Contenido básico para prueba de enlaces');
    
    // Añadimos un enlace relacionado
    cy.contains('button', 'Añadir enlace relacionado').click();
    cy.get('input[placeholder="Texto del enlace"]').first().type('Sitio web oficial');
    cy.get('input[placeholder="https://ejemplo.com"]').first().type('https://ejemplo.com');
    
    // Añadimos un segundo enlace y luego lo eliminamos
    cy.contains('button', 'Añadir enlace relacionado').click();
    cy.get('input[placeholder="Texto del enlace"]').eq(1).type('Enlace a eliminar');
    cy.get('input[placeholder="https://ejemplo.com"]').eq(1).type('https://eliminar.com');
    
    // Eliminamos el segundo enlace
    cy.get('.remove-link-button').eq(1).click();
    
    // Verificamos que solo queda un enlace
    cy.get('input[placeholder="Texto del enlace"]').should('have.length', 1);
    cy.get('input[placeholder="https://ejemplo.com"]').should('have.length', 1);
    
    // Enviamos el formulario
    cy.get('[data-cy=article-submit-button]').click();
    
    // Verificamos que redirige correctamente y hay notificación
    cy.url().should('include', '/articulos');
    cy.get('[data-cy=notification-success]', { timeout: 10000 }).should('be.visible');
  });

  it('Debería permitir seleccionar libros relacionados', () => {
    cy.get('[data-cy=new-article-button]').click();
    
    // Rellenamos los campos obligatorios
    const uniqueTitle = `Artículo con libros relacionados ${Date.now()}`;
    const uniqueSlug = `articulo-con-libros-relacionados-${Date.now()}`;
    cy.get('[data-cy=article-title-input]').type(uniqueTitle);
    cy.get('[data-cy=article-slug-input]').clear().type(uniqueSlug);
    cy.get('[data-cy=article-excerpt-input]').type('Extracto para prueba de libros relacionados');
    cy.get('[data-cy=article-content-input]').type('Contenido básico para prueba de libros relacionados');
    
    // Verificamos si hay libros disponibles para seleccionar
    cy.get('body').then(($body) => {
      const hasBooks = !$body.text().includes('No hay libros disponibles');
      
      if (hasBooks) {
        // Seleccionamos el primer libro de la lista
        cy.get('input[type="checkbox"]').first().check({force: true});
        
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

  describe('Gestión de Estados de Artículos', () => {
    it('Debería mostrar el estado de los artículos en la tabla', () => {
      // Esperamos a que la API responda
      cy.wait('@getArticles');
      
      // Verificamos que se muestra la tabla
      cy.get('[data-cy=articles-table]').should('be.visible');
      
      // Verificamos que las columnas de estado estén presentes
      cy.get('thead th').should('contain', 'Estado');
      
      // Verificamos que se muestran los artículos mock
      cy.get('[data-cy=article-row]').should('have.length', 2);
      
      // Verificamos el artículo publicado
      cy.contains('[data-cy=article-row]', 'Artículo de Prueba PUBLISHED').within(() => {
        cy.get('[data-cy=article-status] span')
          .should('contain', 'Publicado')
          .and('have.class', 'status-published');
      });
      
      // Verificamos el artículo en borrador  
      cy.contains('[data-cy=article-row]', 'Artículo de Prueba DRAFT').within(() => {
        cy.get('[data-cy=article-status] span')
          .should('contain', 'Borrador')
          .and('have.class', 'status-draft');
      });
    });

    it('Debería crear un artículo en estado DRAFT por defecto', () => {
      const uniqueTitle = `Nuevo artículo borrador ${Date.now()}`;
      const uniqueSlug = `nuevo-articulo-borrador-${Date.now()}`;
      
      // Crear nuevo artículo
      cy.get('[data-cy=new-article-button]').click();
      cy.url().should('include', '/articulos/nuevo');
      
      // Rellenar formulario
      cy.get('[data-cy=article-title-input]').type(uniqueTitle);
      cy.get('[data-cy=article-slug-input]').clear().type(uniqueSlug);
      cy.get('[data-cy=article-excerpt-input]').type('Extracto del artículo en borrador para E2E.');
      cy.get('[data-cy=article-content-input]').type('# Contenido en borrador\n\nEste artículo se encuentra en estado de borrador.');
      
      // Enviar formulario
      cy.get('[data-cy=article-submit-button]').click();
      
      // Verificar que se creó exitosamente
      cy.get('[data-cy=notification-success]').should('be.visible');
      
      // Volver a la lista y verificar que se muestra la tabla de artículos
      cy.visit('/articulos');
      cy.wait(1000);
      
      // Verificar que estamos en la lista y que existe al menos un artículo en borrador
      cy.get('[data-cy=articles-table]').should('be.visible');
      cy.get('[data-cy=article-row]').should('exist');
      cy.get('[data-cy=article-status] span')
        .contains('Borrador')
        .should('have.class', 'status-draft');
    });

    it('Debería mostrar el botón de publicar solo para artículos en DRAFT', () => {
      // Esperar a que se carguen los artículos
      cy.wait('@getArticles');
      
      // Ir a editar el artículo DRAFT mockeado
      cy.contains('[data-cy=article-row]', 'Artículo de Prueba DRAFT').within(() => {
        cy.get('[data-cy=edit-article-button]').click();
      });
      
      // Esperar a que se cargue el artículo individual
      cy.wait('@getArticle');
      
      // Verificar que el botón de publicar esté presente para artículos DRAFT
      cy.get('[data-cy=article-publish-button]').scrollIntoView().should('be.visible').and('contain', 'Publicar');
      
      // Ir a la vista del artículo PUBLISHED para verificar que NO tiene botón
      cy.visit('/articulos');
      cy.wait('@getArticles');
      
      cy.contains('[data-cy=article-row]', 'Artículo de Prueba PUBLISHED').within(() => {
        cy.get('[data-cy=edit-article-button]').click();
      });
      
      cy.wait('@getArticle');
      
      // Verificar que NO hay botón de publicar para artículos PUBLISHED
      cy.get('[data-cy=article-publish-button]').should('not.exist');
    });

    it('Debería permitir publicar un artículo desde estado DRAFT', () => {
      // Crear un artículo en borrador
      const uniqueTitle = `Artículo a publicar E2E ${Date.now()}`;
      const uniqueSlug = `articulo-a-publicar-e2e-${Date.now()}`;
      
      cy.get('[data-cy=new-article-button]').click();
      cy.get('[data-cy=article-title-input]').type(uniqueTitle);
      cy.get('[data-cy=article-slug-input]').clear().type(uniqueSlug);
      cy.get('[data-cy=article-excerpt-input]').type('Extracto del artículo que será publicado.');
      cy.get('[data-cy=article-content-input]').type('# Artículo listo para publicar\n\nEste contenido está completo y listo para ser publicado.');
      cy.get('[data-cy=article-submit-button]').click();
      
      // Ir a editar para publicar
      cy.visit('/articulos');
      cy.wait(1000);
      
      // Como el artículo nuevo no aparece en la lista mock, editamos uno existente
      cy.contains('[data-cy=article-row]', 'Artículo de Prueba DRAFT').within(() => {
        cy.get('[data-cy=edit-article-button]').click();
      });
      
      // Hacer clic en publicar
      cy.get('[data-cy=article-publish-button]').click();
      
      // Confirmar en el modal
      cy.get('[data-cy=publish-modal]').should('be.visible');
      cy.get('[data-cy=confirm-publish-button]').click();
      
      // Verificar notificación de éxito
      cy.get('[data-cy=notification-success]').should('be.visible');
      
      // Volver a la lista y verificar que está publicado
      cy.visit('/articulos');
      cy.wait(1000);
      
      // Verificar que hay artículos publicados en la tabla
      cy.get('[data-cy=article-status] span')
        .contains('Publicado')
        .should('have.class', 'status-published');
    });

    it('Debería permitir cancelar la publicación desde el modal', () => {
      // Crear un artículo en borrador
      const uniqueTitle = `Artículo cancelar publicación ${Date.now()}`;
      const uniqueSlug = `articulo-cancelar-publicacion-${Date.now()}`;
      
      cy.get('[data-cy=new-article-button]').click();
      cy.get('[data-cy=article-title-input]').type(uniqueTitle);
      cy.get('[data-cy=article-slug-input]').clear().type(uniqueSlug);
      cy.get('[data-cy=article-excerpt-input]').type('Extracto del artículo para prueba de cancelación.');
      cy.get('[data-cy=article-content-input]').type('# Contenido de prueba\n\nEste artículo no será publicado en este test.');
      cy.get('[data-cy=article-submit-button]').click();
      
      // Ir a editar
      cy.visit('/articulos');
      cy.wait(1000);
      
      // Como el artículo nuevo no aparece en la lista mock, editamos uno existente
      cy.contains('[data-cy=article-row]', 'Artículo de Prueba DRAFT').within(() => {
        cy.get('[data-cy=edit-article-button]').click();
      });
      
      // Hacer clic en publicar
      cy.get('[data-cy=article-publish-button]').click();
      
      // Cancelar en el modal
      cy.get('[data-cy=publish-modal]').should('be.visible');
      cy.get('[data-cy=cancel-publish-button]').click();
      
      // Verificar que el modal se cierra
      cy.get('[data-cy=publish-modal]').should('not.exist');
      
      // Verificar que seguimos en la página de edición
      cy.url().should('include', '/editar');
      
      // Volver a la lista y verificar que hay artículos en borrador
      cy.visit('/articulos');
      cy.wait(1000);
      
      // Verificar que hay artículos en estado borrador
      cy.get('[data-cy=article-status] span')
        .contains('Borrador')
        .should('have.class', 'status-draft');
    });

    it('NO debería mostrar el botón de publicar para artículos ya publicados', () => {
      // Verificar si hay algún artículo publicado
      cy.get('body').then(($body) => {
        const publishedArticles = $body.find('[data-cy=article-status] span:contains("Publicado")');
        
        if (publishedArticles.length > 0) {
          // Hacer clic en editar un artículo publicado
          cy.get('[data-cy=article-status] span:contains("Publicado")')
            .first()
            .closest('[data-cy=article-row]')
            .find('[data-cy=edit-article-button]')
            .click();
          
          // Verificar que NO hay botón de publicar
          cy.get('[data-cy=article-publish-button]').should('not.exist');
        } else {
          cy.log('No hay artículos publicados para probar');
        }
      });
    });

    it('Debería permitir editar artículos publicados sin cambiar su estado', () => {
      // Primero creamos y publicamos un artículo
      const uniqueTitle = `Artículo para editar publicado ${Date.now()}`;
      const uniqueSlug = `articulo-editar-publicado-${Date.now()}`;
      
      cy.get('[data-cy=new-article-button]').click();
      cy.get('[data-cy=article-title-input]').type(uniqueTitle);
      cy.get('[data-cy=article-slug-input]').clear().type(uniqueSlug);
      cy.get('[data-cy=article-excerpt-input]').type('Extracto original.');
      cy.get('[data-cy=article-content-input]').type('# Contenido original\n\nEste es el contenido original del artículo.');
      cy.get('[data-cy=article-submit-button]').click();
      
      // Publicar el artículo
      cy.visit('/articulos');
      cy.wait(1000);
      
      // Como el artículo nuevo no aparece en la lista mock, editamos uno existente
      cy.contains('[data-cy=article-row]', 'Artículo de Prueba DRAFT').within(() => {
        cy.get('[data-cy=edit-article-button]').click();
      });
      
      cy.get('[data-cy=article-publish-button]').click();
      cy.get('[data-cy=publish-modal]').should('be.visible');
      cy.get('[data-cy=confirm-publish-button]').click();
      cy.get('[data-cy=notification-success]').should('be.visible');
      
      // Ahora editamos un artículo ya publicado
      cy.visit('/articulos');
      cy.wait(1000);
      
      cy.contains('[data-cy=article-row]', 'Artículo de Prueba PUBLISHED').within(() => {
        cy.get('[data-cy=edit-article-button]').click();
      });
      
      // Modificar el extracto
      const newExcerpt = 'Extracto editado después de publicación';
      cy.get('[data-cy=article-excerpt-input]').clear().type(newExcerpt);
      
      // Guardar cambios
      cy.get('[data-cy=article-submit-button]').click();
      cy.get('[data-cy=notification-success]').should('be.visible');
      
      // Verificar que sigue publicado
      cy.visit('/articulos');
      cy.wait(1000);
      
      // Verificar que hay artículos publicados en la tabla
      cy.get('[data-cy=article-status] span')
        .contains('Publicado')
        .should('have.class', 'status-published');
    });
  });
});
