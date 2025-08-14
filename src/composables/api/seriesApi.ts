import { httpClient } from '../../utils/httpClient';
import type { Serie, SerieListResponse, SerieCreatePayload, SerieUpdatePayload } from '@/types/serie';

export const seriesApi = {
  async getSeries(params: { limit?: number } = {}): Promise<SerieListResponse> {
    const response = await httpClient.get<SerieListResponse>('/backoffice/series', { params });
    return response;
  },

  async createSerie(payload: SerieCreatePayload): Promise<Serie> {
    const response = await httpClient.post<Serie>('/backoffice/series', payload);
    return response;
  },  

  async updateSerie(id: string, payload: SerieUpdatePayload): Promise<Serie> {
    const response = await httpClient.put<Serie>(`/backoffice/series/${id}`, payload);
    return response;
  },

  async deleteSerie(id: string): Promise<void> {
    await httpClient.delete<void>(`/backoffice/series/${id}`);
  }
};
