<template>
  <div class="article-form">
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-6">{{ isEditMode ? 'Editar artículo' : 'Crear nuevo artículo' }}</h2>

      <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ errors, isSubmitting }">
        <!-- Título -->
        <div class="mb-6">
          <label for="title" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Título
          </label>
          <Field
            id="title"
            name="title"
            type="text"
            v-model="formData.title"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500 focus:ring-red-500': errors.title }"
          />
          <ErrorMessage name="title" class="mt-1 text-sm text-red-600 dark:text-red-400" />
        </div>

        <!-- Estado -->
        <div class="mb-6">
          <label for="status" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Estado
          </label>
          <Field
            as="select"
            id="status"
            name="status"
            v-model="formData.status"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500 focus:ring-red-500': errors.status }"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </Field>
          <ErrorMessage name="status" class="mt-1 text-sm text-red-600 dark:text-red-400" />
        </div>

        <!-- Contenido (markdown) -->
        <div class="mb-6">
          <label for="content" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Contenido (Markdown)
          </label>
          <Field
            as="textarea"
            id="content"
            name="content"
            v-model="formData.content"
            rows="10"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono"
            :class="{ 'border-red-500 focus:ring-red-500': errors.content }"
          />
          <ErrorMessage name="content" class="mt-1 text-sm text-red-600 dark:text-red-400" />
        </div>

        <!-- Libros relacionados -->
        <div class="mb-6">
          <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Libros relacionados
          </label>
          <div v-if="loadingBooks" class="text-gray-500 dark:text-gray-400">
            Cargando libros...
          </div>
          <div v-else-if="books.length === 0" class="text-gray-500 dark:text-gray-400">
            No hay libros disponibles
          </div>
          <div v-else class="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md">
            <div
              v-for="book in books"
              :key="book.id"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :id="`book-${book.id}`"
                :value="book.id"
                v-model="formData.relatedBookIds"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label :for="`book-${book.id}`" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                {{ book.title }} ({{ book.author }})
              </label>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end space-x-3 mt-8">
          <router-link
            :to="{ path: '/articles' }"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancelar
          </router-link>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </Form>
    </div>

    <!-- Vista previa Markdown -->
    <div v-if="formData.content" class="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h3 class="text-xl font-bold mb-4">Vista previa</h3>
      <div class="prose prose-blue max-w-none dark:prose-invert" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, PropType } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { toFormValidator } from '@vee-validate/zod';
import { marked } from 'marked';
import { Book, Article, ArticleCreate, ArticleUpdate } from '../../types/models';

const props = defineProps({
  article: {
    type: Object as PropType<Article>,
    default: null
  },
  books: {
    type: Array as PropType<Book[]>,
    default: () => []
  },
  loadingBooks: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  (e: 'save', article: ArticleCreate | ArticleUpdate): void
}>();

const router = useRouter();

const isEditMode = computed(() => !!props.article);

// Esquema de validación con Zod
const validationSchema = toFormValidator(
  z.object({
    title: z.string()
      .min(3, 'El título debe tener al menos 3 caracteres')
      .max(100, 'El título no puede exceder los 100 caracteres'),
    content: z.string()
      .min(10, 'El contenido debe tener al menos 10 caracteres'),
    status: z.enum(['draft', 'published'], {
      errorMap: () => ({ message: 'El estado debe ser borrador o publicado' })
    }),
  })
);

// Datos del formulario
const formData = ref<{
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  relatedBookIds: string[];
}>({
  id: '',
  title: '',
  content: '',
  status: 'draft',
  relatedBookIds: []
});

// Si estamos en modo edición, cargar los datos del artículo
watch(
  () => props.article,
  (newArticle) => {
    if (newArticle) {
      formData.value = {
        id: newArticle.id,
        title: newArticle.title,
        content: newArticle.content,
        status: newArticle.status,
        relatedBookIds: newArticle.relatedBookIds || []
      };
    } else {
      // Generar un nuevo UUID para crear un nuevo artículo
      formData.value.id = uuidv4();
    }
  },
  { immediate: true }
);

// Renderizar la vista previa Markdown
const renderedContent = computed(() => {
  if (!formData.value.content) return '';
  return marked(formData.value.content);
});

// Guardar el artículo
const onSubmit = async () => {
  if (isEditMode.value) {
    // Edición: enviar solo los campos actualizables
    const updateData: ArticleUpdate = {
      title: formData.value.title,
      content: formData.value.content,
      status: formData.value.status,
      relatedBookIds: formData.value.relatedBookIds
    };
    emit('save', updateData);
  } else {
    // Creación: enviar todos los campos
    const createData: ArticleCreate = {
      id: formData.value.id,
      title: formData.value.title,
      content: formData.value.content,
      status: formData.value.status,
      relatedBookIds: formData.value.relatedBookIds
    };
    emit('save', createData);
  }
};

onMounted(() => {
  // Si no hay un artículo para editar, generar un nuevo UUID
  if (!props.article) {
    formData.value.id = uuidv4();
  }
});
</script>

<style>
/* Estilos para el editor markdown si lo deseas */
</style>
