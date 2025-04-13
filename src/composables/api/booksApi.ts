/**
 * Servicios API para libros
 */
import { httpClient } from '../../utils/httpClient';
import { Book, BookCreate, BookUpdate, PaginatedResponse, QueryParams } from '../../types/models';

const BOOKS_ENDPOINT = '/blog/books';

export const booksApi = {
  /**
   * Obtiene un listado paginado de libros
   */
  getBooks(params?: QueryParams): Promise<PaginatedResponse<Book>> {
    return httpClient.get<PaginatedResponse<Book>>(BOOKS_ENDPOINT, { params });
  },

  /**
   * Obtiene un libro por ID
   */
  getBook(id: string): Promise<Book> {
    return httpClient.get<Book>(`${BOOKS_ENDPOINT}/${id}`);
  },

  /**
   * Crea un nuevo libro
   */
  createBook(book: BookCreate): Promise<Book> {
    return httpClient.post<Book>(BOOKS_ENDPOINT, book);
  },

  /**
   * Actualiza un libro existente
   */
  updateBook(id: string, book: BookUpdate): Promise<Book> {
    return httpClient.put<Book>(`${BOOKS_ENDPOINT}/${id}`, book);
  },

  /**
   * Elimina un libro
   */
  deleteBook(id: string): Promise<void> {
    return httpClient.delete<void>(`${BOOKS_ENDPOINT}/${id}`);
  }
};
