// Interfaces principales para el dominio

/**
 * Artículo del blog
 */
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  bookIds: string[];
  relatedLinks: Array<{ text: string; url: string }>;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleCreate {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  bookIds: string[];
  relatedLinks: Array<{ text: string; url: string }>;
  slug: string;
}

export interface ArticleUpdate {
  title?: string;
  excerpt?: string;
  content?: string;
  bookIds?: string[];
  relatedLinks?: Array<{ text: string; url: string }>;
  slug?: string;
}

/**
 * Libro de la biblioteca
 */
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  purchaseLink: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookCreate {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  purchaseLink?: string | null;
}

export interface BookUpdate {
  title?: string;
  author?: string;
  isbn?: string;
  description?: string;
  purchaseLink?: string | null;
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
