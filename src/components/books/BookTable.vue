<template>
  <div class="book-table">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Listado de Libros</h2>
      <router-link
        to="/books/new"
        data-cy="new-book-button"
        class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Nuevo Libro
      </router-link>
    </div>

    <div class="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" data-cy="books-table">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Título
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Autor
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              ISBN
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Año
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="book in books" :key="book.id" class="hover:bg-gray-50 dark:hover:bg-gray-700" data-cy="book-row">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-white" data-cy="book-title">
                {{ book.title }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 dark:text-gray-300" data-cy="book-author">
                {{ book.author }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-gray-500 dark:text-gray-300 font-mono" data-cy="book-isbn">
                {{ formatISBN(book.isbn) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300" data-cy="book-year">
              {{ book.year }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <router-link
                  :to="`/books/${book.id}`"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  data-cy="view-book-button"
                >
                  Ver
                </router-link>
                <router-link
                  :to="`/books/${book.id}/edit`"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  data-cy="edit-book-button"
                >
                  Editar
                </router-link>
                <button
                  @click="confirmDelete(book)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  data-cy="delete-book-button"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="books.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
              No hay libros disponibles
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
          ¿Estás seguro de que deseas eliminar el libro <strong>"{{ bookToDelete?.title }}"</strong>? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            @click="deleteBook"
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
import { Book, PaginatedResponse } from '../../types/models';

const props = defineProps({
  books: {
    type: Array as PropType<Book[]>,
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
const bookToDelete = ref<Book | null>(null);

const confirmDelete = (book: Book) => {
  bookToDelete.value = book;
  showDeleteModal.value = true;
};

const deleteBook = () => {
  if (bookToDelete.value) {
    emit('delete', bookToDelete.value.id);
    showDeleteModal.value = false;
  }
};

const changePage = (page: number) => {
  if (page >= 1 && page <= props.pagination.pages) {
    emit('page-change', page);
  }
};

const formatISBN = (isbn: string): string => {
  // Si es ISBN-13, formatearlo como XXX-X-XXXXX-XXX-X
  if (isbn.length === 13) {
    return `${isbn.slice(0, 3)}-${isbn.slice(3, 4)}-${isbn.slice(4, 9)}-${isbn.slice(9, 12)}-${isbn.slice(12)}`;
  }
  // Si es ISBN-10, formatearlo como X-XXXXX-XXX-X
  else if (isbn.length === 10) {
    return `${isbn.slice(0, 1)}-${isbn.slice(1, 6)}-${isbn.slice(6, 9)}-${isbn.slice(9)}`;
  }
  // Si el formato es desconocido, devolverlo tal cual
  return isbn;
};
</script>
