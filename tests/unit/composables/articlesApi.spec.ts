import { describe, it, expect, vi, beforeEach } from 'vitest'
import { articlesApi } from '../../../src/composables/api/articlesApi'
import { httpClient } from '../../../src/utils/httpClient'
import { ArticleStatus } from '../../../src/types/models'

// Mock del httpClient
vi.mock('../../../src/utils/httpClient', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('articlesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('publishArticle', () => {
    it('debe publicar un artículo correctamente', async () => {
      // Arrange
      const articleId = '123e4567-e89b-12d3-a456-426614174000'
      const mockResponse = {
        id: articleId,
        title: 'Test Article',
        status: ArticleStatus.PUBLISHED,
        content: 'Test content',
        excerpt: 'Test excerpt',
        slug: 'test-article',
        bookIds: [],
        relatedLinks: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      const httpClientMock = httpClient as any
      httpClientMock.post.mockResolvedValue(mockResponse)

      // Act
      const result = await articlesApi.publishArticle(articleId)

      // Assert
      expect(httpClientMock.post).toHaveBeenCalledWith('/backoffice/articles/123e4567-e89b-12d3-a456-426614174000/publish')
      expect(result).toEqual(mockResponse)
    })

    it('debe manejar errores al publicar un artículo', async () => {
      // Arrange
      const articleId = '123e4567-e89b-12d3-a456-426614174000'
      const mockError = new Error('Article not found')

      const httpClientMock = httpClient as any
      httpClientMock.post.mockRejectedValue(mockError)

      // Act & Assert
      await expect(articlesApi.publishArticle(articleId)).rejects.toThrow('Article not found')
      expect(httpClientMock.post).toHaveBeenCalledWith('/backoffice/articles/123e4567-e89b-12d3-a456-426614174000/publish')
    })

    it('debe llamar al endpoint correcto con ID válido', async () => {
      // Arrange
      const articleId = 'valid-uuid-here'
      const httpClientMock = httpClient as any
      httpClientMock.post.mockResolvedValue({})

      // Act
      await articlesApi.publishArticle(articleId)

      // Assert
      expect(httpClientMock.post).toHaveBeenCalledWith('/backoffice/articles/valid-uuid-here/publish')
    })
  })

  describe('getArticles', () => {
    it('debe obtener artículos con parámetros de paginación', async () => {
      // Arrange
      const params = { page: 1, limit: 10 }
      const mockResponse = {
        items: [],
        total: 0,
        page: 1,
        limit: 10
      }

      const httpClientMock = httpClient as any
      httpClientMock.get.mockResolvedValue(mockResponse)

      // Act
      const result = await articlesApi.getArticles(params)

      // Assert
      expect(httpClientMock.get).toHaveBeenCalledWith('/backoffice/articles', {
        params: params as Record<string, string | number>
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('createArticle', () => {
    it('debe crear un artículo con estado DRAFT por defecto', async () => {
      // Arrange
      const articleData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'New Article',
        content: 'Article content',
        excerpt: 'Article excerpt',
        status: ArticleStatus.DRAFT,
        bookIds: [],
        relatedLinks: []
      }

      const httpClientMock = httpClient as any
      httpClientMock.post.mockResolvedValue(articleData)

      // Act
      const result = await articlesApi.createArticle(articleData)

      // Assert
      expect(httpClientMock.post).toHaveBeenCalledWith('/backoffice/articles', articleData)
      expect(result).toEqual(articleData)
    })
  })

  describe('updateArticle', () => {
    it('debe actualizar un artículo manteniendo el estado', async () => {
      // Arrange
      const articleId = '123e4567-e89b-12d3-a456-426614174000'
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content'
      }

      const mockResponse = {
        id: articleId,
        title: 'Updated Title',
        content: 'Updated content',
        status: ArticleStatus.DRAFT,
        excerpt: 'Test excerpt',
        slug: 'test-article',
        bookIds: [],
        relatedLinks: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T12:00:00Z'
      }

      const httpClientMock = httpClient as any
      httpClientMock.put.mockResolvedValue(mockResponse)

      // Act
      const result = await articlesApi.updateArticle(articleId, updateData)

      // Assert
      expect(httpClientMock.put).toHaveBeenCalledWith('/backoffice/articles/123e4567-e89b-12d3-a456-426614174000', updateData)
      expect(result).toEqual(mockResponse)
    })
  })
}) 