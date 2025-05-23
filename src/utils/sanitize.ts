import DOMPurify, { DOMPurifyConfig } from 'dompurify'
import { DOMPurifyResult } from '@/types/models'

const DEFAULT_CONFIG: DOMPurifyConfig = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'strong', 'em', 'del', 'code', 'pre',
    'ul', 'ol', 'li',
    'blockquote',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title',
    'class', 'id', 'name',
    'target', 'rel'
  ],
  ADD_TAGS: [],
  ADD_ATTR: [],
  FORBID_TAGS: ['script', 'style'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick'],
  KEEP_CONTENT: true,
  SAFE_FOR_TEMPLATES: true
}

/**
 * Sanitiza contenido HTML
 */
export function sanitize(dirty: string | Node): string {
  try {
    // @ts-ignore - DOMPurify types are not fully accurate
    return DOMPurify.sanitize(dirty, DEFAULT_CONFIG)
  } catch (error) {
    console.error('Error sanitizando HTML:', error)
    return ''
  }
}

/**
 * Sanitiza HTML con resultado detallado
 */
export function sanitizeWithDetails(
  html: string,
  config: Partial<DOMPurifyConfig> = {}
): DOMPurifyResult {
  const warnings: string[] = []
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  try {
    // @ts-ignore - DOMPurify types are not fully accurate
    const cleanHtml = DOMPurify.sanitize(html, finalConfig)

    return {
      html: cleanHtml,
      isValid: true,
      warnings
    }
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : 'Error desconocido')
    return {
      html: '',
      isValid: false,
      warnings
    }
  }
}

/**
 * Elimina todo el HTML y devuelve solo texto
 */
export function stripHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = sanitize(html)
  return div.textContent || div.innerText || ''
}

/**
 * Valida si una cadena contiene HTML válido
 */
export function isValidHtml(html: string): boolean {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    return !doc.querySelector('parsererror')
  } catch {
    return false
  }
}

/**
 * Extrae el primer párrafo de un contenido HTML
 */
export function extractFirstParagraph(html: string, maxLength = 300): string {
  const cleanHtml = sanitize(html)
  const div = document.createElement('div')
  div.innerHTML = cleanHtml
  
  const firstP = div.querySelector('p')
  if (firstP) {
    const text = firstP.textContent || ''
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...'
      : text
  }
  
  const text = stripHtml(cleanHtml)
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...'
    : text
}

// Re-exporta la función original de DOMPurify por si se necesita
export const sanitizeHtml = sanitize
