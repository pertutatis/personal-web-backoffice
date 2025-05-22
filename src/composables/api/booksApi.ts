/**
 * Servicios API para libros
 */
import { httpClient } from '../../utils/httpClient';
import { Book, BookCreate, BookUpdate, PaginatedResponse, QueryParams } from '../../types/models';

const BOOKS_ENDPOINT = '/backoffice/books';

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
   * @returns Promise que se resuelve cuando la creación es exitosa
   * No espera un cuerpo de respuesta, solo maneja el código 201
   */
  createBook(book: BookCreate): Promise<void> {
    return httpClient.post<void>(BOOKS_ENDPOINT, book);
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
