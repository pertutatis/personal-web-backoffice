import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ArticleTable from '../../../src/components/articles/ArticleTable.vue'
import { Article } from '../../../src/types/models'

describe('ArticleTable.vue', () => {
  // Datos de prueba
  const mockArticles: Article[] = [
    {
      id: '1',
      title: 'Primer artículo',
      content: 'Contenido del primer artículo',
      status: 'published',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      relatedBookIds: []
    },
    {
      id: '2',
      title: 'Segundo artículo',
      content: 'Contenido del segundo artículo',
      status: 'draft',
      createdAt: '2023-01-03T00:00:00Z',
      updatedAt: null,
      relatedBookIds: ['book1', 'book2']
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
    wrapper = mount(ArticleTable, {
      props: {
        articles: mockArticles,
        pagination: mockPagination,
        loading: false
      }
    })
  })

  it('renderiza correctamente la tabla con artículos', () => {
    expect(wrapper.find('table').exists()).toBe(true)
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
    
    // Verificar que se muestran los títulos de los artículos
    expect(rows[0].text()).toContain('Primer artículo')
    expect(rows[1].text()).toContain('Segundo artículo')
  })

  it('muestra el estado correcto para cada artículo', () => {
    const statusElements = wrapper.findAll('.px-2.inline-flex.text-xs')
    expect(statusElements[0].text()).toBe('Publicado')
    expect(statusElements[1].text()).toBe('Borrador')
    
    // Verificar las clases de estado
    expect(statusElements[0].classes()).toContain('bg-green-100')
    expect(statusElements[1].classes()).toContain('bg-yellow-100')
  })

  it('formatea las fechas correctamente', () => {
    const dateElements = wrapper.findAll('td:nth-child(3)')
    expect(dateElements[0].text()).not.toBe('2023-01-01T00:00:00Z')
    // La fecha exacta dependerá del locale, así que verificamos que no sea el formato raw
    expect(dateElements[0].text()).not.toContain('T')
    expect(dateElements[0].text()).not.toContain('Z')
  })

  it('muestra "N/A" cuando updatedAt es null', () => {
    const updatedAtElements = wrapper.findAll('td:nth-child(4)')
    expect(updatedAtElements[1].text()).toBe('N/A')
  })

  it('muestra los botones de acción correctamente', () => {
    const firstRowActions = wrapper.findAll('tbody tr')[0].findAll('.flex.justify-end a, .flex.justify-end button')
    expect(firstRowActions.length).toBe(3)
    
    expect(firstRowActions[0].text()).toBe('Ver')
    expect(firstRowActions[1].text()).toBe('Editar')
    expect(firstRowActions[2].text()).toBe('Eliminar')
  })

  it('emite el evento delete cuando se confirma la eliminación', async () => {
    // Click en el botón eliminar del primer artículo
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
    // Click en el botón eliminar del primer artículo
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

  it('muestra un mensaje cuando no hay artículos', async () => {
    await wrapper.setProps({
      articles: []
    })
    
    const emptyMessage = wrapper.find('td[colspan="5"]')
    expect(emptyMessage.exists()).toBe(true)
    expect(emptyMessage.text()).toContain('No hay artículos disponibles')
  })
})
