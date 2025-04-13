<template>
  <div class="app">
    <TheHeader />
    <div class="flex h-screen">
      <TheSidebar />
      <main class="flex-1 overflow-auto p-6">
        <router-view />
      </main>
    </div>
    <TheFooter />
    <TheNotifications />
  </div>
</template>

<script setup lang="ts">
import TheHeader from "./components/ui/TheHeader.vue";
import TheSidebar from "./components/ui/TheSidebar.vue";
import TheFooter from "./components/ui/TheFooter.vue";
import TheNotifications from "./components/ui/TheNotifications.vue";
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
