<template>
  <div class="book-form">
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-6">{{ isEditMode ? 'Editar libro' : 'Crear nuevo libro' }}</h2>

      <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ errors, isSubmitting }">
        <!-- Título -->
        <div class="mb-4">
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

        <!-- Autor -->
        <div class="mb-4">
          <label for="author" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Autor
          </label>
          <Field
            id="author"
            name="author"
            type="text"
            v-model="formData.author"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500 focus:ring-red-500': errors.author }"
          />
          <ErrorMessage name="author" class="mt-1 text-sm text-red-600 dark:text-red-400" />
        </div>

        <!-- ISBN -->
        <div class="mb-4">
          <label for="isbn" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            ISBN
          </label>
          <Field
            id="isbn"
            name="isbn"
            type="text"
            v-model="formData.isbn"
            placeholder="Formato ISBN-10 o ISBN-13"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono"
            :class="{ 'border-red-500 focus:ring-red-500': errors.isbn }"
          />
          <ErrorMessage name="isbn" class="mt-1 text-sm text-red-600 dark:text-red-400" />
          <p v-if="!errors.isbn" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Introduce el ISBN sin guiones. Se aceptan ISBN-10 (10 dígitos) e ISBN-13 (13 dígitos).
          </p>
        </div>

        <!-- Año de publicación -->
        <div class="mb-4">
          <label for="year" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Año de publicación
          </label>
          <Field
            id="year"
            name="year"
            type="number"
            v-model="formData.year"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500 focus:ring-red-500': errors.year }"
          />
          <ErrorMessage name="year" class="mt-1 text-sm text-red-600 dark:text-red-400" />
        </div>

        <!-- Descripción -->
        <div class="mb-6">
          <label for="description" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Descripción
          </label>
          <Field
            as="textarea"
            id="description"
            name="description"
            v-model="formData.description"
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500 focus:ring-red-500': errors.description }"
          />
          <ErrorMessage name="description" class="mt-1 text-sm text-red-600 dark:text-red-400" />
        </div>

        <!-- Artículos relacionados (solo en modo edición) -->
        <div v-if="isEditMode && relatedArticles.length > 0" class="mb-6">
          <h3 class="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
            Artículos relacionados
          </h3>
          <div class="space-y-2 max-h-60 overflow-y-auto p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900">
            <div v-for="article in relatedArticles" :key="article.id" class="py-2">
              <div class="font-medium text-blue-600 dark:text-blue-400">
                <router-link :to="`/articles/${article.id}`">
                  {{ article.title }}
                </router-link>
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ article.status === 'published' ? 'Publicado' : 'Borrador' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end space-x-3 mt-8">
          <router-link
            :to="{ path: '/books' }"
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
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, PropType } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { toFormValidator } from '@vee-validate/zod';
import { Book, BookCreate, BookUpdate, Article } from '../../types/models';

const props = defineProps({
  book: {
    type: Object as PropType<Book>,
    default: null
  },
  relatedArticles: {
    type: Array as PropType<Article[]>,
    default: () => []
  }
});

const emit = defineEmits<{
  (e: 'save', book: BookCreate | BookUpdate): void
}>();

const isEditMode = computed(() => !!props.book);

// Esquema de validación con Zod
const validationSchema = toFormValidator(
  z.object({
    title: z.string()
      .min(3, 'El título debe tener al menos 3 caracteres')
      .max(100, 'El título no puede exceder los 100 caracteres'),
    author: z.string()
      .min(3, 'El autor debe tener al menos 3 caracteres')
      .max(100, 'El autor no puede exceder los 100 caracteres'),
    isbn: z.string()
      .refine(
        (value) => {
          // Eliminar guiones y espacios para la validación
          const cleanedValue = value.replace(/[-\s]/g, '');
          // Validar ISBN-10 o ISBN-13
          return (
            (cleanedValue.length === 10 && /^[\dX]{10}$/.test(cleanedValue)) ||
            (cleanedValue.length === 13 && /^\d{13}$/.test(cleanedValue))
          );
        },
        { message: 'Debe ser un ISBN-10 o ISBN-13 válido' }
      ),
    year: z.number()
      .int('El año debe ser un número entero')
      .min(1000, 'El año debe ser posterior a 1000')
      .max(new Date().getFullYear() + 5, `El año no puede ser posterior a ${new Date().getFullYear() + 5}`),
    description: z.string()
      .optional()
  })
);

// Datos del formulario
const formData = ref<{
  id: string;
  title: string;
  author: string;
  isbn: string;
  year: number;
  description: string;
}>({
  id: '',
  title: '',
  author: '',
  isbn: '',
  year: new Date().getFullYear(),
  description: ''
});

// Si estamos en modo edición, cargar los datos del libro
watch(
  () => props.book,
  (newBook) => {
    if (newBook) {
      formData.value = {
        id: newBook.id,
        title: newBook.title,
        author: newBook.author,
        isbn: newBook.isbn,
        year: newBook.year,
        description: newBook.description || ''
      };
    } else {
      // Generar un nuevo UUID para crear un nuevo libro
      formData.value.id = uuidv4();
    }
  },
  { immediate: true }
);

// Guardar el libro
const onSubmit = async () => {
  // Limpiar el ISBN (quitar guiones y espacios)
  formData.value.isbn = formData.value.isbn.replace(/[-\s]/g, '');

  if (isEditMode.value) {
    // Edición: enviar solo los campos actualizables
    const updateData: BookUpdate = {
      title: formData.value.title,
      author: formData.value.author,
      isbn: formData.value.isbn,
      year: formData.value.year,
      description: formData.value.description
    };
    emit('save', updateData);
  } else {
    // Creación: enviar todos los campos
    const createData: BookCreate = {
      id: formData.value.id,
      title: formData.value.title,
      author: formData.value.author,
      isbn: formData.value.isbn,
      year: formData.value.year,
      description: formData.value.description
    };
    emit('save', createData);
  }
};

onMounted(() => {
  // Si no hay un libro para editar, generar un nuevo UUID
  if (!props.book) {
    formData.value.id = uuidv4();
  }
});
</script>
