<template>
  <div class="article-table">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Listado de Artículos</h2>
      <router-link
        to="/articles/new"
        class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Nuevo Artículo
      </router-link>
    </div>

    <div class="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Título
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Fecha de creación
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Última actualización
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="article in articles" :key="article.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ article.title }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusClass(article.status)"
              >
                {{ getStatusText(article.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {{ formatDate(article.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {{ article.updatedAt ? formatDate(article.updatedAt) : 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <router-link
                  :to="`/articles/${article.id}`"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Ver
                </router-link>
                <router-link
                  :to="`/articles/${article.id}/edit`"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Editar
                </router-link>
                <button
                  @click="confirmDelete(article)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="articles.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
              No hay artículos disponibles
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex justify-between items-center mt-4 px-4">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Mostrando {{ pagination.page }} de {{ pagination.pages }} páginas
      </div>
      <div class="flex space-x-2">
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page <= 1"
          :class="[
            'px-3 py-1 rounded',
            pagination.page <= 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
        >
          Anterior
        </button>
        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page >= pagination.pages"
          :class="[
            'px-3 py-1 rounded',
            pagination.page >= pagination.pages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirmar eliminación</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          ¿Estás seguro de que deseas eliminar el artículo <strong>"{{ articleToDelete?.title }}"</strong>? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            @click="deleteArticle"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, PropType } from 'vue';
import { Article, PaginatedResponse } from '../../types/models';

const props = defineProps({
  articles: {
    type: Array as PropType<Article[]>,
    required: true
  },
  pagination: {
    type: Object as PropType<{
      page: number;
      limit: number;
      total: number;
      pages: number;
    }>,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'page-change', page: number): void
}>();

const showDeleteModal = ref(false);
const articleToDelete = ref<Article | null>(null);

const confirmDelete = (article: Article) => {
  articleToDelete.value = article;
  showDeleteModal.value = true;
};

const deleteArticle = () => {
  if (articleToDelete.value) {
    emit('delete', articleToDelete.value.id);
    showDeleteModal.value = false;
  }
};

const changePage = (page: number) => {
  if (page >= 1 && page <= props.pagination.pages) {
    emit('page-change', page);
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getStatusClass = (status: string): string => {
  if (status === 'published') {
    return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
  }
  return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
};

const getStatusText = (status: string): string => {
  if (status === 'published') {
    return 'Publicado';
  }
  return 'Borrador';
};
</script>
