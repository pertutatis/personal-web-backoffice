import { httpClient } from '@/utils/httpClient'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Book } from '@/types/models'

export function useBooks() {
  const queryClient = useQueryClient()

  const getBooks = () => {
    return useQuery<Book[]>({
      queryKey: ['books'],
      queryFn: () => httpClient.get('/backoffice/books')
    })
  }

  const getBookById = (id: string) => {
    return useQuery<Book>({
      queryKey: ['books', id],
      queryFn: () => httpClient.get(`/backoffice/books/${id}`)
    })
  }

  const createBookMutation = () => {
    return useMutation({
      mutationFn: (book: Omit<Book, 'id'>) => 
        httpClient.post('/backoffice/books', book),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['books'] })
      }
    })
  }

  const updateBookMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<Book> }) =>
        httpClient.put(`/backoffice/books/${id}`, data),
      onSuccess: (_data, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['books', id] })
        queryClient.invalidateQueries({ queryKey: ['books'] })
      }
    })
  }

  const deleteBookMutation = () => {
    return useMutation({
      mutationFn: (id: string) => 
        httpClient.delete(`/backoffice/books/${id}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['books'] })
      }
    })
  }

  return {
    getBooks,
    getBookById,
    createBookMutation,
    updateBookMutation,
    deleteBookMutation
  }
}
