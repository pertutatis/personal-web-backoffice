<template>
  <div class="article-form">
    <!-- Navegación y acciones -->
    <div class="form-header">
      <div class="navigation">
        <router-link to="/articulos" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Volver al listado</span>
        </router-link>
      </div>
      <h1 class="form-title">{{ isEditMode ? 'Editar Artículo' : 'Nuevo Artículo' }}</h1>
    </div>

    <!-- Estado de carga para modo edición -->
    <div v-if="isEditMode && isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Cargando artículo...</p>
    </div>

    <!-- Error al cargar para edición -->
    <div v-else-if="isEditMode && loadError" class="error-state">
      <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="error-title">Error al cargar el artículo</h3>
      <p class="error-message">{{ loadError }}</p>
      <div class="error-actions">
        <button @click="loadArticle" class="retry-button">Reintentar</button>
        <router-link to="/articulos" class="back-to-list">Volver al listado</router-link>
      </div>
    </div>

    <!-- Formulario -->
    <form v-else @submit.prevent="saveArticle" class="article-form-container">
      <!-- ID generado -->
      <div class="form-group" v-if="form.id">
        <label for="article-id" class="form-label">ID</label>
        <div class="form-id">
          <input
            id="article-id"
            type="text"
            v-model="form.id"
            readonly
            class="form-input readonly"
            title="ID generado automáticamente"
          />
          <button
            v-if="!isEditMode"
            type="button"
            @click="regenerateId"
            class="regenerate-button"
            title="Generar nuevo ID"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <small class="form-hint">UUID v4 generado automáticamente</small>
      </div>

      <!-- Título -->
      <div class="form-group" :class="{ 'has-error': errors.title }">
        <label for="article-title" class="form-label">Título *</label>
        <input 
          id="article-title"
          type="text"
          v-model="form.title"
          data-cy="article-title-input"
          :class="['form-input', { 'error': errors.title }]"
          placeholder="Introduce el título del artículo"
        />
        <small v-if="errors.title" class="error-message" data-cy="article-title-error">{{ errors.title }}</small>
      </div>

      <!-- Slug -->
      <div class="form-group" :class="{ 'has-error': errors.slug }">
        <label for="article-slug" class="form-label">Slug *</label>
        <input 
          id="article-slug"
          type="text"
          v-model="form.slug"
          data-cy="article-slug-input"
          :class="['form-input', { 'error': errors.slug }]"
          placeholder="identificador-unico-del-articulo"
        />
        <small v-if="errors.slug" class="error-message" data-cy="article-slug-error">{{ errors.slug }}</small>
        <small v-else class="form-hint">URL amigable para el artículo (solo letras minúsculas, números y guiones)</small>
      </div>
      
      <!-- Extracto -->
      <div class="form-group" :class="{ 'has-error': errors.excerpt }">
        <label for="article-excerpt" class="form-label">Extracto *</label>
        <textarea 
          id="article-excerpt"
          v-model="form.excerpt"
          data-cy="article-excerpt-input"
          :class="['form-textarea', { 'error': errors.excerpt }]"
          placeholder="Breve resumen del artículo (máx. 300 caracteres)"
          rows="3"
        ></textarea>
        <small v-if="errors.excerpt" class="error-message" data-cy="article-excerpt-error">{{ errors.excerpt }}</small>
        <small v-else class="form-hint">Breve descripción que aparecerá en los listados</small>
      </div>

      <!-- Editor Markdown -->
      <div class="form-group" :class="{ 'has-error': errors.content }">
        <label for="article-content" class="form-label">Contenido *</label>
        <div class="markdown-editor">
          <div class="editor-toolbar">
            <button type="button" class="toolbar-button" @click="insertMarkdown('**', '**')" title="Negrita">
              <strong>B</strong>
            </button>
            <button type="button" class="toolbar-button" @click="insertMarkdown('*', '*')" title="Cursiva">
              <em>I</em>
            </button>
            <button type="button" class="toolbar-button" @click="insertMarkdown('### ', '')" title="Encabezado">
              H3
            </button>
            <button type="button" class="toolbar-button" @click="insertMarkdown('> ', '')" title="Cita">
              ""
            </button>
            <button type="button" class="toolbar-button" @click="insertMarkdown('- ', '')" title="Lista">
              •
            </button>
            <button type="button" class="toolbar-button" @click="insertMarkdown('[', '](url)')" title="Enlace">
              🔗
            </button>
            <button type="button" class="toolbar-button" @click="insertMarkdown('```', '```')" title="Código">
              &lt;/&gt;
            </button>
            <div class="editor-tabs">
              <button 
                type="button"
                :class="['tab-button', { 'active': activeTab === 'write' }]" 
                @click="activeTab = 'write'"
              >
                Escribir
              </button>
              <button 
                type="button"
                :class="['tab-button', { 'active': activeTab === 'preview' }]" 
                @click="activeTab = 'preview'"
              >
                Vista Previa
              </button>
            </div>
          </div>
          <div class="editor-content">
            <textarea
              v-show="activeTab === 'write'"
              id="article-content"
              v-model="form.content"
              data-cy="article-content-input"
              :class="['form-textarea', { 'error': errors.content }]"
              placeholder="Escribe el contenido en formato Markdown..."
              rows="15"
            ></textarea>
            <div
              v-show="activeTab === 'preview'"
              class="markdown-preview"
              v-html="renderedContent"
            ></div>
          </div>
        </div>
        <small v-if="errors.content" class="error-message" data-cy="article-content-error">{{ errors.content }}</small>
        <small v-else class="form-hint">Soporta sintaxis <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer" class="hint-link">Markdown</a></small>
      </div>

      <!-- Libros relacionados -->
      <div class="form-group">
        <label class="form-label">Libros relacionados</label>
        <div v-if="isLoadingBooks" class="loading-indicator">Cargando libros...</div>
        <div v-else-if="bookOptions.length === 0" class="no-books">
          No hay libros disponibles para seleccionar.
          <router-link to="/libros/nuevo" class="create-book-link">Crear un libro</router-link>
        </div>
        <div v-else class="books-selection">
          <div 
            v-for="book in bookOptions" 
            :key="book.id" 
            :class="['book-checkbox', { 'selected': isBookSelected(book.id) }]"
            @click="toggleBookSelection(book.id)"
          >
            <div class="checkbox">
              <svg v-if="isBookSelected(book.id)" xmlns="http://www.w3.org/2000/svg" class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="book-info">
              <strong>{{ book.title }}</strong>
              <span>{{ book.author }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Enlaces relacionados -->
      <div class="form-group">
        <label class="form-label">Enlaces relacionados</label>
        <div class="related-links">
          <div v-if="form.relatedLinks.length === 0" class="no-links">
            No hay enlaces relacionados. Haz clic en "Añadir enlace" para agregar uno.
          </div>
          <div 
            v-for="(link, index) in form.relatedLinks" 
            :key="index" 
            class="link-item"
          >
            <div class="link-inputs">
              <div class="link-input-group">
                <label :for="'link-text-' + index" class="link-label">Texto</label>
                <input
                  :id="'link-text-' + index"
                  type="text"
                  v-model="link.text"
                  placeholder="Texto a mostrar"
                  class="form-input"
                />
              </div>
              <div class="link-input-group">
                <label :for="'link-url-' + index" class="link-label">URL</label>
                <input
                  :id="'link-url-' + index"
                  type="text"
                  v-model="link.url"
                  placeholder="https://ejemplo.com"
                  class="form-input"
                />
              </div>
            </div>
            <button
              type="button"
              @click="removeLink(index)"
              class="remove-link-button"
              title="Eliminar enlace"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          <button
            type="button"
            @click="addLink"
            class="add-link-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Añadir enlace
          </button>
        </div>
      </div>

      <!-- Acciones del formulario -->
      <div class="form-actions">
        <button type="button" @click="cancel" class="cancel-button" data-cy="article-cancel-button">
          Cancelar
        </button>
        <button type="submit" class="save-button" :disabled="isSaving || hasErrors" data-cy="article-submit-button">
          <span v-if="isSaving">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Guardando...
          </span>
          <span v-else>Guardar</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { articlesApi } from '../../composables/api/articlesApi';
import { booksApi } from '../../composables/api/booksApi';
import { useUIStore } from '../../stores/uiStore';
import { Article, ArticleStatus, Book } from '../../types/models';

// Props y route
const props = defineProps<{ id?: string }>();
const route = useRoute();
const router = useRouter();
const uiStore = useUIStore();
const { id } = toRefs(props);

// Estado del formulario
const form = ref({
  id: '',
  title: '',
  excerpt: '',
  content: '',
  slug: '',
  bookIds: [] as string[],
  relatedLinks: [] as Array<{ text: string; url: string }>
});

// Estado de UI
const isLoading = ref(false);
const isSaving = ref(false);
const loadError = ref('');
const errors = ref<Record<string, string>>({});
const activeTab = ref<'write' | 'preview'>('write');
const isLoadingBooks = ref(false);
const bookOptions = ref<Book[]>([]);

// Computados
const isEditMode = computed(() => Boolean(articleId.value));
const articleId = computed(() => id?.value || route.params.id as string);
const hasErrors = computed(() => Object.keys(errors.value).length > 0);

const renderedContent = computed(() => {
  if (!form.value.content) return '<p class="text-gray-400">No hay contenido para visualizar...</p>';
  const rawHtml = marked(form.value.content);
  return DOMPurify.sanitize(rawHtml);
});

// Métodos
// Funciones para manejar enlaces relacionados
function addLink() {
  form.value.relatedLinks.push({ text: '', url: '' });
}

function removeLink(index: number) {
  form.value.relatedLinks.splice(index, 1);
}

function validateForm() {
  const newErrors: Record<string, string> = {};
  
  if (!form.value.title.trim()) {
    newErrors.title = 'El título es obligatorio';
  } else if (form.value.title.length > 100) {
    newErrors.title = 'El título no puede exceder los 100 caracteres';
  }
  
  if (!form.value.slug.trim()) {
    newErrors.slug = 'El slug es obligatorio';
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.value.slug)) {
    newErrors.slug = 'El slug solo puede contener letras minúsculas, números y guiones';
  }

  if (!form.value.excerpt.trim()) {
    newErrors.excerpt = 'El extracto es obligatorio';
  } else if (form.value.excerpt.length > 300) {
    newErrors.excerpt = 'El extracto no puede exceder los 300 caracteres';
  } else if (form.value.excerpt.length < 10) {
    newErrors.excerpt = 'El extracto debe tener al menos 10 caracteres';
  }
  
  if (!form.value.content.trim()) {
    newErrors.content = 'El contenido es obligatorio';
  } else if (form.value.content.length < 10) {
    newErrors.content = 'El contenido debe tener al menos 10 caracteres';
  }
  
  // Validar enlaces relacionados
  form.value.relatedLinks.forEach((link, index) => {
    if (link.text.trim() && !link.url.trim()) {
      newErrors[`link-${index}`] = `El enlace #${index + 1} debe tener una URL`;
    } else if (!link.text.trim() && link.url.trim()) {
      newErrors[`link-${index}`] = `El enlace #${index + 1} debe tener un texto`;
    } else if (link.url.trim() && !link.url.startsWith('http')) {
      newErrors[`link-${index}`] = `La URL del enlace #${index + 1} debe comenzar con http:// o https://`;
    }
  });
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
}

