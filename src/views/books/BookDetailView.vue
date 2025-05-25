<template>
  <div class="book-detail">
    <h1 class="text-2xl font-bold mb-4">{{ book?.title || "Cargando..." }}</h1>

    <div v-if="isLoading" class="py-8 text-center">
      <p>Cargando información del libro...</p>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-700 p-4 rounded"
    >
      <p>Error al cargar el libro: {{ error }}</p>
    </div>

    <div v-else-if="book" class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-1">
          <img
            v-if="book.coverImage"
            :src="book.coverImage"
            :alt="book.title"
            class="w-full h-auto rounded"
          />
          <div v-else class="bg-gray-200 dark:bg-gray-700 rounded p-12 text-center">
            <span class="text-gray-500 dark:text-gray-400">Sin imagen de portada</span>
          </div>
        </div>

        <div class="md:col-span-2">
          <dl class="space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Título</dt>
              <dd class="mt-1 text-lg" data-cy="book-title">{{ book.title }}</dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-500">Autor</dt>
              <dd class="mt-1">{{ book.author }}</dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-500">ISBN</dt>
              <dd class="mt-1">{{ formatIsbn(book.isbn) }}</dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">Descripción</dt>
              <dd class="mt-1" v-html="sanitizeMarkdown(book.description)"></dd>
            </div>
            
            <div v-if="book.purchaseLink">
              <dt class="text-sm font-medium text-gray-500">Enlace de compra</dt>
              <dd class="mt-1">
                <a :href="book.purchaseLink" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                  {{ book.purchaseLink }}
                </a>
              </dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-500">Fecha de creación</dt>
              <dd class="mt-1">{{ formatDate(book.createdAt) }}</dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-500">Última actualización</dt>
              <dd class="mt-1">{{ book.updatedAt ? formatDate(book.updatedAt) : 'No actualizado' }}</dd>
            </div>
          </dl>

          <div class="mt-6 flex space-x-3">
            <router-link
              :to="`/libros/${id}/editar`"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </router-link>
            <button
              @click="openDeleteDialog"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar
            </button>
            <router-link
              to="/libros"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Eliminar libro</h3>
          
          <p class="mt-3 text-gray-600 dark:text-gray-300">
            ¿Estás seguro de que deseas eliminar el libro "{{ book?.title }}"? Esta acción no
            se puede deshacer.
          </p>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              @click="showDeleteModal = false"
              class="min-w-[80px] rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button 
              @click="deleteBook"
              :disabled="isDeleting"
              class="min-w-[80px] rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-400"
            >
              {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useBooks } from "@/composables/api/useBooks";
import { useUIStore } from "@/stores/uiStore";

const route = useRoute();
const router = useRouter();
const uiStore = useUIStore();
const id = computed(() => route.params.id as string);

// Estado local
const showDeleteModal = ref(false);
const isDeleting = ref(false);

// Usar el composable useBooks
const { getBookById, deleteBookMutation } = useBooks();
const { data: book, isLoading, error } = getBookById(id.value);
const { mutate: deleteBookById } = deleteBookMutation();

// Formatear fecha
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Formatea ISBN para mejor legibilidad
const formatIsbn = (isbn: string): string => {
  if (!isbn) return '';
  
  if (isbn.length === 13) {
    return `${isbn.slice(0, 3)}-${isbn.slice(3, 4)}-${isbn.slice(4, 6)}-${isbn.slice(6, 12)}-${isbn.slice(12)}`;
  }
  
  if (isbn.length === 10) {
    return `${isbn.slice(0, 1)}-${isbn.slice(1, 3)}-${isbn.slice(3, 9)}-${isbn.slice(9)}`;
  }
  
  return isbn;
};

// Renderizar y sanitizar markdown
const sanitizeMarkdown = (text: string): string => {
  if (!text) return "";
  const rawHtml = marked.parse(text);
  return DOMPurify.sanitize(rawHtml as string);
};

// Modal de confirmación para eliminar
const openDeleteDialog = () => {
  showDeleteModal.value = true;
};

// Eliminar libro
const deleteBook = () => {
  isDeleting.value = true;
  
  deleteBookById(id.value, {
    onSuccess: () => {
      uiStore.addNotification({
        type: 'success',
        message: 'El libro ha sido eliminado correctamente.'
      });
      
      router.push('/libros');
      showDeleteModal.value = false;
      isDeleting.value = false;
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      uiStore.addNotification({
        type: 'error',
        message: `Error al eliminar el libro: ${errorMessage}`
      });
      
      isDeleting.value = false;
      showDeleteModal.value = false;
    }
  });
};
</script>
