import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { httpClient } from '@/utils/httpClient'
import type { Serie, SerieListResponse, SerieCreatePayload, SerieUpdatePayload } from '@/types/serie';

export function useSeries() {
  const queryClient = useQueryClient()

  // Listar series
    const getSeries = async (params?: { limit?: number; page?: number }): Promise<SerieListResponse> => {
      const res = await httpClient.get('/backoffice/series', { params }) as { data: SerieListResponse };
      return res.data;
  }

  // Obtener una serie por id
    const getSerie = async (id: string): Promise<Serie> => {
      const res = await httpClient.get(`/backoffice/series/${id}`) as { data: Serie };
      return res.data;
    }

  // Crear serie
    const createSerie = async (
      serie: SerieCreatePayload
    ): Promise<Serie> => {
      try {
        const result = await httpClient.post('/backoffice/series', serie) as { data: Serie }
        queryClient.invalidateQueries(['series'])
        return result.data
      } catch (e) {
        console.error("Error en useSeries.createSerie", e);
        throw e;
      }
    }

  // Editar serie
    const updateSerie = async (id: string, serie: SerieUpdatePayload): Promise<Serie> => {
      const result = await httpClient.put(`/backoffice/series/${id}`, serie) as { data: Serie };
      queryClient.invalidateQueries(['series']);
      return result.data;
    }

  // Eliminar serie
    const deleteSerie = async (id: string): Promise<void> => {
      await httpClient.delete(`/backoffice/series/${id}`);
      queryClient.invalidateQueries(['series']);
    }

  return {
    getSeries,
    getSerie,
    createSerie,
    updateSerie,
    deleteSerie
  }
}
