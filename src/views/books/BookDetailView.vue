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

    <div v-else-if="book" class="bg-white shadow rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-1">
          <img
            v-if="book.coverImage"
            :src="book.coverImage"
            :alt="book.title"
            class="w-full h-auto rounded"
          />
          <div v-else class="bg-gray-200 rounded p-12 text-center">
            <span class="text-gray-500">Sin imagen de portada</span>
          </div>
        </div>

        <div class="md:col-span-2">
          <dl class="space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Título</dt>
              <dd class="mt-1 text-lg">{{ book.title }}</dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-500">Autor</dt>
              <dd class="mt-1">{{ book.author }}</dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-500">Fecha de publicación</dt>
              <dd class="mt-1">{{ formatDate(book.publicationDate) }}</dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-500">Género</dt>
              <dd class="mt-1">{{ book.genre }}</dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-500">ISBN</dt>
              <dd class="mt-1">{{ book.isbn }}</dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-500">Descripción</dt>
              <dd class="mt-1" v-html="renderMarkdown(book.description)"></dd>
            </div>
          </dl>

          <div class="mt-6 flex space-x-3">
            <BaseButton
              :to="`/libros/${id}/editar`"
              variant="primary"
              label="Editar"
              icon="edit"
            />
            <BaseButton
              variant="danger"
              label="Eliminar"
              icon="trash"
              @click="openDeleteDialog"
            />
            <BaseButton :to="`/libros`" variant="secondary" label="Volver" />
          </div>
        </div>
      </div>
    </div>

    <BaseModal
      :show="showDeleteModal"
      title="Eliminar libro"
      @close="showDeleteModal = false"
    >
      <p>
        ¿Estás seguro de que deseas eliminar el libro "{{ book?.title }}"? Esta acción no
        se puede deshacer.
      </p>
      <template #footer>
        <BaseButton
          variant="secondary"
          label="Cancelar"
          @click="showDeleteModal = false"
        />
        <BaseButton
          variant="danger"
          label="Eliminar"
          :is-loading="isDeleting"
          @click="deleteBook"
        />
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import { useBooks } from "@/composables/api/useBooks";

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id as string);

// Usar el composable useBooks
const { getBookById } = useBooks();
const showDeleteModal = ref(false);
const isDeleting = ref(false);

// Obtener datos para el libro actual usando getBookById
const { data: book, isLoading, error } = getBookById(id.value);

// Crear mutación para eliminar directamente desde la API
const { mutate: deleteBookById } = useMutation({
  mutationFn: (id: string) => booksApi.deleteBook(id),
  onSuccess: () => {
    // Invalidar consultas relevantes truseMutation
    const queryClient = useQueryClient();
    queryClient.invalidateQueries({ queryKey: ["books"] });
  },
});

// Formatear fecha
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Renderizar markdown de forma segura
const renderMarkdown = (text: string) => {
  if (!text) return "";
  const rawHtml = marked(text);
  return DOMPurify.sanitize(rawHtml);
};

// Modal de confirmación para eliminar
const openDeleteDialog = () => {
  showDeleteModal.value = true;
};

// Eliminar libro
const deleteBook = async () => {
  isDeleting.value = true;
  try {
    await deleteBookById(id.value);
    router.push({ name: "books" });
  } catch (e) {
    console.error("Error al eliminar libro:", e);
  } finally {
    isDeleting.value = false;
    showDeleteModal.value = false;
  }
};
</script>
