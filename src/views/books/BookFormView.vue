<template>
  <div class="book-form">
    <!-- Navegación y acciones -->
    <div class="form-header">
      <div class="navigation">
        <router-link to="/libros" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Volver al listado</span>
        </router-link>
      </div>
      <h1 class="form-title">{{ isEditMode ? 'Editar Libro' : 'Nuevo Libro' }}</h1>
    </div>

    <!-- Estado de carga para modo edición -->
    <div v-if="isEditMode && isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Cargando libro...</p>
    </div>

    <!-- Error al cargar para edición -->
    <div v-else-if="isEditMode && loadError" class="error-state">
      <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="error-title">Error al cargar el libro</h3>
      <p class="error-message">{{ loadError }}</p>
      <div class="error-actions">
        <button @click="loadBook" class="retry-button">Reintentar</button>
        <router-link to="/libros" class="back-to-list">Volver al listado</router-link>
      </div>
    </div>

    <!-- Formulario -->
    <form v-else @submit.prevent="saveBook" class="book-form-container">
      <!-- ID generado -->
      <div class="form-group" v-if="form.id">
        <label for="book-id" class="form-label">ID</label>
        <div class="form-id">
          <input
            id="book-id"
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
        <label for="book-title" class="form-label">Título *</label>
        <input 
          id="book-title"
          type="text"
          v-model="form.title"
          data-cy="book-title-input"
          :class="['form-input', { 'error': errors.title }]"
          placeholder="Introduce el título del libro"
        />
        <small v-if="errors.title" class="error-message" data-cy="book-title-error">{{ errors.title }}</small>
      </div>

      <!-- Autor -->
      <div class="form-group" :class="{ 'has-error': errors.author }">
        <label for="book-author" class="form-label">Autor *</label>
        <input 
          id="book-author"
          type="text"
          v-model="form.author"
          data-cy="book-author-input"
          :class="['form-input', { 'error': errors.author }]"
          placeholder="Nombre del autor"
        />
        <small v-if="errors.author" class="error-message" data-cy="book-author-error">{{ errors.author }}</small>
      </div>

      <!-- ISBN -->
      <div class="form-group" :class="{ 'has-error': errors.isbn }">
        <label for="book-isbn" class="form-label">ISBN *</label>
        <input 
          id="book-isbn"
          type="text"
          v-model="form.isbn"
          data-cy="book-isbn-input"
          :class="['form-input', { 'error': errors.isbn }]"
          placeholder="ISBN (10 o 13 dígitos)"
        />
        <small v-if="errors.isbn" class="error-message" data-cy="book-isbn-error">{{ errors.isbn }}</small>
        <small v-else class="form-hint">ISBN-10 o ISBN-13 (sin guiones)</small>
      </div>

      <!-- Año de publicación -->
      <div class="form-group" :class="{ 'has-error': errors.year }">
        <label for="book-year" class="form-label">Año de publicación</label>
        <input 
          id="book-year"
          type="number"
          v-model="form.year"
          data-cy="book-year-input"
          :class="['form-input', { 'error': errors.year }]"
          placeholder="Año de publicación"
          min="1000"
          max="2100"
        />
        <small v-if="errors.year" class="error-message" data-cy="book-year-error">{{ errors.year }}</small>
      </div>

      <!-- Descripción -->
      <div class="form-group" :class="{ 'has-error': errors.description }">
        <label for="book-description" class="form-label">Descripción *</label>
        <textarea 
          id="book-description"
          v-model="form.description"
          data-cy="book-description-input"
          :class="['form-textarea', { 'error': errors.description }]"
          placeholder="Descripción del libro"
          rows="4"
        ></textarea>
        <small v-if="errors.description" class="error-message" data-cy="book-description-error">{{ errors.description }}</small>
      </div>

      <!-- Enlace de compra -->
      <div class="form-group" :class="{ 'has-error': errors.purchaseLink }">
        <label for="book-purchase-link" class="form-label">Enlace de compra</label>
        <input 
          id="book-purchase-link"
          type="url"
          v-model="form.purchaseLink"
          data-cy="book-purchase-link-input"
          :class="['form-input', { 'error': errors.purchaseLink }]"
          placeholder="https://tienda.com/libro (opcional)"
        />
        <small v-if="errors.purchaseLink" class="error-message" data-cy="book-purchase-link-error">{{ errors.purchaseLink }}</small>
        <small v-else class="form-hint">URL donde se puede adquirir el libro</small>
      </div>


      <!-- Acciones del formulario -->
      <div class="form-actions">
        <button type="button" @click="cancel" class="cancel-button" data-cy="book-cancel-button">
          Cancelar
        </button>
        <button type="submit" class="save-button" :disabled="isSaving || hasErrors" data-cy="book-submit-button">
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
import { booksApi } from '../../composables/api/booksApi';
import { useUIStore } from '../../stores/uiStore';
import { Book } from '../../types/models';
import { useQueryClient, useMutation } from '@tanstack/vue-query';

