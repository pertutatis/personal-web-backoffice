import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useArticles } from '../../../src/composables/api/useArticles'
import { articlesApi } from '../../../src/composables/api/articlesApi'

// Mock para Vue Query
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn().mockImplementation((key, fn, options) => {
    return {
      data: ref({ 
        data: [
          {
            id: '1',
            title: 'Artículo de prueba',
            content: 'Contenido de prueba',
            status: 'draft',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: null
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

// Mock para articlesApi
vi.mock('../../../src/composables/api/articlesApi', () => ({
  articlesApi: {
    getArticles: vi.fn().mockResolvedValue({
      data: [
        {
          id: '1',
          title: 'Artículo de prueba',
          content: 'Contenido de prueba',
          status: 'draft',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: null
        }
      ],
      page: 1,
      limit: 10,
      total: 1,
      pages: 1
    }),
    getArticle: vi.fn().mockResolvedValue({
      id: '1',
      title: 'Artículo de prueba',
      content: 'Contenido de prueba',
      status: 'draft',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: null
    }),
    createArticle: vi.fn().mockImplementation((article) => Promise.resolve({
      ...article,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: null
    })),
    updateArticle: vi.fn().mockImplementation((id, data) => Promise.resolve({
      id,
      ...data,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z'
    })),
    deleteArticle: vi.fn().mockResolvedValue(undefined)
  }
}))

describe('useArticles composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('proporciona artículos y datos de paginación', () => {
    const { articles, pagination } = useArticles()
    
    expect(articles.value).toHaveLength(1)
    expect(articles.value[0]).toEqual({
      id: '1',
      title: 'Artículo de prueba',
      content: 'Contenido de prueba',
      status: 'draft',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: null
    })
    
    expect(pagination.value).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      pages: 1
    })
  })

  it('cambia la página en queryParams al llamar a changePage', () => {
    const { queryParams, changePage } = useArticles()
    
    expect(queryParams.value.page).toBe(1)
    changePage(2)
    expect(queryParams.value.page).toBe(2)
  })

  it('cambia el límite y resetea la página al llamar a changeLimit', () => {
    const { queryParams, changeLimit } = useArticles()
    
    // Primero cambiamos de página para verificar que se resetea
    queryParams.value.page = 3
    
    expect(queryParams.value.limit).toBe(10)
    changeLimit(20)
    expect(queryParams.value.limit).toBe(20)
    expect(queryParams.value.page).toBe(1) // Debería resetearse a 1
  })

  it('proporciona una función getArticleById que devuelve un artículo', () => {
    const { getArticleById } = useArticles()
    
    const result = getArticleById('1')
    expect(result).toBeDefined()
    expect(result.data).toBeDefined()
  })

  it('proporciona funciones de mutación para crear, actualizar y eliminar artículos', () => {
    const { 
      createArticle, 
      updateArticle, 
      deleteArticle,
      isCreatingArticle,
      isUpdatingArticle,
      isDeletingArticle
    } = useArticles()
    
    expect(createArticle).toBeDefined()
    expect(typeof createArticle).toBe('function')
    
    expect(updateArticle).toBeDefined()
    expect(typeof updateArticle).toBe('function')
    
    expect(deleteArticle).toBeDefined()
    expect(typeof deleteArticle).toBe('function')
    
    // Verificar que los estados de carga están disponibles
    expect(isCreatingArticle).toBeDefined()
    expect(isCreatingArticle.value).toBe(false)
    
    expect(isUpdatingArticle).toBeDefined()
    expect(isUpdatingArticle.value).toBe(false)
    
    expect(isDeletingArticle).toBeDefined()
    expect(isDeletingArticle.value).toBe(false)
  })
})