function regenerateId() {
  form.value.id = uuidv4();
}

async function loadArticle() {
  if (!articleId.value) return;
  
  isLoading.value = true;
  loadError.value = '';
  
  try {
    const article = await articlesApi.getArticle(articleId.value);
    
    // Rellenar formulario con datos del artículo
    form.value = {
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      slug: article.slug,
      bookIds: article.bookIds || [],
      relatedLinks: article.relatedLinks || []
    };
    
  } catch (err: any) {
    loadError.value = err.message || 'Error al cargar el artículo';
    uiStore.addNotification({
      type: 'error',
      message: 'Error al cargar el artículo'
    });
  } finally {
    isLoading.value = false;
  }
}

async function loadBooks() {
  isLoadingBooks.value = true;
  
  try {
    // En un caso real, cargaríamos con paginación
    const response = await booksApi.getBooks({ limit: 100 });
    bookOptions.value = response.items;
  } catch (err: any) {
    uiStore.addNotification({
      type: 'warning',
      message: 'Error al cargar la lista de libros'
    });
    bookOptions.value = [];
  } finally {
    isLoadingBooks.value = false;
  }
}

function isBookSelected(bookId: string): boolean {
  return form.value.bookIds.includes(bookId);
}

function toggleBookSelection(bookId: string) {
  const index = form.value.bookIds.indexOf(bookId);
  if (index === -1) {
    form.value.bookIds.push(bookId);
  } else {
    form.value.bookIds.splice(index, 1);
  }
}

