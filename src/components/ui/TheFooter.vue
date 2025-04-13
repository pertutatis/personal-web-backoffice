<template>
  <footer class="footer">
    <div class="container">
      <p>&copy; {{ currentYear }} Blog Personal - Backoffice v1.0.0</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer {
  @apply border-t border-gray-200 bg-white py-4 text-center text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400;
}

.container {
  @apply mx-auto max-w-7xl px-4;
}
</style>
