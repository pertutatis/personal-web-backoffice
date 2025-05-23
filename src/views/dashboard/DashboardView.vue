<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <h1 class="dashboard__title">Dashboard</h1>
      <div class="dashboard__welcome">
        Bienvenido, <span class="dashboard__email">{{ userEmail }}</span>
      </div>
    </header>

    <div class="dashboard__content">
      <!-- Estado de la sesión -->
      <section class="dashboard__section">
        <h2 class="dashboard__section-title">Estado de la sesión</h2>
        <div class="dashboard__stats">
          <div class="stat-card">
            <h3 class="stat-card__title">Estado</h3>
            <p class="stat-card__value" :class="{ 'text-success': isAuthenticated }">
              {{ isAuthenticated ? 'Autenticado' : 'No autenticado' }}
            </p>
          </div>
          <div class="stat-card">
            <h3 class="stat-card__title">Token</h3>
            <p class="stat-card__value text-truncate">
              {{ currentToken ? currentToken.substring(0, 20) + '...' : 'No disponible' }}
            </p>
          </div>
        </div>
      </section>

      <!-- Resumen de contenido -->
      <section class="dashboard__section">
        <h2 class="dashboard__section-title">Resumen de contenido</h2>
        <div class="dashboard__stats">
          <div v-if="isLoading" class="dashboard__loading">
            Cargando estadísticas...
          </div>
          <template v-else>
            <div class="stat-card">
              <h3 class="stat-card__title">Artículos</h3>
              <p class="stat-card__value">{{ stats.articles || 0 }}</p>
              <router-link to="/articulos" class="stat-card__link">
                Ver artículos
              </router-link>
            </div>
            <div class="stat-card">
              <h3 class="stat-card__title">Libros</h3>
              <p class="stat-card__value">{{ stats.books || 0 }}</p>
              <router-link to="/libros" class="stat-card__link">
                Ver libros
              </router-link>
            </div>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/api/useAuth'
import { httpClient } from '@/utils/httpClient'
import { notifications } from '@/composables/useNotifications'

interface DashboardStats {
  articles: number
  books: number
}

const { isAuthenticated, currentToken, userEmail } = useAuth()
const stats = ref<DashboardStats>({ articles: 0, books: 0 })
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await httpClient.get<DashboardStats>('/backoffice/stats')
    stats.value = response
  } catch (error) {
    notifications.error('Error al cargar las estadísticas')
    console.error('Error al cargar estadísticas:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.dashboard {
  padding: 1rem;
}

.dashboard__header {
  margin-bottom: 2rem;
}

.dashboard__title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem;
}

.dashboard__welcome {
  color: #666;
}

.dashboard__email {
  font-weight: 600;
  color: #333;
}

.dashboard__content {
  display: grid;
  gap: 2rem;
}

.dashboard__section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dashboard__section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem;
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.dashboard__loading {
  grid-column: 1 / -1;
  text-align: center;
  color: #666;
  padding: 2rem;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1.25rem;
  border: 1px solid #e9ecef;
}

.stat-card__title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  margin: 0 0 0.5rem;
}

.stat-card__value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.stat-card__link {
  display: inline-block;
  margin-top: 1rem;
  color: #0d6efd;
  text-decoration: none;
  font-size: 0.875rem;
}

.stat-card__link:hover {
  text-decoration: underline;
}

.text-success {
  color: #198754;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  font-family: monospace;
}
</style>
