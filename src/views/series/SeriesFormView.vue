import { v4 as uuidv4 } from 'uuid'
<template>
  <BaseModal :modelValue="modelValue" @close="$emit('close')" size="md">
    <template #title>
      <h2 class="text-2xl font-bold text-white dark:text-gray-100 mb-4 text-center">
        {{ serie ? 'Editar serie' : 'Nueva serie' }}
      </h2>
    </template>
    <form @submit.prevent="save" class="space-y-6">
      <div>
        <label for="serie-title" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Título <span class="text-red-500">*</span></label>
        <input
          v-model="form.title"
          name="title"
          id="serie-title"
          data-cy="serie-title-input"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          maxlength="100"
          required
          placeholder="Título de la serie"
        />
      </div>
      <div>
        <label for="serie-description" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Descripción</label>
        <textarea
          v-model="form.description"
          name="description"
          id="serie-description"
          data-cy="serie-description-input"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          maxlength="500"
          rows="3"
          placeholder="Descripción breve (opcional)"
        />
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" @click="$emit('close')" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500">Cancelar</button>
        <button type="submit" class="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Guardar</button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useSeriesStore } from '@/stores/seriesStore'
import BaseModal from '@/components/ui/BaseModal.vue'

const props = defineProps<{ serie?: any; modelValue: boolean }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'saved'): void }>()
const store = useSeriesStore()

const form = ref({
  title: '',
  description: ''
})

watch(
  () => props.serie,
  (serie: any) => {
    if (serie) {
      form.value = { title: serie.title, description: serie.description }
    } else {
      form.value = { title: '', description: '' }
    }
  },
  { immediate: true }
)

const save = async () => {  
  if (props.serie) {
    await store.updateSerie(props.serie.id, form.value)
  } else {
    // Generar id único para la nueva serie
    const payload = { ...form.value, id: uuidv4() }
    await store.createSerie(payload)
  }
  emit('saved')
}
</script>

<!-- Export default para compatibilidad con importación estándar -->
export default {
  name: 'SeriesFormView'
}
