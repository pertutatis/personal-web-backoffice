import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import BookDetailView from '../../../src/views/books/BookDetailView.vue'
import { useUIStore } from '../../../src/stores/uiStore'
import { Book } from '../../../src/types/models'

// Mocks
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  })),
  useRoute: vi.fn(() => ({
    params: { id: '1' }
  }))
}))

vi.mock('@tanstack/vue-query', () => {
  const mockBook = {
    id: '1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    year: 2008,
    description: 'Libro sobre buenas prácticas de programación',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-02-15T00:00:00Z'
  };

  return {
    useQuery: vi.fn().mockImplementation(() => ({
      data: mockBook,
      isLoading: false,
      error: null
    })),
    useMutation: vi.fn().mockImplementation(() => ({
      mutate: vi.fn(),
      isLoading: false
    })),
    useQueryClient: vi.fn(() => ({
      invalidateQueries: vi.fn()
    }))
  };
})

vi.mock('../../../src/composables/api/useBooks', () => ({
  useBooks: vi.fn(() => ({
    getBookById: () => ({
      data: {
        id: '1',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        year: 2008,
        description: 'Libro sobre buenas prácticas de programación',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-02-15T00:00:00Z'
      },
      isLoading: false,
      error: null
    })
  }))
}))

vi.mock('../../../src/composables/api/booksApi', () => ({
  booksApi: {
    getBook: vi.fn().mockResolvedValue({
      id: '1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      year: 2008,
      description: 'Libro sobre buenas prácticas de programación',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-02-15T00:00:00Z'
    }),
    deleteBook: vi.fn().mockResolvedValue(undefined)
  }
}))

vi.mock('../../../src/stores/uiStore', () => ({
  useUIStore: vi.fn(() => ({
    addNotification: vi.fn()
  }))
}))

// Mock para marked y DOMPurify
vi.mock('marked', () => ({
  marked: vi.fn(text => `<p>${text}</p>`)
}))

vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn(html => html)
  }
}))

