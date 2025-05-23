<template>
  <aside class="sidebar" :class="{ 'sidebar--open': isOpen }">
    <nav class="sidebar__nav">
      <ul class="sidebar__menu">
        <li v-for="item in menuItems" :key="item.path">
          <router-link
            :to="item.path"
            class="sidebar__link"
            :class="{ 'sidebar__link--active': isActive(item.path) }"
          >
            <component :is="item.icon" class="sidebar__icon" />
            <span class="sidebar__text">{{ item.text }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeIcon,
  DocumentTextIcon,
  BookOpenIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

export default defineComponent({
  name: 'TheSidebar',
  components: {
    HomeIcon,
    DocumentTextIcon,
    BookOpenIcon,
    ChartBarIcon,
    UserGroupIcon,
    CogIcon
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const route = useRoute()

    const menuItems = computed(() => [
      {
        text: 'Dashboard',
        path: '/',
        icon: HomeIcon
      },
      {
        text: 'Artículos',
        path: '/articulos',
        icon: DocumentTextIcon
      },
      {
        text: 'Libros',
        path: '/libros',
        icon: BookOpenIcon
      },
      {
        text: 'Estadísticas',
        path: '/estadisticas',
        icon: ChartBarIcon
      },
      {
        text: 'Usuarios',
        path: '/usuarios',
        icon: UserGroupIcon
      },
      {
        text: 'Configuración',
        path: '/configuracion',
        icon: CogIcon
      }
    ])

    const isActive = (path: string) => {
      if (path === '/') {
        return route.path === path
      }
      return route.path.startsWith(path)
    }

    return {
      menuItems,
      isActive
    }
  }
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: var(--header-height);
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background-color: white;
  border-right: 1px solid #e5e7eb;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 20;
}

.sidebar--open {
  transform: translateX(0);
}

.sidebar__nav {
  height: 100%;
  padding: 1rem 0;
}

.sidebar__menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar__link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.2s;
}

.sidebar__link:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.sidebar__link--active {
  background-color: #f3f4f6;
  color: #111827;
  font-weight: 500;
}

.sidebar__icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.75rem;
}

.sidebar__text {
  font-size: 0.875rem;
}

@media (min-width: 768px) {
  .sidebar {
    transform: translateX(0);
  }
}
</style>