function insertMarkdown(prefix: string, suffix: string) {
  const textarea = document.getElementById('article-content') as HTMLTextAreaElement;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const beforeSelection = text.substring(0, start);
  const selection = text.substring(start, end);
  const afterSelection = text.substring(end);

  // Insertar markdown
  form.value.content = beforeSelection + prefix + selection + suffix + afterSelection;

  // Restaurar foco y selección
  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(
      start + prefix.length,
      start + prefix.length + selection.length
    );
  }, 0);
}

async function saveArticle() {
  if (!validateForm()) return;
  
  isSaving.value = true;
  
  try {
    if (isEditMode.value) {
      // Actualizar artículo existente
      await articlesApi.updateArticle(articleId.value, {
        title: form.value.title,
        excerpt: form.value.excerpt,
        content: form.value.content,
        slug: form.value.slug,
        bookIds: form.value.bookIds,
        relatedLinks: form.value.relatedLinks
      });
      
      uiStore.addNotification({
        type: 'success',
        message: 'Artículo actualizado correctamente'
      });
    } else {
      // Crear nuevo artículo
      await articlesApi.createArticle({
        id: form.value.id,
        title: form.value.title,
        excerpt: form.value.excerpt,
        content: form.value.content,
        slug: form.value.slug,
        bookIds: form.value.bookIds,
        relatedLinks: form.value.relatedLinks
      });
      
      uiStore.addNotification({
        type: 'success',
        message: 'Artículo creado correctamente'
      });
    }
    
    // Redireccionar al listado
    router.push('/articulos');
  } catch (err: any) {
    uiStore.addNotification({
      type: 'error',
      message: `Error al guardar el artículo: ${err.message || 'Error desconocido'}`
    });
  } finally {
    isSaving.value = false;
  }
}

