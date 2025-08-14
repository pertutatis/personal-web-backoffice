import { z } from 'zod'
import { ArticleStatus } from './models'

// Esquemas de validación para artículos
export const articleSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  status: z.nativeEnum(ArticleStatus),
  bookIds: z.array(z.string().uuid()).optional().default([]),
  relatedLinks: z.array(z.object({
    text: z.string(),
    url: z.string().url()
  })).optional().default([])
})

export const articleUpdateSchema = articleSchema.partial()

// Esquemas de validación para libros
export const bookSchema = z.object({
  title: z.string().min(3).max(100),
  author: z.string().min(3).max(100),
  isbn: z.string().regex(/^[\d-]{10,17}$/),
  description: z.string().min(10),
  purchaseLink: z.string().url().nullable().optional(),
  imageUrl: z.string().url().nullable().optional()
})

export const bookUpdateSchema = bookSchema.partial()

// Tipos inferidos
export type ArticleFormData = z.infer<typeof articleSchema>
export type ArticleUpdateFormData = z.infer<typeof articleUpdateSchema>
export type BookFormData = z.infer<typeof bookSchema>
export type BookUpdateFormData = z.infer<typeof bookUpdateSchema>

// Mensajes de error personalizados
export const validationMessages = {
  required: 'Este campo es requerido',
  minLength: (min: number) => `Debe tener al menos ${min} caracteres`,
  maxLength: (max: number) => `No puede tener más de ${max} caracteres`,
  email: 'Debe ser un email válido',
  url: 'Debe ser una URL válida',
  isbn: 'Debe ser un ISBN válido',
}

// Helpers de validación
export const isValidISBN = (isbn: string): boolean => {
  const cleanISBN = isbn.replace(/[-\s]/g, '')
  return /^(\d{10}|\d{13})$/.test(cleanISBN)
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const stripTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '')
}

export const sanitizeHtml = (html: string): string => {
  // Aquí usaríamos DOMPurify, pero lo dejamos como stub por ahora
  return html
}
