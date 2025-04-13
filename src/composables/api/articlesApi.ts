/**
 * Servicios API para artículos
 */
import { httpClient } from '../../utils/httpClient';
import { Article, ArticleCreate, ArticleUpdate, PaginatedResponse, QueryParams } from '../../types/models';

const ARTICLES_ENDPOINT = '/blog/articles';

export const articlesApi = {
  /**
   * Obtiene un listado paginado de artículos
   */
  getArticles(params?: QueryParams): Promise<PaginatedResponse<Article>> {
    return httpClient.get<PaginatedResponse<Article>>(ARTICLES_ENDPOINT, { params });
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
  }
};