function cancel() {
  router.push(isEditMode.value ? `/articulos/${articleId.value}` : '/articulos');
}

// Observadores
watch(
  () => form.value.title,
  () => {
    if (errors.value.title) {
      const { title, ...rest } = errors.value;
      errors.value = rest;
    }
  }
);

watch(
  () => form.value.content,
  () => {
    if (errors.value.content) {
      const { content, ...rest } = errors.value;
      errors.value = rest;
    }
  }
);

// Inicialización
onMounted(async () => {
  // Generar ID para nuevo artículo
  if (!isEditMode.value) {
    form.value.id = uuidv4();
  } else {
    await loadArticle();
  }
  
  // Cargar libros disponibles
  await loadBooks();
});
</script>

<style scoped>
.article-form {
  @apply space-y-6;
}

.form-header {
  @apply mb-6;
}

.navigation {
  @apply mb-2;
}

.back-link {
  @apply flex items-center text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300;
}

.back-icon {
  @apply mr-2 h-5 w-5;
}

.form-title {
  @apply text-2xl font-bold text-gray-900 dark:text-white;
}

/* Estados */
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

/* Formulario */
.article-form-container {
  @apply space-y-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800;
}

.form-group {
  @apply space-y-1;
}

.form-group.has-error {
  @apply space-y-0;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-id {
  @apply relative;
}

.form-input, .form-textarea {
  @apply mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white;
}

.form-input.readonly {
  @apply bg-gray-100 dark:bg-gray-800;
}

.form-input.error, .form-textarea.error {
  @apply border-red-500 pr-10;
}

.form-hint {
  @apply mt-1 block text-xs text-gray-500 dark:text-gray-400;
}

.error-message {
  @apply mt-1 block text-xs text-red-600 dark:text-red-400;
}

.regenerate-button {
  @apply absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-400;
}

/* Status toggle */
.status-toggle {
  @apply mt-1 flex rounded-md shadow-sm;
}

.status-option {
  @apply flex flex-1 items-center justify-center border border-gray-300 py-2 text-sm font-medium transition-colors first:rounded-l-md first:border-r-0 last:rounded-r-md dark:border-gray-600;
}

.status-option:not(.active) {
  @apply bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
}

.status-option.active {
  @apply bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800;
}

.status-icon {
  @apply mr-1.5 h-4 w-4;
}

/* Editor Markdown */
.markdown-editor {
  @apply mt-1 overflow-hidden rounded-md border border-gray-300 shadow-sm dark:border-gray-600;
}

.editor-toolbar {
  @apply flex flex-wrap items-center border-b border-gray-300 bg-gray-50 p-1 dark:border-gray-600 dark:bg-gray-700;
}

.toolbar-button {
  @apply rounded p-1.5 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600;
}

.editor-tabs {
  @apply ml-auto flex;
}

.tab-button {
  @apply px-3 py-1.5 text-sm font-medium;
}

.tab-button:not(.active) {
  @apply text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200;
}

.tab-button.active {
  @apply rounded bg-white text-blue-600 shadow dark:bg-gray-800 dark:text-blue-400;
}

.editor-content {
  @apply min-h-[300px];
}

.form-textarea {
  @apply h-full w-full resize-y border-none p-4 shadow-none focus:ring-0;
}

.markdown-preview {
  @apply h-full overflow-auto p-4;
  @apply prose max-w-none dark:prose-invert;
}

.hint-link {
  @apply text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300;
}

/* Libros relacionados */
.loading-indicator {
  @apply mt-1 text-sm text-gray-500 dark:text-gray-400;
}

.no-books {
  @apply mt-1 rounded-md border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400;
}

.create-book-link {
  @apply ml-1 text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300;
}

.books-selection {
  @apply mt-2 grid max-h-60 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3;
}

.book-checkbox {
  @apply flex cursor-pointer items-center space-x-3 rounded-md border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600;
}

.book-checkbox.selected {
  @apply border-blue-600 bg-blue-50 ring-2 ring-blue-600 dark:bg-blue-900/30 dark:ring-blue-500;
}

.checkbox {
  @apply flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-gray-300 bg-white dark:border-gray-500 dark:bg-gray-700;
}

.book-checkbox.selected .checkbox {
  @apply border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-700;
}

.check-icon {
  @apply h-4 w-4 text-white;
}

.book-info {
  @apply flex flex-col text-sm;
}

.book-info strong {
  @apply font-medium text-gray-900 dark:text-white;
}

.book-info span {
  @apply text-gray-500 dark:text-gray-400;
}

/* Acciones del formulario */
.form-actions {
  @apply flex justify-end space-x-4;
}

.cancel-button {
  @apply rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
}

.save-button {
  @apply inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:hover:bg-blue-400 dark:disabled:bg-blue-800;
}
</style>
