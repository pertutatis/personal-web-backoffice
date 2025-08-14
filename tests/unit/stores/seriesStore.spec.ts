import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSeriesStore } from '@/stores/seriesStore'
import { seriesApi } from '@/composables/api/seriesApi'

vi.mock('@/composables/api/seriesApi')

const mockSeries = [
  { id: '1', title: 'Serie 1', description: 'Desc 1' },
  { id: '2', title: 'Serie 2', description: 'Desc 2' }
]
const mockListResponse = {
  data: mockSeries,
  total: 2,
  page: 1,
  limit: 10
}

describe('seriesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('debería cargar el listado de series', async () => {
    vi.spyOn(seriesApi, 'getSeries').mockResolvedValue({
      data: [...mockSeries],
      total: 2,
      page: 1,
      limit: 10
    })
    const store = useSeriesStore()
    await store.fetchSeries()
    expect(store.series).to.deep.equal(mockSeries)
  })

  it('debería crear una serie y añadirla al store', async () => {
    const newSerie = { id: '3', title: 'Nueva', description: 'Desc' }
    const updatedSeries = [...mockSeries, newSerie]
    vi.spyOn(seriesApi, 'createSerie').mockResolvedValue(newSerie)
    vi.spyOn(seriesApi, 'getSeries').mockResolvedValue({
      data: updatedSeries,
      total: 3,
      page: 1,
      limit: 10
    })
    const store = useSeriesStore()
    await store.createSerie({ title: 'Nueva', description: 'Desc' })
    expect(store.series).to.include(newSerie)
  })

  it('debería actualizar una serie en el store', async () => {
    const updated = { ...mockSeries[0], title: 'Modificada' }
    const updatedSeries = [updated, mockSeries[1]]
    vi.spyOn(seriesApi, 'updateSerie').mockResolvedValue(updated)
    vi.spyOn(seriesApi, 'getSeries').mockResolvedValue({
      data: updatedSeries,
      total: 2,
      page: 1,
      limit: 10
    })
    const store = useSeriesStore()
    store.series = [...mockSeries]
    await store.updateSerie('1', { title: 'Modificada', description: 'Desc 1' })
    expect(store.series[0].title).to.equal('Modificada')
  })

  it('debería eliminar una serie del store', async () => {
    vi.spyOn(seriesApi, 'deleteSerie').mockResolvedValue({ success: true })
    const updatedSeries = [mockSeries[1]]
    vi.spyOn(seriesApi, 'getSeries').mockResolvedValue({
      data: updatedSeries,
      total: 1,
      page: 1,
      limit: 10
    })
    const store = useSeriesStore()
    store.series = [...mockSeries]
    await store.deleteSerie('1')
    expect(store.series.find((s: any) => s.id === '1')).to.be.undefined
  })
})
