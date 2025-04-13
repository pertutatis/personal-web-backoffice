import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BookTable from '../../../src/components/books/BookTable.vue'
import { Book } from '../../../src/types/models'

describe('BookTable.vue', () => {
  // Datos de prueba
  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      year: 2008,
      description: 'Libro sobre buenas prácticas de programación',
      createdAt: '2023-01-01T00:00:00Z'
    },
    {
      id: '2',
      title: 'Domain-Driven Design',
      author: 'Eric Evans',
      isbn: '9780321125217',
      year: 2003,
      description: 'Libro sobre diseño guiado por el dominio',
      createdAt: '2023-01-03T00:00:00Z'
    }
  ]

  const mockPagination = {
    page: 1,
    limit: 10,
    total: 2,
    pages: 1
  }

  let wrapper: any

  beforeEach(() => {
    wrapper = mount(BookTable, {
      props: {
        books: mockBooks,
        pagination: mockPagination,
        loading: false
      }
    })
  })

  it('renderiza correctamente la tabla con libros', () => {
    expect(wrapper.find('table').exists()).toBe(true)
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
    
    // Verificar que se muestran los títulos de los libros
    expect(rows[0].text()).toContain('Clean Code')
    expect(rows[1].text()).toContain('Domain-Driven Design')
  })

  it('muestra los autores correctamente', () => {
    const authorElements = wrapper.findAll('td:nth-child(2)')
    expect(authorElements[0].text()).toContain('Robert C. Martin')
    expect(authorElements[1].text()).toContain('Eric Evans')
  })

  it('formatea el ISBN correctamente', () => {
    const isbnElements = wrapper.findAll('td:nth-child(3)')
    // Debe formatear el ISBN-13 adecuadamente
    expect(isbnElements[0].text().trim()).not.toBe('9780132350884')
    expect(isbnElements[0].text()).toContain('-')
  })

  it('muestra el año de publicación correctamente', () => {
    const yearElements = wrapper.findAll('td:nth-child(4)')
    expect(yearElements[0].text().trim()).toBe('2008')
    expect(yearElements[1].text().trim()).toBe('2003')
  })

  it('muestra los botones de acción correctamente', () => {
    const firstRowActions = wrapper.findAll('tbody tr')[0].findAll('.flex.justify-end a, .flex.justify-end button')
    expect(firstRowActions.length).toBe(3)
    
    expect(firstRowActions[0].text()).toBe('Ver')
    expect(firstRowActions[1].text()).toBe('Editar')
    expect(firstRowActions[2].text()).toBe('Eliminar')
  })

  it('emite el evento delete cuando se confirma la eliminación', async () => {
    // Click en el botón eliminar del primer libro
    const deleteButton = wrapper.findAll('tbody tr')[0].find('button')
    await deleteButton.trigger('click')
    
    // Verificar que se muestra el modal de confirmación
    expect(wrapper.find('.fixed.inset-0.flex.items-center.justify-center').exists()).toBe(true)
    expect(wrapper.html()).toContain('Confirmar eliminación')
    
    // Click en el botón "Eliminar" del modal
    const confirmButton = wrapper.findAll('.bg-red-600')[0]
    await confirmButton.trigger('click')
    
    // Verificar que se emite el evento delete con el id correcto
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')[0]).toEqual(['1'])
    
    // Verificar que el modal se cierra
    expect(wrapper.find('.fixed.inset-0.flex.items-center.justify-center').exists()).toBe(false)
  })

  it('no emite el evento delete cuando se cancela la eliminación', async () => {
    // Click en el botón eliminar del primer libro
    const deleteButton = wrapper.findAll('tbody tr')[0].find('button')
    await deleteButton.trigger('click')
    
    // Click en el botón "Cancelar" del modal
    const cancelButton = wrapper.find('.text-gray-700')
    await cancelButton.trigger('click')
    
    // Verificar que no se emite el evento delete
    expect(wrapper.emitted('delete')).toBeFalsy()
    
    // Verificar que el modal se cierra
    expect(wrapper.find('.fixed.inset-0.flex.items-center.justify-center').exists()).toBe(false)
  })

  it('emite el evento page-change cuando se hace click en siguiente', async () => {
    // Cambiar la paginación para que haya más de una página
    await wrapper.setProps({
      pagination: {
        ...mockPagination,
        pages: 2
      }
    })
    
    // Click en el botón "Siguiente"
    const nextPageButton = wrapper.findAll('button')[1]
    await nextPageButton.trigger('click')
    
    // Verificar que se emite el evento page-change con el número correcto
    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')[0]).toEqual([2])
  })

  it('muestra un mensaje cuando no hay libros', async () => {
    await wrapper.setProps({
      books: []
    })
    
    const emptyMessage = wrapper.find('td[colspan="5"]')
    expect(emptyMessage.exists()).toBe(true)
    expect(emptyMessage.text()).toContain('No hay libros disponibles')
  })

  it('deshabilita botones de paginación según la página actual', async () => {
    // Caso 1: Primera página (botón "Anterior" debería estar deshabilitado)
    await wrapper.setProps({
      pagination: {
        page: 1,
        limit: 10,
        total: 30,
        pages: 3
      }
    })
    
    const paginationButtons = wrapper.findAll('button')
    const prevButton = paginationButtons[0]
    const nextButton = paginationButtons[1]
    
    expect(prevButton.attributes('disabled')).toBeDefined()
    expect(nextButton.attributes('disabled')).toBeUndefined()
    
    // Caso 2: Última página (botón "Siguiente" debería estar deshabilitado)
    await wrapper.setProps({
      pagination: {
        page: 3,
        limit: 10,
        total: 30,
        pages: 3
      }
    })
    
    expect(prevButton.attributes('disabled')).toBeUndefined()
    expect(nextButton.attributes('disabled')).toBeDefined()
  })

  it('formatea correctamente ISBN-10 e ISBN-13', async () => {
    // Libro con ISBN-10
    const booksWithDifferentISBNs = [
      {
        ...mockBooks[0],
        isbn: '0132350882' // ISBN-10
      },
      {
        ...mockBooks[1],
        isbn: '9783161484100' // ISBN-13
      }
    ];
    
    await wrapper.setProps({
      books: booksWithDifferentISBNs
    });
    
    const isbnElements = wrapper.findAll('td:nth-child(3)');
    
    // Verificar que el ISBN-10 está formateado (contiene guiones)
    const isbn10Text = isbnElements[0].text().trim();
    expect(isbn10Text).toContain('-');
    expect(isbn10Text.split('-').length).toBeGreaterThan(1);
    
    // Verificar que el ISBN-13 está formateado (contiene guiones)
    const isbn13Text = isbnElements[1].text().trim();
    expect(isbn13Text).toContain('-');
    expect(isbn13Text.split('-').length).toBeGreaterThan(1);
    
    // Verificar que el formato es diferente para ISBN-10 e ISBN-13
    const isbn10Parts = isbn10Text.split('-').length;
    const isbn13Parts = isbn13Text.split('-').length;
    expect(isbn10Parts).not.toEqual(isbn13Parts);
  })
})
