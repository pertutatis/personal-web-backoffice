import { defineStore } from 'pinia'
import { ref } from 'vue'
import { seriesApi } from '@/composables/api/seriesApi'

export interface Serie {
  id: string
  title: string
  description?: string
}

export const useSeriesStore = defineStore('series', () => {
  const series = ref<Serie[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchSeries = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await seriesApi.getSeries()
      series.value = res.data || []
    } catch (e: any) {
      error.value = e.message || 'Error al cargar series'
    } finally {
      loading.value = false
    }
  }

  const createSerie = async (payload: { title: string; description?: string }) => {
    try {
      console.log("Creating series:", payload);
      
      await seriesApi.createSerie(payload)
      console.log("Series created successfully:", payload);

      await fetchSeries();
    } catch (e: any) {
      error.value = e.message || 'Error al crear serie'
    }
  }

  const updateSerie = async (id: string, payload: { title: string; description?: string }) => {
    try {
      await seriesApi.updateSerie(id, payload)
      await fetchSeries();
    } catch (e: any) {
      error.value = e.message || 'Error al actualizar serie'
    }
  }

  const deleteSerie = async (id: string) => {
    try {
      await seriesApi.deleteSerie(id)
      await fetchSeries();
    } catch (e: any) {
      error.value = e.message || 'Error al eliminar serie'
    }
  }

  return {
    series,
    loading,
    error,
    fetchSeries,
    createSerie,
    updateSerie,
    deleteSerie
  }
})
