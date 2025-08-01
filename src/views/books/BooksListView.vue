<template>
  <div class="books-list">
    <div class="list-header">
      <div class="header-title">
        <h2>Libros</h2>
        <span class="book-count" v-if="!isLoading">{{ booksCount }} libros</span>
      </div>
      <div class="header-actions">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar libros..." 
            class="search-input"
            @input="debouncedSearch"
          >
          <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <router-link to="/libros/nuevo" class="new-button" data-cy="new-book-button">
          Nuevo Libro
        </router-link>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando libros...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-container">
      <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3>Error al cargar los libros</h3>
      <p>{{ error }}</p>
      <button @click="fetchBooks" class="retry-button">
        Reintentar
      </button>
    </div>
    
    <!-- Sin resultados -->
    <div v-else-if="books.length === 0" class="empty-container">
      <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <h3>No hay libros</h3>
      <p v-if="searchQuery">No se encontraron resultados para "{{ searchQuery }}"</p>
      <p v-else>No hay libros disponibles en este momento.</p>
      <router-link to="/libros/nuevo" class="new-button">
        Añadir Primer Libro
      </router-link>
    </div>

    <!-- Lista de libros -->
    <div v-else class="books-table-container">
      <table class="books-table" data-cy="books-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>ISBN</th>
            <th>Fecha de Creación</th>
            <th class="actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id" class="book-row" data-cy="book-row">
            <td class="title-column">
              <router-link :to="`/libros/${book.id}`" class="book-title">
                {{ book.title }}
              </router-link>
            </td>
            <td>{{ book.author }}</td>
            <td class="isbn-column">
              <span class="isbn-code">{{ formatIsbn(book.isbn) }}</span>
            </td>
            <td>{{ formatDate(book.createdAt) }}</td>
            <td class="actions-column">
              <div class="actions-container">
                <router-link :to="`/libros/${book.id}`" class="action-button view-button" title="Ver detalles" data-cy="view-book-button">
                  <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </router-link>
                <router-link :to="`/libros/${book.id}/editar`" class="action-button edit-button" title="Editar" data-cy="edit-book-button">
                  <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </router-link>
                <button @click="confirmDelete(book)" class="action-button delete-button" title="Eliminar" data-cy="delete-book-button">
                  <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        :disabled="currentPage === 1" 
        @click="changePage(currentPage - 1)" 
        class="pagination-button" 
        :class="{ disabled: currentPage === 1 }"
      >
        Anterior
      </button>
      <div class="pagination-numbers">
        <button 
          v-for="page in paginationItems" 
          :key="page" 
          @click="changePage(page)" 
          :class="['page-number', { active: page === currentPage }]"
        >
          {{ page }}
        </button>
      </div>
      <button 
        :disabled="currentPage === totalPages" 
        @click="changePage(currentPage + 1)" 
        class="pagination-button" 
        :class="{ disabled: currentPage === totalPages }"
      >
        Siguiente
      </button>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteModal" class="modal-backdrop">
      <div class="modal">
        <div class="modal-content">
          <h3 class="modal-title">Confirmar Eliminación</h3>
          <p class="modal-text">
            ¿Estás seguro de que deseas eliminar el libro "{{ bookToDelete?.title }}"?
            <br>
            <span class="modal-warning">Esta acción no se puede deshacer.</span>
          </p>
          <div class="modal-actions">
            <button @click="cancelDelete" class="modal-button cancel-button">
              Cancelar
            </button>
            <button @click="deleteBook" class="modal-button confirm-button" :disabled="isDeleting" data-cy="confirm-delete-button">
              {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { booksApi } from '../../composables/api/booksApi';
import { useUIStore } from '../../stores/uiStore';
import { Book } from '../../types/models';
import { useQuery } from '@tanstack/vue-query';

// Store UI para notificaciones
const uiStore = useUIStore();

// Estado para la lista de libros
const books = ref<Book[]>([]);
const booksCount = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchQuery = ref('');
const error = ref('');

// Estado para paginación
const totalPages = computed(() => Math.ceil(booksCount.value / itemsPerPage.value));

// Estado para modal de eliminación
const showDeleteModal = ref(false);
const bookToDelete = ref<Book | null>(null);
const isDeleting = ref(false);

// Obtener libros con Vue Query
const { 
  isLoading,
  refetch 
} = useQuery({
  queryKey: ['books', currentPage.value, itemsPerPage.value, searchQuery.value],
  queryFn: () => fetchBooks(),
  onError: (err: any) => {
    error.value = err.message || 'Error al cargar los libros';
    uiStore.addNotification({
      type: 'error',
      message: 'Error al cargar los libros',
    });
  }
});

// Método para obtener libros de la API
async function fetchBooks() {
  try {
    error.value = '';
    const queryParams = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchQuery.value || undefined
    };
    
    const response = await booksApi.getBooks(queryParams);
    books.value = response.items;
    booksCount.value = response.total;
    return response;
  } catch (err: any) {
    throw err;
  }
}

// Formatea ISBN para mejor legibilidad
function formatIsbn(isbn: string): string {
  if (!isbn) return '';
  
  // ISBN-13 (después del 2007): 978-3-16-148410-0
  if (isbn.length === 13) {
    return `${isbn.slice(0, 3)}-${isbn.slice(3, 4)}-${isbn.slice(4, 6)}-${isbn.slice(6, 12)}-${isbn.slice(12)}`;
  }
  
  // ISBN-10 (antes del 2007): 3-16-148410-X
  if (isbn.length === 10) {
    return `${isbn.slice(0, 1)}-${isbn.slice(1, 3)}-${isbn.slice(3, 9)}-${isbn.slice(9)}`;
  }
  
  return isbn; // Devolver sin formato si no encaja en los formatos conocidos
}

