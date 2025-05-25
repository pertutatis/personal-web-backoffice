<template>
  <div class="article-detail">
    <!-- Navegación y acciones -->
    <div class="detail-header">
      <div class="navigation">
        <router-link to="/articulos" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Volver al listado</span>
        </router-link>
      </div>

      <div class="actions">
        <router-link :to="`/articulos/${articleId}/editar`" class="edit-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </router-link>
        <button @click="confirmDelete" class="delete-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Eliminar
        </button>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Cargando artículo...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="error-title">Error al cargar el artículo</h3>
      <p class="error-message">{{ error }}</p>
      <div class="error-actions">
        <button @click="loadArticle" class="retry-button">Reintentar</button>
        <router-link to="/articulos" class="back-to-list">Volver al listado</router-link>
      </div>
    </div>

    <!-- Contenido del artículo -->
    <div v-else-if="article" class="article-content">
      <!-- Encabezado y metadata -->
      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-slug">
          <span class="slug-label">Slug:</span>
          <span class="slug-value">{{ article.slug }}</span>
        </div>
        <div class="article-meta">
          <span class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 0v12m6-12v12M7 7h10" />
            </svg>
            Creado el {{ formatDate(article.createdAt) }}
          </span>
          <span v-if="article.updatedAt" class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Actualizado el {{ formatDate(article.updatedAt) }}
          </span>
        </div>
      </div>

      <!-- Extracto -->
      <div class="article-excerpt">
        <h3 class="section-title">Extracto</h3>
        <div class="excerpt-content">
          {{ article.excerpt }}
        </div>
      </div>

      <!-- Contenido principal con Markdown -->
      <div class="article-body">
        <h3 class="section-title">Contenido</h3>
        <div v-if="article.content" class="markdown-preview" v-html="renderedContent"></div>
        <div v-else class="empty-content">
          <p>Este artículo no tiene contenido.</p>
        </div>
      </div>

      <!-- Enlaces relacionados -->
      <div v-if="article.relatedLinks && article.relatedLinks.length > 0" class="related-links">
        <h3 class="section-title">Enlaces Relacionados</h3>
        <ul class="links-list">
          <li v-for="(link, index) in article.relatedLinks" :key="index" class="link-item">
            <a :href="link.url" target="_blank" rel="noopener noreferrer" class="link">
              {{ link.text }}
              <svg xmlns="http://www.w3.org/2000/svg" class="external-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </li>
        </ul>
      </div>

      <!-- Libros relacionados -->
      <div class="related-books">
        <h3 class="section-title">Libros Relacionados</h3>
        <div v-if="books.length" class="books-list">
          <div v-for="book in books" :key="book.id" class="book-item">
            <router-link :to="`/libros/${book.id}`" class="book-link">
              <span class="book-title">{{ book.title }}</span>
              <span class="book-author">{{ book.author }}</span>
            </router-link>
          </div>
        </div>
        <div v-else class="empty-related">
          <p>No hay libros relacionados con este artículo.</p>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteModal" class="modal-backdrop">
      <div class="modal">
        <div class="modal-content">
          <h3 class="modal-title">Confirmar Eliminación</h3>
          <p class="modal-text">
            ¿Estás seguro de que deseas eliminar este artículo?
            <br>
            <span class="modal-warning">Esta acción no se puede deshacer.</span>
          </p>
          <div class="modal-actions">
            <button @click="cancelDelete" class="modal-button cancel-button">
              Cancelar
            </button>
            <button @click="deleteArticle" class="modal-button confirm-button" :disabled="isDeleting">
              {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { articlesApi } from '../../composables/api/articlesApi';
import { booksApi } from '../../composables/api/booksApi';
import { useUIStore } from '../../stores/uiStore';
import { Article, ArticleStatus, Book } from '../../types/models';

// Props y store
const props = defineProps<{ id?: string }>();
const route = useRoute();
const router = useRouter();
const uiStore = useUIStore();
const { id } = toRefs(props);

// Estado local
const article = ref<Article | null>(null);
const books = ref<Book[]>([]);
const isLoading = ref(false);
const isDeleting = ref(false);
const error = ref('');
const showDeleteModal = ref(false);

// ID del artículo (desde props o parámetros de ruta)
const articleId = computed(() => id?.value || route.params.id as string);

// Contenido renderizado con Markdown
const renderedContent = computed(() => {
  if (!article.value?.content) return '';
  const rawHtml = marked(article.value.content);
  return DOMPurify.sanitize(rawHtml);
});

// Cargar el artículo
async function loadArticle() {
  if (!articleId.value) {
    error.value = 'ID de artículo no válido';
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    article.value = await articlesApi.getArticle(articleId.value);
    await loadRelatedBooks();
  } catch (err: any) {
    error.value = err.message || 'Error al cargar el artículo';
    uiStore.addNotification({
      type: 'error',
      message: 'Error al cargar el artículo'
    });
  } finally {
    isLoading.value = false;
  }
}

// Cargar libros relacionados
async function loadRelatedBooks() {
  if (!article.value || !article.value.bookIds?.length) {
    books.value = [];
    return;
  }

  try {
    // En un caso real, tendríamos un endpoint para obtener múltiples libros por ID
    // Aquí simulamos con múltiples llamadas por simplicidad
    const bookPromises = article.value.bookIds.map(id => 
      booksApi.getBook(id).catch(() => null)
    );
    const results = await Promise.all(bookPromises);
    books.value = results.filter(book => book !== null) as Book[];
  } catch (err: any) {
    uiStore.addNotification({
      type: 'warning',
      message: 'Error al cargar algunos libros relacionados'
    });
  }
}

// Formatear fechas
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Formatear estados
function formatStatus(status: ArticleStatus): string {
  return status === 'draft' ? 'Borrador' : 'Publicado';
}

// Obtener clase CSS para el estado
function getStatusClass(status: ArticleStatus): string {
  return status === 'draft' ? 'status-draft' : 'status-published';
}

// Mostrar modal de confirmación para eliminar
function confirmDelete() {
  showDeleteModal.value = true;
}

// Cancelar eliminación
function cancelDelete() {
  showDeleteModal.value = false;
}

// Eliminar artículo
async function deleteArticle() {
  isDeleting.value = true;
  try {
    await articlesApi.deleteArticle(articleId.value);
    uiStore.addNotification({
      type: 'success',
      message: 'Artículo eliminado correctamente'
    });
    router.push('/articulos');
  } catch (err: any) {
    uiStore.addNotification({
      type: 'error',
      message: `Error al eliminar el artículo: ${err.message || 'Error desconocido'}`
    });
    showDeleteModal.value = false;
  } finally {
    isDeleting.value = false;
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  loadArticle();
});
</script>

<style scoped>
.article-detail {
  @apply space-y-6;
}

.detail-header {
  @apply mb-6 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0;
}

.navigation {
  @apply flex items-center;
}

.back-link {
  @apply flex items-center text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300;
}

.back-icon {
  @apply mr-2 h-5 w-5;
}

.actions {
  @apply flex space-x-3;
}

.edit-button, .delete-button {
  @apply flex items-center rounded-lg px-4 py-2 font-medium transition-colors;
}

.edit-button {
  @apply bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:hover:bg-amber-900/50;
}

.delete-button {
  @apply bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50;
}

.button-icon {
  @apply mr-2 h-5 w-5;
}

/* Estados de carga, error y contenido */
.loading-state, .error-state {
  @apply flex flex-col items-center justify-center py-12 text-center;
}

.loading-spinner {
  @apply mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600;
}

.error-icon {
  @apply mb-4 h-16 w-16 text-red-500;
}

.error-title {
  @apply text-xl font-bold text-red-600 dark:text-red-400;
}

.error-message {
  @apply mt-2 text-gray-600 dark:text-gray-300;
}

.error-actions {
  @apply mt-6 flex space-x-4;
}

.retry-button {
  @apply rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700;
}

.back-to-list {
  @apply rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700;
}

/* Contenido del artículo */
.article-header {
  @apply mb-8 border-b border-gray-200 pb-4 dark:border-gray-700;
}

.article-title {
  @apply mb-4 text-3xl font-bold text-gray-900 dark:text-white;
}

.article-meta {
  @apply flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400;
}

.meta-item {
  @apply flex items-center;
}

.meta-icon {
  @apply mr-1 h-4 w-4;
}

.status-badge {
  @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium;
}

.status-draft {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200;
}

.status-published {
  @apply bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200;
}

.article-body {
  @apply mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800;
}

.section-title {
  @apply mb-4 text-lg font-medium text-gray-900 dark:text-white;
}

.markdown-preview {
  @apply prose max-w-none dark:prose-invert;
}

.empty-content {
  @apply rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400;
}

/* Enlaces relacionados */
.related-links {
  @apply mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800;
}

.links-list {
  @apply space-y-2 list-none pl-0;
}

.link-item {
  @apply py-1;
}

.link {
  @apply flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300;
}

.external-icon {
  @apply ml-2 h-4 w-4 flex-shrink-0;
}

/* Libros relacionados */
.related-books {
  @apply rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800;
}

.books-list {
  @apply grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3;
}

.book-item {
  @apply rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600;
}

.book-link {
  @apply flex flex-col no-underline;
}

.book-title {
  @apply font-medium text-blue-600 dark:text-blue-400;
}

.book-author {
  @apply mt-1 text-sm text-gray-600 dark:text-gray-400;
}

.empty-related {
  @apply rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400;
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
