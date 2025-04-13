<template>
  <aside :class="['sidebar', { 'sidebar-collapsed': !isOpen }]">
    <div class="sidebar-header">
      <router-link to="/" class="logo">
        <span class="text-xl font-bold">Blog Admin</span>
      </router-link>
    </div>
    
    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link to="/" class="nav-link" :class="{ active: isActiveRoute('/') }">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span>Dashboard</span>
          </router-link>
        </li>
        
        <li>
          <router-link to="/articulos" class="nav-link" :class="{ active: isActiveRoute('/articulos') }">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            <span>Artículos</span>
          </router-link>
        </li>
        
        <li>
          <router-link to="/libros" class="nav-link" :class="{ active: isActiveRoute('/libros') }">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <span>Libros</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUIStore } from '../../stores/uiStore';

const route = useRoute();
const uiStore = useUIStore();

const isOpen = computed(() => uiStore.sidebarOpen);

function isActiveRoute(path: string): boolean {
  return route.path === path || route.path.startsWith(`${path}/`);
}
</script>

<style scoped>
.sidebar {
  @apply h-full w-64 bg-gray-800 text-white transition-all duration-300 ease-in-out dark:bg-gray-800;
}

.sidebar-collapsed {
  @apply w-20;
}

.sidebar-header {
  @apply flex h-16 items-center justify-center border-b border-gray-700;
}

.logo {
  @apply text-white no-underline;
}

.sidebar-nav {
  @apply mt-6;
}

.nav-link {
  @apply flex items-center px-6 py-3 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white;
}

.nav-link.active {
  @apply bg-blue-700 text-white;
}

.nav-link svg {
  @apply mr-3;
}

.sidebar-collapsed .nav-link span {
  @apply hidden;
}

.sidebar-collapsed .logo span {
  @apply hidden;
}
</style>
