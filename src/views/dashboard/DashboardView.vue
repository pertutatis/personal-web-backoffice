<template>
  <div class="dashboard p-6 bg-gray-100 dark:bg-gray-900">
    <section class="welcome-section mb-8 flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2" data-cy="page-title">Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-300">
          Gestiona el contenido de tu blog personal desde este panel de administración.
        </p>
      </div>
      <button 
        @click="refetch" 
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        :disabled="isLoading"
      >
        <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualizar
      </button>
    </section>

    <section class="stats-section mb-10">
      <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Estadísticas Generales</h2>
      <div class="stats-grid">
        <!-- Estadística de artículos -->
        <div class="stat-card" :class="{ 'loading': isLoading }">
          <div class="stat-icon bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-title">Total de Artículos</h3>
            <p class="stat-value">
              <span v-if="isLoading" class="inline-block w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
              <span v-else>{{ stats.totalArticles }}</span>
            </p>
            
              <div class="stat-info">
                <span v-if="stats.publishedArticles !== undefined">{{ stats.publishedArticles }} publicados</span>
              </div>
              <router-link to="/articulos" class="stat-link">
                Ver todos →
              </router-link>
            
          </div>
        </div>

        <!-- Estadística de libros -->
        <div class="stat-card" :class="{ 'loading': isLoading }">
          <div class="stat-icon bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-title">Total de Libros</h3>
            <p class="stat-value">
              <span v-if="isLoading" class="inline-block w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
              <span v-else>{{ stats.totalBooks }}</span>
            </p>
            
              <div class="stat-info">
                <span v-if="stats.recentBooks !== undefined">{{ stats.recentBooks }} nuevos este mes</span>
              </div>
              <router-link to="/libros" class="stat-link">
                Ver todos →
              </router-link>
            
          </div>
        </div>
    
      </div>
    </section>

    <!-- Sección de acciones rápidas -->
    <section class="quick-actions mb-10">
      <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Acciones Rápidas</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link to="/articulos/nuevo" class="action-card">
          <div class="action-icon bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span class="action-text">Crear Artículo</span>
        </router-link>

        <router-link to="/libros/nuevo" class="action-card">
          <div class="action-icon bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span class="action-text">Crear Libro</span>
        </router-link>

        <router-link to="/articulos" class="action-card">
          <div class="action-icon bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2M8 7h12" />
            </svg>
          </div>
          <span class="action-text">Ver Artículos</span>
        </router-link>

        <router-link to="/libros" class="action-card">
          <div class="action-icon bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2M8 7h12" />
            </svg>
          </div>
          <span class="action-text">Ver Libros</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { articlesApi } from '../../composables/api/articlesApi';
import { booksApi } from '../../composables/api/booksApi';
import { useUIStore } from '../../stores/uiStore';

const uiStore = useUIStore();
const isLoading = ref(true);

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha inválida';
  
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Estadísticas iniciales
const stats = ref({
  totalArticles: 0,
  totalBooks: 0,
  publishedArticles: 0,
  draftArticles: 0,
  recentBooks: 0,
  lastUpdate: new Date().toISOString(),
  lastActivityDaysAgo: 0
});

// Calcula el porcentaje de artículos publicados
const publishedPercentage = computed(() => {
  if (stats.value.totalArticles === 0) return 0;
  return Math.round((stats.value.publishedArticles / stats.value.totalArticles) * 100);
});

// Función para actualizar los datos
const refetch = async () => {
  isLoading.value = true;
  try {
    await fetchDashboardData();
  } catch (error) {
    console.error('Error actualizando estadísticas:', error);
    uiStore.addNotification({ 
      type: 'error', 
      message: 'Error al actualizar las estadísticas del dashboard' 
    });
  } finally {
    isLoading.value = false;
  }
};

// Función para obtener datos del dashboard
const fetchDashboardData = async () => {
  // Obtener datos de artículos
  const articlesData = await articlesApi.getArticles({ limit: 1 });
  stats.value.totalArticles = articlesData.total;
  
  // Obtener artículos publicados (con filtro de estado)
  const publishedArticles = await articlesApi.getArticles({ limit: 1, status: 'published' });
  stats.value.publishedArticles = publishedArticles.total;
  
  // Calcular borradores
  stats.value.draftArticles = stats.value.totalArticles - stats.value.publishedArticles;
  
  // Obtener datos de libros
  const booksData = await booksApi.getBooks({ limit: 1 });
  stats.value.totalBooks = booksData.total;
  
  // Libros recientes (para demostración)
  stats.value.recentBooks = Math.round(booksData.total * 0.2); // Asumimos 20% son recientes
  
  // Establecer fecha de última actualización
  stats.value.lastUpdate = new Date().toISOString();
  
  return stats.value;
};

// Cargar datos cuando el componente se monta
onMounted(async () => {
  try {
    await fetchDashboardData();
    isLoading.value = false;
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
    uiStore.addNotification({ 
      type: 'error', 
      message: 'Error al cargar las estadísticas del dashboard' 
    });
    isLoading.value = false;
  }
});
</script>

<style scoped>
.dashboard {
  @apply space-y-8;
}

.section-title {
  @apply mb-4 text-xl font-bold text-gray-800 dark:text-gray-100;
}

.section-description {
  @apply mb-6 text-gray-600 dark:text-gray-300;
}

.stats-grid {
  @apply grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2;
}

.stat-card {
  @apply flex overflow-hidden rounded-lg border border-gray-100 bg-white shadow transition-all dark:border-gray-700 dark:bg-gray-800;
}

.stat-card.loading {
  @apply animate-pulse opacity-60;
}

.stat-icon {
  @apply flex items-center justify-center p-4;
}

.stat-content {
  @apply flex flex-col p-4;
}

.stat-title {
  @apply text-sm font-medium text-gray-600 dark:text-gray-400;
}

.stat-value {
  @apply text-2xl font-semibold text-gray-900 dark:text-white;
}

.stat-link {
  @apply mt-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300;
}

.stat-info {
  @apply mt-1 text-sm text-gray-500 dark:text-gray-400;
}

.actions-grid {
  @apply grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4;
}

.action-card {
  @apply flex items-center space-x-4 rounded-lg border border-gray-100 bg-white p-4 shadow transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700;
}

.action-icon {
  @apply flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full;
}

.action-text {
  @apply font-medium text-gray-800 dark:text-gray-200;
}

.welcome-section {
  @apply mb-8 rounded-lg bg-gradient-to-r from-blue-700 to-violet-600 p-6 text-white;
}

.welcome-section .section-title {
  @apply mb-2 text-2xl font-bold text-white;
}

.welcome-section .section-description {
  @apply text-blue-100;
}
</style>
