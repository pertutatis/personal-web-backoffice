import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { ref, computed } from 'vue';
import { booksApi } from './booksApi';
import { Book, BookCreate, BookUpdate, PaginatedResponse, QueryParams } from '../types/models';

export function useBooks() {
  const queryClient = useQueryClient();
  
  // Estado para paginación
  const queryParams = ref<QueryParams>({
    page: 1,
    limit: 10,
  });

  // Obtener listado de libros paginados
  const {
    data: booksData,
    isLoading: isLoadingBooks,
    isError: isBooksError,
    error: booksError,
    refetch: refetchBooks
  } = useQuery({
    // Query key que incluye los params de paginación para cache
    queryKey: ['books', queryParams.value],
    // Query function
    queryFn: () => booksApi.getBooks(queryParams.value),
    keepPreviousData: true, // Mantiene datos previos mientras carga
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Obtener un libro por ID
  const getBookById = (id: string) => {
    return useQuery({
      queryKey: ['book', id],
      queryFn: () => booksApi.getBook(id),
      staleTime: 1000 * 60 * 5, // 5 minutos
      enabled: !!id, // Solo ejecuta si hay ID
    }
    );
  };

  // Crear un libro nuevo
  const createBookMutation = useMutation({
    mutationFn: (book: BookCreate) => booksApi.createBook(book),
    onSuccess: () => {
      // Invalidar consultas para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });

  // Actualizar un libro
  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BookUpdate }) => 
      booksApi.updateBook(id, data),
    onSuccess: (_, variables) => {
      // Invalidar consultas específicas
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', variables.id] });
      },
    }
  );

  // Eliminar un libro
  const deleteBookMutation = useMutation({
    mutationFn: (id: string) => booksApi.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  // Exposed computed values
  const books = computed(() => booksData.value?.data || []);
  const pagination = computed(() => ({
    page: booksData.value?.page || 1,
    limit: booksData.value?.limit || 10,
    total: booksData.value?.total || 0,
    pages: booksData.value?.pages || 0
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
    books,
    pagination,
    isLoadingBooks,
    isBooksError,
    booksError,
    refetchBooks,
    queryParams,
    changePage,
    changeLimit,

    // Single book query
    getBookById,

    // Mutations
    createBook: createBookMutation.mutateAsync,
    isCreatingBook: createBookMutation.isLoading,
    createBookError: createBookMutation.error,

    updateBook: updateBookMutation.mutateAsync,
    isUpdatingBook: updateBookMutation.isLoading,
    updateBookError: updateBookMutation.error,

    deleteBook: deleteBookMutation.mutateAsync,
    isDeletingBook: deleteBookMutation.isLoading,
    deleteBookError: deleteBookMutation.error
  };
}
