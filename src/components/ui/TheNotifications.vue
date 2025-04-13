<template>
  <div class="notifications-container">
    <TransitionGroup name="notification">
      <div 
        v-for="notification in notifications" 
        :key="notification.id" 
        :class="['notification', notificationTypeClass(notification.type)]"
      >
        <div class="notification-content">
          <span class="notification-message">{{ notification.message }}</span>
        </div>
        <button 
          @click="dismissNotification(notification.id)" 
          class="notification-dismiss"
          aria-label="Cerrar notificación"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../../stores/uiStore';

const uiStore = useUIStore();

const notifications = computed(() => uiStore.notifications);

const notificationTypeClass = (type: 'info' | 'success' | 'warning' | 'error') => {
  switch (type) {
    case 'success': return 'notification-success';
    case 'warning': return 'notification-warning';
    case 'error': return 'notification-error';
    default: return 'notification-info';
  }
};

const dismissNotification = (id: string) => {
  uiStore.removeNotification(id);
};
</script>

<style scoped>
.notifications-container {
  @apply fixed right-0 top-0 z-50 m-4 flex max-w-sm flex-col space-y-4;
}

.notification {
  @apply flex items-center justify-between rounded-lg p-4 shadow-lg;
}

.notification-info {
  @apply bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100;
}

.notification-success {
  @apply bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-100;
}

.notification-warning {
  @apply bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-100;
}

.notification-error {
  @apply bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-100;
}

.notification-content {
  @apply mr-2 flex-grow;
}

.notification-dismiss {
  @apply rounded-full p-1 transition-colors hover:bg-black/10;
}

/* Animaciones para las notificaciones */
.notification-enter-active,
.notification-leave-active {
  @apply transition-all duration-300 ease-in-out;
}

.notification-enter-from {
  @apply -translate-x-full opacity-0;
}

.notification-leave-to {
  @apply translate-y-full opacity-0;
}
</style>
