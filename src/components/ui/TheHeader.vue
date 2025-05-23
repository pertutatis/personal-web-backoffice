<template>
  <header class="header">
    <div class="header__left">
      <button class="header__menu-button" @click="toggleSidebar">
        <span class="icon">≡</span>
      </button>
      <h1 class="header__title">{{ appTitle }}</h1>
    </div>
    
    <div class="header__right">
      <div v-if="user" class="header__user">
        <span class="header__username">{{ user.name }}</span>
        <button class="header__logout" @click="logout">
          Cerrar sesión
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

export default defineComponent({
  name: 'TheHeader',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const { notifications } = useNotifications()

    const appTitle = computed(() => import.meta.env.VITE_APP_TITLE || 'Blog Admin')
    const user = computed(() => authStore.user)

    const toggleSidebar = () => {
      // Emitir evento para el store global
      document.body.classList.toggle('sidebar-open')
    }

    const logout = async () => {
      try {
        await authStore.logout()
        notifications.success('Sesión cerrada correctamente')
        router.push('/login')
      } catch (error) {
        notifications.error('Error al cerrar sesión')
      }
    }

    return {
      appTitle,
      user,
      toggleSidebar,
      logout
    }
  }
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: var(--header-height);
}

.header__left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header__menu-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #4b5563;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.header__menu-button:hover {
  background-color: #f3f4f6;
}

.header__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.header__right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header__user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header__username {
  font-weight: 500;
  color: #4b5563;
}

.header__logout {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.header__logout:hover {
  background-color: #f3f4f6;
  color: #dc2626;
}
</style>