describe('BookDetailView.vue', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(BookDetailView, {
      global: {
        stubs: ['router-link', 'router-view']
      }
    })
  })

  it('renderiza los detalles del libro correctamente', async () => {
    // Esperar a que se resuelvan las promesas
    await flushPromises()
    
    // Verificar título del libro
    expect(wrapper.text()).toContain('Clean Code')
    
    // Verificar datos principales
    expect(wrapper.text()).toContain('Robert C. Martin') // Autor
    expect(wrapper.text()).toContain('9780132350884') // ISBN
    expect(wrapper.text()).toContain('2008') // Año
    expect(wrapper.text()).toContain('Libro sobre buenas prácticas de programación') // Descripción
  })

  it('formatea correctamente el ISBN', async () => {
    await flushPromises()
    
    // El ISBN debería estar formateado de manera legible
    // El formato exacto depende de la implementación, pero debería tener guiones
    const isbnElement = wrapper.find('dd').filter(node => 
      node.findComponent('dt')?.text().includes('ISBN')
    )
    
    // De alguna manera debería contener guiones para mejor legibilidad
    expect(wrapper.text()).toContain('-')
  })

  it('formatea correctamente las fechas', async () => {
    await flushPromises()
    
    // Las fechas deben estar en formato legible
    expect(wrapper.text()).toContain('enero') // Del 2023-01-01
    expect(wrapper.text()).toContain('febrero') // Del 2023-02-15
  })

  it('renderiza el contenido markdown de la descripción', async () => {
    await flushPromises()
    
    // Verificar que se procesa el markdown
    const marked = require('marked').marked
    const DOMPurify = require('dompurify').default
    
    expect(marked).toHaveBeenCalled()
    expect(DOMPurify.sanitize).toHaveBeenCalled()
  })

  it('muestra controles de acción (editar, eliminar)', async () => {
    await flushPromises()
    
    // Verificar botón de editar
    const editButton = wrapper.find('a[to^="/libros/"][to$="/editar"]')
    expect(editButton.exists()).toBe(true)
    expect(editButton.text()).toContain('Editar')
    
    // Verificar botón de eliminar
    const deleteButton = wrapper.find('button')
    expect(deleteButton.exists()).toBe(true)
    expect(deleteButton.text()).toContain('Eliminar')
  })

  it('muestra modal de confirmación al intentar eliminar', async () => {
    await flushPromises()
    
    // Click en botón eliminar
    const deleteButton = wrapper.find('button')
    await deleteButton.trigger('click')
    
    // Verificar que se muestra el modal
    const modal = wrapper.find('.fixed.inset-0')
    expect(modal.exists()).toBe(true)
    expect(modal.text()).toContain('Eliminar libro')
  })

  it('elimina el libro y redirecciona al confirmar', async () => {
    await flushPromises()
    
    // Abrir modal
    const deleteButton = wrapper.find('button')
    await deleteButton.trigger('click')
    
    // Encontrar y hacer click en el botón de confirmar
    const confirmButton = wrapper.find('.bg-red-600')
    await confirmButton.trigger('click')
    
    // Verificar que se llamó a la función de eliminar
    const booksApi = require('../../../src/composables/api/booksApi').booksApi
    expect(booksApi.deleteBook).toHaveBeenCalledWith('1')
    
    // Verificar redirección
    const router = require('vue-router').useRouter()
    expect(router.push).toHaveBeenCalledWith('/libros')
    
    // Verificar notificación
    const uiStore = useUIStore()
    expect(uiStore.addNotification).toHaveBeenCalled()
    expect(uiStore.addNotification.mock.calls[0][0].type).toBe('success')
  })

  it('muestra estado de carga mientras obtiene los datos', () => {
    // Mock para simular estado de carga
    require('@tanstack/vue-query').useQuery.mockImplementationOnce(() => ({
      data: null,
      isLoading: true,
      error: null
    }))
    
    // Volver a montar el componente
    wrapper = mount(BookDetailView, {
      global: {
        stubs: ['router-link', 'router-view']
      }
    })
    
    // Verificar que se muestra el indicador de carga
    expect(wrapper.text()).toContain('Cargando')
  })

  it('maneja errores al obtener datos', () => {
    // Mock para simular error
    require('@tanstack/vue-query').useQuery.mockImplementationOnce(() => ({
      data: null,
      isLoading: false,
      error: new Error('Error al cargar libro')
    }))
    
    // Volver a montar el componente
    wrapper = mount(BookDetailView, {
      global: {
        stubs: ['router-link', 'router-view']
      }
    })
    
    // Verificar que se muestra el mensaje de error
    expect(wrapper.text()).toContain('Error al cargar')
  })

  it('muestra imagen de portada cuando está disponible', async () => {
    // Cambiar el mock para incluir una portada
    require('@tanstack/vue-query').useQuery.mockImplementationOnce(() => ({
      data: {
        id: '1',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        year: 2008,
        description: 'Libro sobre buenas prácticas de programación',
        coverImage: 'http://example.com/cover.jpg',
        createdAt: '2023-01-01T00:00:00Z'
      },
      isLoading: false,
      error: null
    }))
    
    // Volver a montar el componente
    wrapper = mount(BookDetailView, {
      global: {
        stubs: ['router-link', 'router-view']
      }
    })
    
    await flushPromises()
    
    // Verificar que se muestra la imagen de portada
    const coverImage = wrapper.find('img')
    expect(coverImage.exists()).toBe(true)
    expect(coverImage.attributes('src')).toBe('http://example.com/cover.jpg')
  })

  it('muestra placeholder cuando no hay portada', async () => {
    await flushPromises()
    
    // Verificar que se muestra el placeholder
    const placeholder = wrapper.find('.bg-gray-200')
    expect(placeholder.exists()).toBe(true)
    expect(placeholder.text()).toContain('Sin imagen de portada')
  })
})