// Props y route
const props = defineProps<{ id?: string }>();
const route = useRoute();
const router = useRouter();
const uiStore = useUIStore();
const queryClient = useQueryClient(); // Inicializar queryClient en el nivel superior
const { id } = toRefs(props);

// Estado del formulario
const form = ref({
  id: '',
  title: '',
  author: '',
  isbn: '',
  description: '',
  purchaseLink: null as string | null
});

// Estado de UI
const isLoading = ref(false);
const isSaving = ref(false);
const loadError = ref('');
const errors = ref<Record<string, string>>({});

// Computados
const isEditMode = computed(() => Boolean(bookId.value));
const bookId = computed(() => id?.value || route.params.id as string);
const hasErrors = computed(() => Object.keys(errors.value).length > 0);

// Métodos de validación

// Validar ISBN-10
function isValidIsbn10(isbn: string): boolean {
  if (!/^\d{9}[\dX]$/.test(isbn)) {
    return false;
  }

  // Validar dígito de control
  const digits = isbn.split('').map((c, i) => {
    if (i === 9 && c === 'X') {
      return 10;
    }
    return parseInt(c, 10);
  });

  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += (10 - i) * digits[i];
  }

  return sum % 11 === 0;
}

// Validar ISBN-13
function isValidIsbn13(isbn: string): boolean {
  if (!/^\d{13}$/.test(isbn)) {
    return false;
  }

  // Validar dígito de control
  const digits = isbn.split('').map(c => parseInt(c, 10));
  let sum = 0;
  
  for (let i = 0; i < 12; i++) {
    sum += (i % 2 === 0) ? digits[i] : digits[i] * 3;
  }

  const check = (10 - (sum % 10)) % 10;
  return check === digits[12];
}

// Normalizar ISBN (quitar guiones y espacios)
function normalizeIsbn(isbn: string): string {
  return isbn.replace(/[- ]/g, '');
}

// Validar URL
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

function validateForm() {
  const newErrors: Record<string, string> = {};
  
  if (!form.value.title.trim()) {
    newErrors.title = 'El título es obligatorio';
  } else if (form.value.title.length > 100) {
    newErrors.title = 'El título no puede exceder los 100 caracteres';
  }
  
  if (!form.value.author.trim()) {
    newErrors.author = 'El autor es obligatorio';
  } else if (form.value.author.length > 100) {
    newErrors.author = 'El autor no puede exceder los 100 caracteres';
  }
  
  // Validar ISBN
  const normalizedIsbn = normalizeIsbn(form.value.isbn);
  if (!normalizedIsbn) {
    newErrors.isbn = 'El ISBN es obligatorio';
  } else if (normalizedIsbn.length !== 10 && normalizedIsbn.length !== 13) {
    newErrors.isbn = 'El ISBN debe tener 10 o 13 dígitos';
  } else if (normalizedIsbn.length === 10 && !isValidIsbn10(normalizedIsbn)) {
    newErrors.isbn = 'ISBN-10 no válido';
  } else if (normalizedIsbn.length === 13 && !isValidIsbn13(normalizedIsbn)) {
    newErrors.isbn = 'ISBN-13 no válido';
  }
  
  // Validar descripción
  if (!form.value.description.trim()) {
    newErrors.description = 'La descripción es obligatoria';
  }
  
  // Validar enlace de compra si está presente
  if (form.value.purchaseLink && !isValidUrl(form.value.purchaseLink)) {
    newErrors.purchaseLink = 'El enlace de compra debe ser una URL válida';
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
}

function regenerateId() {
  form.value.id = uuidv4();
}

async function loadBook() {
  if (!bookId.value) return;
  
  isLoading.value = true;
  loadError.value = '';
  
  try {
    const book = await booksApi.getBook(bookId.value);
    
    // Rellenar formulario con datos del libro
    form.value = {
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      description: book.description,
      purchaseLink: book.purchaseLink
    };
    
  } catch (err: any) {
    loadError.value = err.message || 'Error al cargar el libro';
    uiStore.addNotification({
      type: 'error',
      message: 'Error al cargar el libro'
    });
  } finally {
    isLoading.value = false;
  }
}

// Crear mutación para actualizar un libro
const { mutate: updateBook } = useMutation({
  mutationFn: (data: { id: string, bookData: Partial<Book> }) => 
    booksApi.updateBook(data.id, data.bookData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["books"] });
    uiStore.addNotification({
      type: 'success',
      message: 'Libro actualizado correctamente'
    });
    router.push('/libros');
  },
  onError: (error: Error) => {
    uiStore.addNotification({
      type: 'error',
      message: `Error al actualizar el libro: ${error.message || 'Error desconocido'}`
    });
  }
});

