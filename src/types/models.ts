// Interfaces principales para el dominio

/**
 * Artículo del blog
 */
export interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  status: ArticleStatus;
  relatedBookIds?: string[];
}

export type ArticleStatus = 'draft' | 'published';

export interface ArticleCreate {
  id: string;
  title: string;
  content: string;
  status: ArticleStatus;
  relatedBookIds?: string[];
}

export interface ArticleUpdate {
  title?: string;
  content?: string;
  status?: ArticleStatus;
  relatedBookIds?: string[];
}

/**
 * Libro de la biblioteca
 */
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  year: number;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BookCreate {
  id: string;
  title: string;
  author: string;
  isbn: string;
  year: number;
  description?: string;
}

export interface BookUpdate {
  title?: string;
  author?: string;
  isbn?: string;
  year?: number;
  description?: string;
}

/**
 * Respuesta paginada para listados
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * Parámetros de consulta para paginación y filtrado
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

/**
 * Error de API
 */
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  details?: any;
}
