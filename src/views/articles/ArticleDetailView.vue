<template>
  <div class="article-detail" v-if="article">
    <header class="article-detail__header">
      <h1 class="article-detail__title">{{ article.title }}</h1>
      <div class="article-detail__meta">
        <span :class="['article-detail__status', statusClass]">
          {{ statusText }}
        </span>
        <span class="article-detail__date">
          {{ formatDate(article.updatedAt) }}
        </span>
      </div>
    </header>

    <div class="article-detail__content" v-html="sanitizedContent"></div>
    
    <section v-if="books.length" class="article-detail__books">
      <h2>Libros relacionados</h2>
      <div class="article-detail__books-grid">
        <div v-for="book in books" :key="book.id" class="book-card">
          <h3>{{ book.title }}</h3>
          <p>{{ book.author }}</p>
          <BaseButton @click="viewBook(book.id)">Ver libro</BaseButton>
        </div>
      </div>
    </section>

    <div class="article-detail__actions">
      <BaseButton @click="editArticle" variant="primary">
        Editar artículo
      </BaseButton>
      <BaseButton @click="showDeleteModal = true" variant="danger">
        Eliminar artículo
      </BaseButton>
    </div>
  </div>

  <BaseModal
    v-model="showDeleteModal"
    title="Confirmar eliminación"
    @confirm="deleteArticle"
  >
    <p>¿Estás seguro de que quieres eliminar este artículo?</p>
    <p>Esta acción no se puede deshacer.</p>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Article, ArticleStatus, Book } from '@/types/models'
import { sanitizeHtml } from '@/utils/sanitize'
import { useArticles } from '@/composables/api/useArticles'
import { useBooks } from '@/composables/api/useBooks'
import { notifications } from '@/composables/useNotifications'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

export default defineComponent({
  name: 'ArticleDetailView',
  components: {
    BaseButton,
    BaseModal
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const id = ref(route.params.id as string)
    const article = ref<Article | null>(null)
    const books = ref<Book[]>([])
    const showDeleteModal = ref(false)

    const { getArticle, deleteArticle: removeArticle } = useArticles()
    const { getBook } = useBooks()

    // Contenido sanitizado
    const sanitizedContent = computed(() => {
      if (!article.value?.content) return ''
      return sanitizeHtml(article.value.content)
    })

    // Estado del artículo
    const statusText = computed(() => {
      if (!article.value) return ''
      switch (article.value.status) {
        case ArticleStatus.DRAFT:
          return 'Borrador'
        case ArticleStatus.PUBLISHED:
          return 'Publicado'
        case ArticleStatus.ARCHIVED:
          return 'Archivado'
        default:
          return ''
      }
    })

    const statusClass = computed(() => {
      if (!article.value) return ''
      switch (article.value.status) {
        case ArticleStatus.DRAFT:
          return 'status-draft'
        case ArticleStatus.PUBLISHED:
          return 'status-published'
        case ArticleStatus.ARCHIVED:
          return 'status-archived'
        default:
          return ''
      }
    })

    // Cargar artículo y libros relacionados
    async function loadArticle() {
      try {
        const data = await getArticle(id.value)
        article.value = data
        await loadRelatedBooks()
      } catch (error) {
        notifications.error('Error al cargar el artículo')
        router.push('/articulos')
      }
    }

    async function loadRelatedBooks() {
      if (!article.value?.bookIds.length) return

      try {
        const bookPromises = article.value.bookIds.map(async (id) => {
          try {
            return await getBook(id)
          } catch {
            return null
          }
        })

        const results = await Promise.all(bookPromises)
        books.value = results.filter((book): book is Book => book !== null)
      } catch {
        notifications.error('Error al cargar los libros relacionados')
      }
    }

    // Navegación
    function editArticle() {
      router.push(`/articulos/${id.value}/editar`)
    }

    function viewBook(bookId: string) {
      router.push(`/libros/${bookId}`)
    }

    // Eliminar artículo
    async function deleteArticle() {
      try {
        await removeArticle(id.value)
        notifications.success('Artículo eliminado correctamente')
        router.push('/articulos')
      } catch {
        notifications.error('Error al eliminar el artículo')
      }
    }

    // Formato de fecha
    function formatDate(date: string) {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Inicializar
    loadArticle()

    return {
      article,
      books,
      showDeleteModal,
      sanitizedContent,
      statusText,
      statusClass,
      editArticle,
      viewBook,
      deleteArticle,
      formatDate
    }
  }
})
</script>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.article-detail__header {
  margin-bottom: 2rem;
}

.article-detail__title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0 0 1rem;
}

.article-detail__meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  color: #666;
}

.article-detail__status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-draft {
  background-color: #fef3c7;
  color: #92400e;
}

.status-published {
  background-color: #dcfce7;
  color: #166534;
}

.status-archived {
  background-color: #f3f4f6;
  color: #4b5563;
}

.article-detail__content {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #374151;
  margin-bottom: 2rem;
}

.article-detail__books {
  margin: 2rem 0;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.article-detail__books h2 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  color: #2c3e50;
}

.article-detail__books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.book-card {
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.book-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  color: #2c3e50;
}

.book-card p {
  margin: 0 0 1rem;
  color: #666;
}

.article-detail__actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}
</style>
