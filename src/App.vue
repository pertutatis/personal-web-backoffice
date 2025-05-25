<template>
  <div class="app">
    <TheHeader v-if="isAuthenticated"/>
    <div class="flex h-screen">
      <TheSidebar v-if="isAuthenticated"/>
      <main class="flex-1 overflow-auto p-6">
        <router-view />
      </main>
    </div>
    <TheFooter v-if="isAuthenticated"/>
    <TheNotifications/>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import TheHeader from '@/components/ui/TheHeader.vue'
import TheFooter from '@/components/ui/TheFooter.vue'
import TheSidebar from '@/components/ui/TheSidebar.vue'
import TheNotifications from '@/components/ui/TheNotifications.vue'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex-grow: 1;
  background-color: var(--bg-gray-800); /* Un azul muy claro */
}
</style>
