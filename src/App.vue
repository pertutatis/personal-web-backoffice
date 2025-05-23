<template>
  <div class="app" :class="{ 'app--loading': isLoading }">
    <header v-if="hasAuth">
      <the-header />
    </header>

    <div class="app__content">
      <aside v-if="hasAuth" class="app__sidebar">
        <the-sidebar />
      </aside>

      <main class="app__main">
        <!-- Indicador de carga global -->
        <div v-if="isLoading" class="app__loading">
          <span class="loading-spinner"></span>
          <p>Cargando...</p>
        </div>

        <router-view v-else />
      </main>
    </div>

    <!-- Sistema de notificaciones -->
    <the-notifications />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useAuth } from '@/composables/api/useAuth'
import TheHeader from '@/components/ui/TheHeader.vue'
import TheSidebar from '@/components/ui/TheSidebar.vue'
import TheNotifications from '@/components/ui/TheNotifications.vue'

const { isAuthenticated, getStoredTokens } = useAuth()
const isLoading = ref(true)

const hasAuth = computed(() => isAuthenticated())

onMounted(() => {
  try {
    // Verificar la autenticación al montar
    getStoredTokens()
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app--loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.app__content {
  display: flex;
  flex: 1;
}

.app__sidebar {
  width: 250px;
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
}

.app__main {
  flex: 1;
  padding: 2rem;
  position: relative;
}

.app__loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.app__loading p {
  margin-top: 1rem;
  color: #666;
}
</style>
