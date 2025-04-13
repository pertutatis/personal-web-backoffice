import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useBooks } from '../../../src/composables/api/useBooks'
import { booksApi } from '../../../src/composables/api/booksApi'

// Mock para Vue Query
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn().mockImplementation((key, fn, options) => {
    return {
      data: ref({ 
        data: [
          {
            id: '1',
            title: 'Libro de prueba',
            author: 'Autor de prueba',
            isbn: '9781234567890',
            year: 2023,
            description: 'Descripción de prueba',
            createdAt: '2023-01-01T00:00:00Z'
          }
        ],
        page: 1,
        limit: 10,
        total: 1,
        pages: 1
      }),
      isLoading: ref(false),
      isError: ref(false),
      error: ref(null),
      refetch: vi.fn()
    }
  }),
  useMutation: vi.fn().mockImplementation((fn, options) => {
    return {
      mutateAsync: vi.fn(),
      isLoading: ref(false),
      error: ref(null)
    }
  }),
  useQueryClient: vi.fn().mockReturnValue({
    invalidateQueries: vi.fn()
  })
}))

// Mock para booksApi
vi.mock('../../../src/composables/api/booksApi', () => ({
  booksApi: {
    getBooks: vi.fn().mockResolvedValue({
      data: [
        {
          id: '1',
          title: 'Libro de prueba',
          author: 'Autor de prueba',
          isbn: '9781234567890',
          year: 2023,
          description: 'Descripción de prueba',
          createdAt: '2023-01-01T00:00:00Z'
        }
      ],
      page: 1,
      limit: 10,
      total: 1,
      pages: 1
    }),
    getBook: vi.fn().mockResolvedValue({
      id: '1',
      title: 'Libro de prueba',
      author: 'Autor de prueba',
      isbn: '9781234567890',
      year: 2023,
      description: 'Descripción de prueba',
      createdAt: '2023-01-01T00:00:00Z'
    }),
    createBook: vi.fn().mockImplementation((book) => Promise.resolve({
      ...book,
      createdAt: '2023-01-01T00:00:00Z'
    })),
    updateBook: vi.fn().mockImplementation((id, data) => Promise.resolve({
      id,
      ...data,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z'
    })),
    deleteBook: vi.fn().mockResolvedValue(undefined)
  }
}))

describe('useBooks composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('proporciona libros y datos de paginación', () => {
    const { books, pagination } = useBooks()
    
    expect(books.value).toHaveLength(1)
    expect(books.value[0]).toEqual({
      id: '1',
      title: 'Libro de prueba',
      author: 'Autor de prueba',
      isbn: '9781234567890',
      year: 2023,
      description: 'Descripción de prueba',
      createdAt: '2023-01-01T00:00:00Z'
    })
    
    expect(pagination.value).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      pages: 1
    })
  })

  it('cambia la página en queryParams al llamar a changePage', () => {
    const { queryParams, changePage } = useBooks()
    
    expect(queryParams.value.page).toBe(1)
    changePage(2)
    expect(queryParams.value.page).toBe(2)
  })

  it('cambia el límite y resetea la página al llamar a changeLimit', () => {
    const { queryParams, changeLimit } = useBooks()
    
    // Primero cambiamos de página para verificar que se resetea
    queryParams.value.page = 3
    
    expect(queryParams.value.limit).toBe(10)
    changeLimit(20)
    expect(queryParams.value.limit).toBe(20)
    expect(queryParams.value.page).toBe(1) // Debería resetearse a 1
  })

  it('proporciona una función getBookById que devuelve un libro', () => {
    const { getBookById } = useBooks()
    
    const result = getBookById('1')
    expect(result).toBeDefined()
    expect(result.data).toBeDefined()
  })

  it('proporciona funciones de mutación para crear, actualizar y eliminar libros', () => {
    const { 
      createBook, 
      updateBook, 
      deleteBook,
      isCreatingBook,
      isUpdatingBook,
      isDeletingBook
    } = useBooks()
    
    expect(createBook).toBeDefined()
    expect(typeof createBook).toBe('function')
    
    expect(updateBook).toBeDefined()
    expect(typeof updateBook).toBe('function')
    
    expect(deleteBook).toBeDefined()
    expect(typeof deleteBook).toBe('function')
    
    // Verificar que los estados de carga están disponibles
    expect(isCreatingBook).toBeDefined()
    expect(isCreatingBook.value).toBe(false)
    
    expect(isUpdatingBook).toBeDefined()
    expect(isUpdatingBook.value).toBe(false)
    
    expect(isDeletingBook).toBeDefined()
    expect(isDeletingBook.value).toBe(false)
  })
})
