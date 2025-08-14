import { Article, Book, PaginatedResponse, PaginationParams } from './models'

// Tipos para peticiones genéricas
export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: number
}

export interface ApiError {
  message: string
  error: string
  statusCode: number
}

// Tipos para artículos
export interface ArticleQueryParams extends PaginationParams {
  status?: string
  bookId?: string
  tag?: string
}

export interface ArticleListResponse extends PaginatedResponse<Article> {}

export interface ArticleResponse {
  article: Article
}

// Tipos para libros
export interface BookQueryParams extends PaginationParams {
  author?: string
}

export interface BookListResponse extends PaginatedResponse<Book> {}

export interface BookResponse {
  book: Book
}

// Constantes para la API
export const API_ENDPOINTS = {
  ARTICLES: '/api/backoffice/articles',
  BOOKS: '/api/backoffice/books',
  AUTH: {
    LOGIN: '/api/backoffice/auth/login',
    REGISTER: '/api/backoffice/auth/register',
    REFRESH: '/api/backoffice/auth/refresh-token',
    LOGOUT: '/api/backoffice/auth/logout',
    RESET_PASSWORD: '/api/backoffice/auth/reset-password',
    PROFILE: '/api/backoffice/auth/profile'
  }
}

// Tipos de estado de la petición
export interface RequestState<T = any> {
  data: T | null
  error: string | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

// Helpers para crear estados iniciales
export const createInitialState = <T>(): RequestState<T> => ({
  data: null,
  error: null,
  isLoading: false,
  isSuccess: false,
  isError: false
})

// Tipos para opciones de petición
export interface RequestOptions {
  headers?: Record<string, string>
  params?: Record<string, string | number>
  signal?: AbortSignal
  timeout?: number
}

// Tipos para métodos HTTP
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// Tipos para transformación de respuestas
export type ResponseTransformer<T> = (response: any) => T

// Tipos para manejo de errores
export interface ErrorHandler {
  (error: any): void
  isHandled?: boolean
}

// Tipos para interceptores
export interface RequestInterceptor {
  (config: RequestOptions): Promise<RequestOptions> | RequestOptions
}

export interface ResponseInterceptor {
  (response: Response): Promise<Response> | Response
}

export interface ErrorInterceptor {
  (error: any): Promise<any>
}

// Configuración global de la API
export interface ApiConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
  errorHandler?: ErrorHandler
  requestInterceptors?: RequestInterceptor[]
  responseInterceptors?: ResponseInterceptor[]
  errorInterceptors?: ErrorInterceptor[]
}
