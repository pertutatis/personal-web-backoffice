/**
 * Servicios API para artículos
 */
import { httpClient } from '../../utils/httpClient';
import { Article, ArticleCreate, ArticleUpdate, PaginatedResponse, PaginationParams } from '../../types/models';

const ARTICLES_ENDPOINT = '/backoffice/articles';

export const articlesApi = {
  /**
   * Obtiene un listado paginado de artículos
   */
  getArticles(params?: PaginationParams): Promise<PaginatedResponse<Article>> {
    return httpClient.get<PaginatedResponse<Article>>(ARTICLES_ENDPOINT, { 
      params: params as Record<string, string | number> 
    });
  },

  /**
   * Obtiene un artículo por ID
   */
  getArticle(id: string): Promise<Article> {
    return httpClient.get<Article>(`${ARTICLES_ENDPOINT}/${id}`);
  },

  /**
   * Crea un nuevo artículo
   */
  createArticle(article: ArticleCreate): Promise<Article> {
    return httpClient.post<Article>(ARTICLES_ENDPOINT, article);
  },

  /**
   * Actualiza un artículo existente
   */
  updateArticle(id: string, article: ArticleUpdate): Promise<Article> {
    return httpClient.put<Article>(`${ARTICLES_ENDPOINT}/${id}`, article);
  },

  /**
   * Elimina un artículo
   */
  deleteArticle(id: string): Promise<void> {
    return httpClient.delete<void>(`${ARTICLES_ENDPOINT}/${id}`);
  },

  /**
   * Publica un artículo (transición DRAFT -> PUBLISHED)
   */
  publishArticle(id: string): Promise<Article> {
    return httpClient.post<Article>(`${ARTICLES_ENDPOINT}/${id}/publish`);
  }
};
