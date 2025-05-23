import { toRef, reactive, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { httpClient } from '@/utils/httpClient'
import { Article, ArticleCreate, ArticleUpdate, PaginatedResponse } from '@/types/models'
import { API_ENDPOINTS } from '@/types/api'

const ARTICLES_KEY = 'articles'

export function useArticles() {
  const queryClient = useQueryClient()
  const state = reactive({
    currentPage: 1,
    itemsPerPage: 10,
    searchTerm: ''
  })

  // Obtener listado de artículos
  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    error: articlesError
  } = useQuery({
    queryKey: [ARTICLES_KEY, state.currentPage, state.itemsPerPage, state.searchTerm],
    queryFn: getArticles
  })

  // Obtener un artículo
  async function getArticle(id: string): Promise<Article> {
    const response = await httpClient.get<Article>(`${API_ENDPOINTS.ARTICLES}/${id}`)
    return response
  }

  // Obtener artículos con paginación
  async function getArticles(): Promise<PaginatedResponse<Article>> {
    const params = {
      page: state.currentPage,
      limit: state.itemsPerPage,
      search: state.searchTerm || undefined
    }

    const response = await httpClient.get<PaginatedResponse<Article>>(
      API_ENDPOINTS.ARTICLES,
      { params }
    )
    return response
  }

  // Crear artículo
  const createArticleMutation = useMutation({
    mutationFn: (article: ArticleCreate) =>
      httpClient.post<Article>(API_ENDPOINTS.ARTICLES, article),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ARTICLES_KEY] })
    }
  })

  // Actualizar artículo
  const updateArticleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ArticleUpdate }) =>
      httpClient.patch<Article>(`${API_ENDPOINTS.ARTICLES}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ARTICLES_KEY] })
    }
  })

  // Eliminar artículo
  const deleteArticleMutation = useMutation({
    mutationFn: (id: string) =>
      httpClient.delete<void>(`${API_ENDPOINTS.ARTICLES}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ARTICLES_KEY] })
    }
  })

  // Computados
  const articles = computed(() => articlesData.value?.items || [])
  const pagination = computed(() => ({
    page: articlesData.value?.page || 1,
    limit: articlesData.value?.limit || 10,
    total: articlesData.value?.total || 0,
    pages: articlesData.value?.totalPages || 1
  }))

  return {
    // Estado reactivo
    currentPage: toRef(state, 'currentPage'),
    itemsPerPage: toRef(state, 'itemsPerPage'),
    searchTerm: toRef(state, 'searchTerm'),

    // Datos computados
    articles,
    pagination,

    // Estados de carga
    isLoadingArticles,
    isCreatingArticle: createArticleMutation.isLoading,
    isUpdatingArticle: updateArticleMutation.isLoading,
    isDeletingArticle: deleteArticleMutation.isLoading,

    // Errores
    articlesError: articlesError.value,
    createArticleError: createArticleMutation.error,
    updateArticleError: updateArticleMutation.error,
    deleteArticleError: deleteArticleMutation.error,

    // Métodos
    getArticle,
    getArticles,
    createArticle: createArticleMutation.mutateAsync,
    updateArticle: updateArticleMutation.mutateAsync,
    deleteArticle: deleteArticleMutation.mutateAsync
  }
}
