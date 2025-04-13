<template>
  <div class="not-found">
    <div class="content">
      <h1 class="title">404</h1>
      <p class="message">Página no encontrada</p>
      <p class="description">Lo sentimos, pero la página que estás buscando no existe o ha sido eliminada.</p>
      <router-link to="/" class="return-link">Volver al Dashboard</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// No se requiere lógica adicional
</script>

<style scoped>
.not-found {
  @apply flex min-h-[80vh] items-center justify-center p-4 text-center;
}

.content {
  @apply max-w-md;
}

.title {
  @apply text-9xl font-bold text-gray-300 dark:text-gray-700;
}

.message {
  @apply -mt-6 text-3xl font-bold text-gray-900 dark:text-white;
}

.description {
  @apply my-4 text-gray-600 dark:text-gray-300;
}

.return-link {
  @apply mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700;
}
</style>
