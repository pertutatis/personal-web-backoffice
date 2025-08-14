<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-2">{{ serie?.title }}</h1>
    <p class="mb-4">{{ serie?.description }}</p>
    <router-link class="btn btn-secondary" to="/series">Volver al listado</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSeriesStore } from '@/stores/seriesStore'

const route = useRoute()
const store = useSeriesStore()
const serie = ref<any>(null)

onMounted(async () => {
  await store.fetchSeries()
  serie.value = store.series.find((s: any) => s.id === route.params.id)
})
</script>
