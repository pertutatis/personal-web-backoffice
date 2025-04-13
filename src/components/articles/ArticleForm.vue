<template>
  <div class="article-form">
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-6" data-cy="article-form-title">{{ isEditMode ? 'Editar artículo' : 'Crear nuevo artículo' }}</h2>

      <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ errors, isSubmitting }" data-cy="article-form">
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
            data-cy="article-title-input"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500 focus:ring-red-500': errors.title }"
          />
          <ErrorMessage name="title" class="mt-1 text-sm text-red-600 dark:text-red-400" data-cy="article-title-error" />
        </div>

        <!-- Slug -->
        <div class="mb-6">
          <label for="slug" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Slug
          </label>
          <Field
            id="slug"
            name="slug"
            type="text"
            v-model="formData.slug"
            data-cy="article-slug-input"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500 focus:ring-red-500': errors.slug }"
          />
          <ErrorMessage name="slug" class="mt-1 text-sm text-red-600 dark:text-red-400" data-cy="article-slug-error" />
        </div>

        <!-- Extracto -->
        <div class="mb-6">
          <label for="excerpt" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Extracto
          </label>
          <Field
            as="textarea"
            id="excerpt"
            name="excerpt"
            v-model="formData.excerpt"
            data-cy="article-excerpt-input"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500 focus:ring-red-500': errors.excerpt }"
          />
          <ErrorMessage name="excerpt" class="mt-1 text-sm text-red-600 dark:text-red-400" data-cy="article-excerpt-error" />
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
                v-model="formData.bookIds"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label :for="`book-${book.id}`" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                {{ book.title }} ({{ book.author }})
              </label>
            </div>
          </div>
        </div>

        <!-- Enlaces relacionados -->
        <div class="mb-6">
          <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Enlaces relacionados
          </label>
          <div v-for="(link, index) in formData.relatedLinks" :key="index" class="flex mb-2 gap-2">
            <input
              type="text"
              v-model="link.text"
              placeholder="Texto del enlace"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              v-model="link.url"
              placeholder="URL"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              @click="removeRelatedLink(index)"
              class="px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <span class="sr-only">Eliminar</span>
              <span>×</span>
            </button>
          </div>
          <button
            type="button"
            @click="addRelatedLink"
            class="mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Añadir enlace relacionado
          </button>
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
    slug: z.string()
      .min(3, 'El slug debe tener al menos 3 caracteres')
      .max(100, 'El slug no puede exceder los 100 caracteres')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
    excerpt: z.string()
      .min(10, 'El extracto debe tener al menos 10 caracteres')
      .max(300, 'El extracto no puede exceder los 300 caracteres'),
    content: z.string()
      .min(10, 'El contenido debe tener al menos 10 caracteres'),
  })
);

// Función para convertir el título a slug
const titleToSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios por guiones
    .replace(/-+/g, '-'); // Eliminar guiones duplicados
};

// Datos del formulario
const formData = ref<{
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  bookIds: string[];
  relatedLinks: Array<{ text: string; url: string }>;
}>({
  id: '',
  title: '',
  excerpt: '',
  content: '',
  slug: '',
  bookIds: [],
  relatedLinks: []
});

// Si estamos en modo edición, cargar los datos del artículo
watch(
  () => props.article,
  (newArticle) => {
    if (newArticle) {
      formData.value = {
        id: newArticle.id,
        title: newArticle.title,
        excerpt: newArticle.excerpt,
        content: newArticle.content,
        slug: newArticle.slug,
        bookIds: newArticle.bookIds || [],
        relatedLinks: newArticle.relatedLinks || []
      };
    } else {
      // Generar un nuevo UUID para crear un nuevo artículo
      formData.value.id = uuidv4();
    }
  },
  { immediate: true }
);

// Generar automáticamente el slug cuando se cambia el título si estamos creando un nuevo artículo
watch(
  () => formData.value.title,
  (newTitle) => {
    if (!isEditMode.value && newTitle) {
      formData.value.slug = titleToSlug(newTitle);
    }
  }
);

// Funciones para manejar los enlaces relacionados
const addRelatedLink = () => {
  formData.value.relatedLinks.push({ text: '', url: '' });
};

const removeRelatedLink = (index: number) => {
  formData.value.relatedLinks.splice(index, 1);
};

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
      excerpt: formData.value.excerpt,
      content: formData.value.content,
      slug: formData.value.slug,
      bookIds: formData.value.bookIds,
      relatedLinks: formData.value.relatedLinks
    };
    emit('save', updateData);
  } else {
    // Creación: enviar todos los campos
    const createData: ArticleCreate = {
      id: formData.value.id,
      title: formData.value.title,
      excerpt: formData.value.excerpt,
      content: formData.value.content,
      slug: formData.value.slug,
      bookIds: formData.value.bookIds,
      relatedLinks: formData.value.relatedLinks
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