// Debounce para la búsqueda
let timeout: NodeJS.Timeout;
function debouncedSearch() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    currentPage.value = 1;
    refetch();
  }, 500);
}

// Cambiar de página
function changePage(page: number) {
  currentPage.value = page;
  refetch();
}

// Formatear fechas
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

// Mostrar modal de confirmación para eliminar
function confirmDelete(book: Book) {
  bookToDelete.value = book;
  showDeleteModal.value = true;
}

// Cancelar eliminación
function cancelDelete() {
  bookToDelete.value = null;
  showDeleteModal.value = false;
}

// Eliminar libro
async function deleteBook() {
  if (!bookToDelete.value) return;
  
  isDeleting.value = true;
  try {
    await booksApi.deleteBook(bookToDelete.value.id);
    uiStore.addNotification({
      type: 'success',
      message: `El libro "${bookToDelete.value.title}" ha sido eliminado.`
    });
    
    // Cerrar el modal
    cancelDelete();
    
    // Actualizar la lista
    refetch();
  } catch (err: any) {
    uiStore.addNotification({
      type: 'error',
      message: `Error al eliminar el libro: ${err.message || 'Error desconocido'}`
    });
  } finally {
    isDeleting.value = false;
  }
}

// Calcular elementos de paginación
const paginationItems = computed(() => {
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }
  
  if (currentPage.value <= 3) {
    return [1, 2, 3, 4, 5, '...', totalPages.value];
  }
  
  if (currentPage.value >= totalPages.value - 2) {
    return [1, '...', totalPages.value - 4, totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value];
  }
  
  return [1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', totalPages.value];
});

// Cargar datos al montar el componente
onMounted(() => {
  fetchBooks();
});
</script>

<style scoped>
.books-list {
  @apply space-y-6;
}

.list-header {
  @apply flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0;
}

.header-title {
  @apply flex items-center space-x-4;
}

.header-title h2 {
  @apply text-2xl font-bold text-gray-800 dark:text-white;
}

.book-count {
  @apply rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200;
}

.header-actions {
  @apply flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-4 md:space-y-0;
}

.search-container {
  @apply relative flex-grow;
}

.search-input {
  @apply w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white;
}

.search-icon {
  @apply absolute right-3 top-2.5 h-5 w-5 text-gray-400;
}

.new-button {
  @apply inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600;
}

.loading-container {
  @apply flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400;
}

.loading-spinner {
  @apply mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600;
}

.error-container {
  @apply flex flex-col items-center justify-center py-12 text-center;
}

.error-icon {
  @apply mb-4 h-16 w-16 text-red-500;
}

.retry-button {
  @apply mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700;
}

.empty-container {
  @apply flex flex-col items-center justify-center py-12 text-center;
}

.empty-icon {
  @apply mb-4 h-16 w-16 text-gray-400;
}

.books-table-container {
  @apply overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700;
}

.books-table {
  @apply w-full border-collapse bg-white text-left text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300;
}

.books-table th {
  @apply bg-gray-50 px-6 py-3 font-medium text-gray-500 dark:bg-gray-900 dark:text-gray-400;
}

.books-table td {
  @apply border-t border-gray-200 px-6 py-4 dark:border-gray-700;
}

.title-column {
  @apply max-w-xs truncate md:max-w-md;
}

.book-title {
  @apply font-medium text-blue-600 hover:underline dark:text-blue-400;
}

.isbn-column {
  @apply font-mono;
}

.isbn-code {
  @apply text-sm;
}

.actions-column {
  @apply w-32 text-right;
}

.actions-container {
  @apply flex items-center justify-end space-x-2;
}

.action-button {
  @apply rounded p-1 transition-colors;
}

.view-button {
  @apply text-gray-500 hover:bg-blue-100 hover:text-blue-700 dark:text-gray-400 dark:hover:bg-blue-900 dark:hover:text-blue-300;
}

.edit-button {
  @apply text-gray-500 hover:bg-amber-100 hover:text-amber-700 dark:text-gray-400 dark:hover:bg-amber-900 dark:hover:text-amber-300;
}

.delete-button {
  @apply text-gray-500 hover:bg-red-100 hover:text-red-700 dark:text-gray-400 dark:hover:bg-red-900 dark:hover:text-red-300;
}

.action-icon {
  @apply h-5 w-5;
}

.pagination {
  @apply mt-6 flex items-center justify-between;
}

.pagination-button {
  @apply rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700;
}

.pagination-numbers {
  @apply flex space-x-2;
}

.page-number {
  @apply inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700;
}

.page-number.active {
  @apply border-blue-600 bg-blue-600 text-white hover:bg-blue-600;
}

/* Modal */
.modal-backdrop {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50;
}

.modal {
  @apply w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800;
}

.modal-title {
  @apply text-lg font-bold text-gray-900 dark:text-white;
}

.modal-text {
  @apply mt-3 text-gray-600 dark:text-gray-300;
}

.modal-warning {
  @apply font-medium text-red-600 dark:text-red-400;
}

.modal-actions {
  @apply mt-6 flex justify-end space-x-3;
}

.modal-button {
  @apply min-w-[80px] rounded-md px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.cancel-button {
  @apply border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600;
}

.confirm-button {
  @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400;
}
</style>
