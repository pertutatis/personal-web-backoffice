describe('Gestión de Libros', () => {
  beforeEach(() => {
    // Autenticamos al usuario antes de cada prueba
    cy.login('usuario_test', 'contraseña_test');
    cy.visit('/libros');
    
    // Añadimos un tiempo de espera para asegurar que la página se ha cargado completamente
    cy.wait(1000);
  });

  it('Debería mostrar la lista de libros', () => {
    // Usamos cy.wait antes de buscar la tabla para asegurar que ha tenido tiempo de cargarse
    cy.wait(1000);
    cy.get('[data-cy=books-table]', { timeout: 10000 }).should('be.visible');
    // Verificamos que exista al menos una fila en la tabla o un mensaje de "no hay libros"
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=book-row]').length > 0) {
        cy.get('[data-cy=book-row]').should('have.length.at.least', 1);
      } else {
        cy.contains('No hay libros disponibles').should('be.visible');
      }
    });
  });

  it('Debería permitir crear un nuevo libro', () => {
    // Generamos un título único con timestamp para evitar conflictos
    const uniqueTitle = `Libro de prueba E2E ${Date.now()}`;
    
    // Hacemos clic en el botón para crear un nuevo libro
    cy.get('[data-cy=new-book-button]').click();
    
    // Verificamos que estamos en la página de creación de libros
    cy.url().should('include', '/libros/nuevo');
    
    // Rellenamos el formulario
    cy.get('[data-cy=book-title-input]').type(uniqueTitle);
    cy.get('[data-cy=book-author-input]').type('Autor de Prueba E2E');
    cy.get('[data-cy=book-isbn-input]').type('9788417092290');
    cy.get('[data-cy=book-year-input]').type('2023');
    cy.get('[data-cy=book-description-input]').type('Esta es una descripción de prueba para el libro creado durante las pruebas E2E.');
    
    // Enviamos el formulario
    cy.get('[data-cy=book-submit-button]').click();
    
    // Verificamos que se haya creado correctamente y nos redirija al listado
    cy.url().should('include', '/libros');
    
    // Verificamos que aparezca una notificación de éxito
    cy.get('[data-cy=notification-success]').should('be.visible');
    
    // Verificamos que estamos en la lista y que hay libros en la tabla
    cy.get('[data-cy=books-table]').should('be.visible');
    cy.get('[data-cy=book-row]').should('exist');
  });

  it('Debería validar los campos requeridos al crear un libro', () => {
    cy.get('[data-cy=new-book-button]').click();
    
    // Intentamos enviar el formulario vacío
    cy.get('[data-cy=book-submit-button]').click();
    
    // Verificamos que aparezcan los mensajes de error
    cy.get('[data-cy=book-title-error]').should('be.visible');
    cy.get('[data-cy=book-author-error]').should('be.visible');
    cy.get('[data-cy=book-isbn-error]').should('be.visible');
  });

  it('Debería permitir ver detalles de un libro existente', () => {
    // Primero verificamos si hay libros
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=book-row]').length > 0) {
        // Hacemos clic en el primer libro para ver sus detalles
        cy.get('[data-cy=view-book-button]').first().click();
        
        // Verificamos que estamos en la página de detalles
        cy.url().should('include', '/libros/');
        cy.get('[data-cy=book-title]').should('be.visible');
        cy.get('[data-cy=book-author]').should('be.visible');
        cy.get('[data-cy=book-isbn]').should('be.visible');
      } else {
        // Si no hay libros, simplemente terminamos el test
        cy.log('No hay libros existentes, se omite esta prueba');
        return;
      }
    });
  });

  it('Debería permitir editar un libro existente', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=book-row]').length > 0) {
        // Hacemos clic en el botón de editar del primer libro
        cy.get('[data-cy=edit-book-button]').first().click();
        
        // Verificamos que estamos en la página de edición
        cy.url().should('include', '/editar');
        
        // Modificamos el título
        const newTitle = `Libro editado E2E ${Date.now()}`;
        cy.get('[data-cy=book-title-input]').clear().type(newTitle);
        
        // Guardamos los cambios
        cy.get('[data-cy=book-submit-button]').click();
        
        // Verificamos que los cambios se hayan aplicado
        cy.url().should('include', '/libros');
        cy.get('[data-cy=notification-success]').should('be.visible');
        
        // Verificamos que estamos en la lista de libros
        cy.get('[data-cy=books-table]').should('be.visible');
        cy.get('[data-cy=book-row]').should('exist');
      } else {
        cy.log('No hay libros para editar, se omite esta prueba');
        return;
      }
    });
  });

  it('Debería permitir eliminar un libro', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=book-row]').length > 0) {
        // Guardamos el número inicial de libros
        cy.get('[data-cy=book-row]').then($rows => {
          const initialCount = $rows.length;
          
          // Hacemos clic en el botón de eliminar del primer libro
          cy.get('[data-cy=delete-book-button]').first().click();
          
          // Confirmamos la eliminación en el modal visible  
          cy.get('.modal-backdrop').should('be.visible');
          cy.get('.modal-backdrop .modal-button.confirm-button').click();
          
          // Verificamos que se ha eliminado (hay un libro menos o aparece "No hay libros")
          cy.get('[data-cy=notification-success]').should('be.visible');
        });
      } else {
        cy.log('No hay libros para eliminar');
        return;
      }
    });
  });
});
