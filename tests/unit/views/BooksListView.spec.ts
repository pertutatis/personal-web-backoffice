import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import BooksListView from '../../../src/views/books/BooksListView.vue'
import { useUIStore } from '../../../src/stores/uiStore'
import { Book } from '../../../src/types/models'

// Mocks
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  })),
  useRoute: vi.fn(() => ({
    params: {},
    query: {}
  }))
}))

vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn().mockImplementation(() => ({
    isLoading: false,
    refetch: vi.fn()
  }))
}))

vi.mock('../../../src/composables/api/booksApi', () => ({
  booksApi: {
    getBooks: vi.fn().mockImplementation(() => Promise.resolve({
      items: [
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
      ],
      total: 2,
      page: 1,
      limit: 10,
      pages: 1
    })),
    deleteBook: vi.fn().mockImplementation(() => Promise.resolve())
  }
}))

vi.mock('../../../src/stores/uiStore', () => ({
  useUIStore: vi.fn(() => ({
    addNotification: vi.fn()
  }))
}))

describe('BooksListView.vue', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(BooksListView, {
      global: {
        stubs: ['router-link', 'router-view']
      }
    })
  })

  it('renderiza el título y las acciones del encabezado', () => {
    // Verificar título
    expect(wrapper.find('h2').exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('Libros')
    
    // Verificar botón de nuevo libro
    const newButton = wrapper.find('.new-button')
    expect(newButton.exists()).toBe(true)
    expect(newButton.text()).toBe('Nuevo Libro')
    expect(newButton.attributes('to')).toBe('/libros/nuevo')
  })

  it('renderiza la tabla de libros cuando hay datos', async () => {
    // Esperar a que se resuelvan las promesas
    await flushPromises()
    
    // Verificar que la tabla existe
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
    
    // Verificar filas de la tabla
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
    
    // Verificar que se muestran los títulos de los libros
    expect(rows[0].text()).toContain('Clean Code')
    expect(rows[1].text()).toContain('Domain-Driven Design')
  })

  it('muestra mensaje cuando no hay libros', async () => {
    // Sobrescribir el mock de getBooks para que devuelva una lista vacía
    const booksApi = require('../../../src/composables/api/booksApi').booksApi
    booksApi.getBooks.mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      pages: 0
    })
    
    // Volver a montar el componente
    wrapper = mount(BooksListView, {
      global: {
        stubs: ['router-link', 'router-view']
      }
    })
    
    // Esperar a que se resuelvan las promesas
    await flushPromises()
    
    // Verificar que se muestra el mensaje de vacío
    expect(wrapper.text()).toContain('No hay libros')
  })

  it('actualiza los resultados al buscar', async () => {
    // Esperar a que se resuelvan las promesas iniciales
    await flushPromises()
    
    // Buscar por "Domain"
    const searchInput = wrapper.find('input[placeholder="Buscar libros..."]')
    await searchInput.setValue('Domain')
    
    // Simular que ha pasado el tiempo de debounce
    await vi.runAllTimersAsync()
    
    // Verificar que se llamó a refetch
    const booksApi = require('../../../src/composables/api/booksApi').booksApi
    expect(booksApi.getBooks).toHaveBeenCalled()
  })

  it('abre modal de confirmación al intentar eliminar', async () => {
    // Esperar a que se resuelvan las promesas iniciales
    await flushPromises()
    
    // Buscar botón eliminar y hacer clic
    const deleteButton = wrapper.find('button[title="Eliminar"]')
    await deleteButton.trigger('click')
    
    // Verificar que se muestra el modal
    const modal = wrapper.find('.modal-backdrop')
    expect(modal.exists()).toBe(true)
    expect(modal.text()).toContain('Confirmar Eliminación')
  })

  it('elimina libro al confirmar en el modal', async () => {
    // Esperar a que se resuelvan las promesas iniciales
    await flushPromises()
    
    // Abrir modal primero
    const deleteButton = wrapper.find('button[title="Eliminar"]')
    await deleteButton.trigger('click')
    
    // Confirmar eliminación
    const confirmButton = wrapper.find('.confirm-button')
    await confirmButton.trigger('click')
    
    // Verificar que se llamó a deleteBook
    const booksApi = require('../../../src/composables/api/booksApi').booksApi
    expect(booksApi.deleteBook).toHaveBeenCalled()
    
    // Verificar que se muestra notificación
    const uiStore = useUIStore()
    expect(uiStore.addNotification).toHaveBeenCalled()
  })

  it('muestra estado de carga mientras obtiene los libros', async () => {
    // Mock para simular estado de carga
    const mockQuery = require('@tanstack/vue-query').useQuery
    mockQuery.mockImplementationOnce(() => ({
      isLoading: true,
      refetch: vi.fn()
    }))
    
    // Volver a montar el componente
    wrapper = mount(BooksListView, {
      global: {
        stubs: ['router-link', 'router-view']
      }
    })
    
    // Verificar que se muestra el indicador de carga
    const loadingContainer = wrapper.find('.loading-container')
    expect(loadingContainer.exists()).toBe(true)
    expect(loadingContainer.text()).toContain('Cargando libros')
  })

  it('maneja errores de la API', async () => {
    // Mock para simular error en la API
    const booksApi = require('../../../src/composables/api/booksApi').booksApi
    booksApi.getBooks.mockRejectedValueOnce(new Error('Error de API'))
    
    // Volver a montar el componente
    wrapper = mount(BooksListView, {
      global: {
        stubs: ['router-link', 'router-view']
      }
    })
    
    // Esperar a que se resuelvan las promesas
    await flushPromises()
    
    // Verificar que se muestra el error
    const errorContainer = wrapper.find('.error-container')
    expect(errorContainer.exists()).toBe(true)
    expect(errorContainer.text()).toContain('Error al cargar los libros')
    
    // Verificar que se muestra botón de reintentar
    const retryButton = wrapper.find('.retry-button')
    expect(retryButton.exists()).toBe(true)
    
    // Probar botón de reintentar
    await retryButton.trigger('click')
    expect(booksApi.getBooks).toHaveBeenCalledTimes(2) // Una vez en el montaje y otra al reintentar
  })
})
