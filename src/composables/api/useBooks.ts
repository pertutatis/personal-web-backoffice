import { toRef, reactive, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { httpClient } from '@/utils/httpClient'
import { Book, BookCreate, BookUpdate, PaginatedResponse } from '@/types/models'
import { API_ENDPOINTS } from '@/types/api'

const BOOKS_KEY = 'books'

export function useBooks() {
  const queryClient = useQueryClient()
  const state = reactive({
    currentPage: 1,
    itemsPerPage: 10,
    searchTerm: '',
    author: '',
    year: null as number | null
  })

  // Obtener listado de libros
  const {
    data: booksData,
    isLoading: isLoadingBooks,
    error: booksError
  } = useQuery({
    queryKey: [BOOKS_KEY, state.currentPage, state.itemsPerPage, state.searchTerm, state.author, state.year],
    queryFn: getBooks
  })

  // Obtener un libro
  async function getBook(id: string): Promise<Book> {
    const response = await httpClient.get<Book>(`${API_ENDPOINTS.BOOKS}/${id}`)
    return response
  }

  // Obtener libros con paginación
  async function getBooks(): Promise<PaginatedResponse<Book>> {
    const params = {
      page: state.currentPage,
      limit: state.itemsPerPage,
      search: state.searchTerm || undefined,
      author: state.author || undefined,
      year: state.year || undefined
    }

    const response = await httpClient.get<PaginatedResponse<Book>>(
      API_ENDPOINTS.BOOKS,
      { params }
    )
    return response
  }

  // Crear libro
  const createBookMutation = useMutation({
    mutationFn: (book: BookCreate) =>
      httpClient.post<Book>(API_ENDPOINTS.BOOKS, book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] })
    }
  })

  // Actualizar libro
  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BookUpdate }) =>
      httpClient.patch<Book>(`${API_ENDPOINTS.BOOKS}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] })
    }
  })

  // Eliminar libro
  const deleteBookMutation = useMutation({
    mutationFn: (id: string) =>
      httpClient.delete<void>(`${API_ENDPOINTS.BOOKS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] })
    }
  })

  // Computados
  const books = computed(() => booksData.value?.items || [])
  const pagination = computed(() => ({
    page: booksData.value?.page || 1,
    limit: booksData.value?.limit || 10,
    total: booksData.value?.total || 0,
    pages: booksData.value?.totalPages || 1
  }))

  // Filtros adicionales
  const filters = computed(() => ({
    author: state.author,
    year: state.year
  }))

  return {
    // Estado reactivo
    currentPage: toRef(state, 'currentPage'),
    itemsPerPage: toRef(state, 'itemsPerPage'),
    searchTerm: toRef(state, 'searchTerm'),
    author: toRef(state, 'author'),
    year: toRef(state, 'year'),

    // Datos computados
    books,
    pagination,
    filters,

    // Estados de carga
    isLoadingBooks,
    isCreatingBook: createBookMutation.isLoading,
    isUpdatingBook: updateBookMutation.isLoading,
    isDeletingBook: deleteBookMutation.isLoading,

    // Errores
    booksError: booksError.value,
    createBookError: createBookMutation.error,
    updateBookError: updateBookMutation.error,
    deleteBookError: deleteBookMutation.error,

    // Métodos
    getBook,
    getBooks,
    createBook: createBookMutation.mutateAsync,
    updateBook: updateBookMutation.mutateAsync,
    deleteBook: deleteBookMutation.mutateAsync
  }
}
