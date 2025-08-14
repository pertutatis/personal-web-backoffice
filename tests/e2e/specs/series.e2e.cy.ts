/// <reference types="cypress" />

describe('Gestión de Series', () => {
  const serie = {
    title: 'Serie Cypress',
    description: 'Descripción de prueba Cypress'
  }
  let serieId = 'serie-1'

  beforeEach(() => {
    // Login como en otros specs
    cy.login('usuario_test', 'contraseña_test');
    cy.visit('/series')
  })

  it('puede crear una serie', () => {
    cy.contains('Nueva serie').click()
    cy.get('input[name="title"]').type(serie.title)
    cy.get('textarea[name="description"]').type(serie.description)
    cy.contains('Guardar').click()
    cy.contains('Serie creada').should('be.visible');
  })

  it('puede editar una serie', () => {
    cy.get(`[data-id="${serieId}"]`).find('[data-cy="edit-serie"]').click()
    cy.get('input[name="title"]').clear().type('Serie Cypress Editada')
    cy.contains('Guardar').click()
    cy.contains('Serie actualizada').should('be.visible');
  })

  it('puede eliminar una serie', () => {
    cy.get(`[data-id="${serieId}"]`).find('[data-cy="delete-serie"]').click()
    cy.contains('Eliminar').click()
    cy.contains('La serie "Serie de Prueba 1" ha sido eliminada.').should('be.visible');
  })

  it('puede asociar una serie a un artículo al crear', () => {
    // Crear artículo y asociar serie
    cy.visit('/articulos', { timeout: 5000 })
    cy.contains('Nuevo Artículo').click()

    // Rellenar form
    cy.get('[data-cy=article-title-input]').type('Artículo con Serie');
    cy.get('[data-cy=article-excerpt-input]').type('Este es un extracto de prueba para el artículo creado durante las pruebas E2E.');
    cy.get('[data-cy=article-content-input]').type('# Título principal\n\nEste es el contenido del artículo creado durante las pruebas E2E.\n\n## Sección secundaria\n\nUn poco más de contenido para probar el funcionamiento correcto.');
    cy.get('select[name="seriesId"]', { timeout: 5000 }).should('be.visible').select('serie-1')
    
    cy.contains('Guardar').click()
    cy.contains('Artículo creado correctamente').should('be.visible');
  })
})
