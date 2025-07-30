// Tipos base
export interface BaseModel {
  id: string
  createdAt: string
  updatedAt: string
}

// Tipos para artículos
export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export interface RelatedLink {
  text: string
  url: string
}

export interface Article extends BaseModel {
  title: string
  slug: string
  content: string
  excerpt: string
  status: ArticleStatus
  bookIds: string[]
  relatedLinks: RelatedLink[]
}

// Permitir id y slug opcionales en la creación
export interface ArticleCreate {
  id?: string
  title: string
  content: string
  excerpt: string
  status: ArticleStatus
  slug?: string
  bookIds?: string[]
  relatedLinks?: RelatedLink[]
}

export interface ArticleUpdate {
  title?: string
  content?: string
  excerpt?: string
  status?: ArticleStatus
  slug?: string
  bookIds?: string[]
  relatedLinks?: RelatedLink[]
}

// Tipos para libros
export interface Book extends BaseModel {
  title: string
  author: string
  isbn: string
  description: string
  purchaseLink: string | null
  year: number
  imageUrl: string | null
}

// Permitir id opcional en la creación
export interface BookCreate {
  id?: string
  title: string
  author: string
  isbn: string
  description: string
  purchaseLink?: string | null
  year: number
  imageUrl?: string | null
}

export interface BookUpdate {
  title?: string
  author?: string
  isbn?: string
  description?: string
  purchaseLink?: string | null
  year?: number
  imageUrl?: string | null
}

// Tipos para paginación
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

// Estados de carga
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

// Tipos para filtros
export interface FilterOption {
  label: string
  value: string | number
  count?: number
}

export interface Filters {
  [key: string]: FilterOption[]
}

// Tipos para ordenamiento
export interface SortOption {
  label: string
  value: string
  order: 'asc' | 'desc'
}

export type SortOptions = SortOption[]

// Tipos para sanitización HTML
export interface DOMPurifyOptions {
  ALLOWED_TAGS?: string[]
  ALLOWED_ATTR?: string[]
  KEEP_CONTENT?: boolean
  RETURN_DOM?: boolean
  RETURN_DOM_FRAGMENT?: boolean
  RETURN_TRUSTED_TYPE?: boolean
  SAFE_FOR_TEMPLATES?: boolean
}

export interface DOMPurifyResult {
  html: string
  isValid: boolean
  warnings: string[]
}