// Crear mutación para crear un libro
const { mutate: createBook } = useMutation({
  mutationFn: (bookData: Book) => booksApi.createBook(bookData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["books"] });
    uiStore.addNotification({
      type: 'success',
      message: 'Libro creado correctamente'
    });
    router.push('/libros');
  },
  onError: (error: Error) => {
    uiStore.addNotification({
      type: 'error',
      message: `Error al crear el libro: ${error.message || 'Error desconocido'}`
    });
  }
});

function saveBook() {
  if (!validateForm()) return;
  
  // Normalizar ISBN antes de guardar
  form.value.isbn = normalizeIsbn(form.value.isbn);
  
  isSaving.value = true;
  
  if (isEditMode.value) {
    // Actualizar libro existente usando la mutación
    updateBook({
      id: bookId.value,
      bookData: {
        title: form.value.title,
        author: form.value.author,
        isbn: form.value.isbn,
        description: form.value.description,
        purchaseLink: form.value.purchaseLink
      }
    }, {
      onSettled: () => {
        isSaving.value = false;
      }
    });
  } else {
    // Crear nuevo libro usando la mutación
    createBook({
      id: form.value.id,
      title: form.value.title,
      author: form.value.author,
      isbn: form.value.isbn,
      description: form.value.description,
      purchaseLink: form.value.purchaseLink
    }, {
      onSettled: () => {
        isSaving.value = false;
      }
    });
  }
}

function cancel() {
  router.push(isEditMode.value ? `/libros/${bookId.value}` : '/libros');
}

// Observadores para limpiar errores cuando cambian los campos
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
  () => form.value.author,
  () => {
    if (errors.value.author) {
      const { author, ...rest } = errors.value;
      errors.value = rest;
    }
  }
);

watch(
  () => form.value.isbn,
  () => {
    if (errors.value.isbn) {
      const { isbn, ...rest } = errors.value;
      errors.value = rest;
    }
  }
);

watch(
  () => form.value.description,
  () => {
    if (errors.value.description) {
      const { description, ...rest } = errors.value;
      errors.value = rest;
    }
  }
);

watch(
  () => form.value.purchaseLink,
  () => {
    if (errors.value.purchaseLink) {
      const { purchaseLink, ...rest } = errors.value;
      errors.value = rest;
    }
  }
);

// Inicialización
onMounted(async () => {
  // Generar ID para nuevo libro
  if (!isEditMode.value) {
    form.value.id = uuidv4();
  } else {
    await loadBook();
  }
});
</script>

<style scoped>
.book-form {
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
.book-form-container {
  @apply space-y-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800;
}

.form-row {
  @apply grid grid-cols-1 gap-6 md:grid-cols-2;
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

/* Vista previa de portada */
.cover-preview {
  @apply space-y-2;
}

.preview-title {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}

.preview-container {
  @apply flex h-48 w-36 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-900;
}

.preview-image {
  @apply max-h-full max-w-full object-contain;
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
