

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSeries } from '@/composables/api/useSeries'
import type { Serie, SerieListResponse, SerieCreatePayload } from '@/types/serie'
vi.mock('@tanstack/vue-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn()
  })
}))

const mockSeries: Serie[] = [
  { id: '1', title: 'Serie 1', description: 'Desc 1', createdAt: '', updatedAt: '' },
  { id: '2', title: 'Serie 2', description: 'Desc 2', createdAt: '', updatedAt: '' }
];

describe('useSeries composable', () => {
  let api: ReturnType<typeof useSeries>;

  beforeEach(() => {
    vi.clearAllMocks();
    api = useSeries();
  });

  it('debería listar series', async () => {
    const mockResponse: SerieListResponse = {
      data: mockSeries,
      total: 2,
      page: 1,
      limit: 10
    };
    api.getSeries = vi.fn().mockResolvedValue(mockResponse);
    const result = await api.getSeries();
  expect(result).to.deep.equal(mockResponse);
  expect(result.data).to.deep.equal(mockSeries);
  });

  it('debería obtener una serie por id', async () => {
    api.getSerie = vi.fn().mockResolvedValue(mockSeries[0]);
    const result = await api.getSerie('1');
  expect(result).to.deep.equal(mockSeries[0]);
  });

  it('debería crear una serie', async () => {
    const newSerie: SerieCreatePayload = { title: 'Nueva', description: 'Desc' };
    const createdSerie: Serie = { id: '3', ...newSerie, createdAt: '', updatedAt: '' };
    api.createSerie = vi.fn().mockResolvedValue(createdSerie);
    const result = await api.createSerie(newSerie);
  expect(result).to.include(newSerie);
  expect(result.id).to.not.be.undefined;
  });

  it('debería editar una serie', async () => {
    const updated: Serie = { ...mockSeries[0], title: 'Modificada' };
    api.updateSerie = vi.fn().mockResolvedValue(updated);
    const result = await api.updateSerie('1', { title: 'Modificada' });
  expect(result.title).to.equal('Modificada');
  });

  it('debería eliminar una serie', async () => {
    api.deleteSerie = vi.fn().mockResolvedValue(undefined);
    const result = await api.deleteSerie('1');
  expect(result).to.be.undefined;
  });
});
