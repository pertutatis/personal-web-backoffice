import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { ref, computed } from 'vue';
import { articlesApi } from './articlesApi';
import { Article, ArticleCreate, ArticleUpdate, PaginatedResponse, QueryParams } from '../../types/models';

export function useArticles() {
  const queryClient = useQueryClient();
  
  // Estado para paginación
  const queryParams = ref<QueryParams>({
    page: 1,
    limit: 10,
  });

  // Obtener listado de artículos paginados
  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    isError: isArticlesError,
    error: articlesError,
    refetch: refetchArticles
  } = useQuery(
    // Query key que incluye los params de paginación para cache
    ['articles', queryParams],
    // Query function
    () => articlesApi.getArticles(queryParams.value),
    {
      keepPreviousData: true, // Mantiene datos previos mientras carga
      staleTime: 1000 * 60 * 5, // 5 minutos
    }
  );

  // Obtener un artículo por ID
  const getArticleById = (id: string) => {
    return useQuery(
      ['article', id],
      () => articlesApi.getArticle(id),
      {
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id, // Solo ejecuta si hay ID
      }
    );
  };

  // Crear un artículo nuevo
  const createArticleMutation = useMutation(
    (article: ArticleCreate) => articlesApi.createArticle(article),
    {
      onSuccess: () => {
        // Invalidar consultas para refrescar datos
        queryClient.invalidateQueries(['articles']);
      },
    }
  );

  // Actualizar un artículo
  const updateArticleMutation = useMutation(
    ({ id, data }: { id: string; data: ArticleUpdate }) => 
      articlesApi.updateArticle(id, data),
    {
      onSuccess: (_, variables) => {
        // Invalidar consultas específicas
        queryClient.invalidateQueries(['articles']);
        queryClient.invalidateQueries(['article', variables.id]);
      },
    }
  );

  // Eliminar un artículo
  const deleteArticleMutation = useMutation(
    (id: string) => articlesApi.deleteArticle(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['articles']);
      },
    }
  );

  // Exposed computed values
  const articles = computed(() => articlesData.value?.data || []);
  const pagination = computed(() => ({
    page: articlesData.value?.page || 1,
    limit: articlesData.value?.limit || 10,
    total: articlesData.value?.total || 0,
    pages: articlesData.value?.pages || 0
  }));

  // Cambiar página
  const changePage = (page: number) => {
    queryParams.value = {
      ...queryParams.value,
      page
    };
  };

  // Cambiar límite por página
  const changeLimit = (limit: number) => {
    queryParams.value = {
      ...queryParams.value,
      page: 1, // Reset a primera página
      limit
    };
  };

  return {
    // List queries
    articles,
    pagination,
    isLoadingArticles,
    isArticlesError,
    articlesError,
    refetchArticles,
    queryParams,
    changePage,
    changeLimit,

    // Single article query
    getArticleById,

    // Mutations
    createArticle: createArticleMutation.mutateAsync,
    isCreatingArticle: createArticleMutation.isLoading,
    createArticleError: createArticleMutation.error,

    updateArticle: updateArticleMutation.mutateAsync,
    isUpdatingArticle: updateArticleMutation.isLoading,
    updateArticleError: updateArticleMutation.error,

    deleteArticle: deleteArticleMutation.mutateAsync,
    isDeletingArticle: deleteArticleMutation.isLoading,
    deleteArticleError: deleteArticleMutation.error
  };
}
