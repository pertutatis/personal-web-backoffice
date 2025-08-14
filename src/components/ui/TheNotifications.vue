<template>
  <div class="notifications">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="`notification--${notification.type}`"
        :data-cy="`notification-${notification.type}`"
      >
        <div class="notification__content">
          <component
            :is="getIcon(notification.type)"
            class="notification__icon"
          />
          <span class="notification__message">{{ notification.message }}</span>
        </div>
        <button @click="remove(notification.id)" class="notification__close">
          <XMarkIcon class="notification__close-icon" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useUIStore } from '@/stores/uiStore'
import {
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

type NotificationType = 'success' | 'error' | 'info' | 'warning'

export default defineComponent({
  name: 'TheNotifications',
  components: {
    XMarkIcon,
    CheckIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon
  },
  setup() {
    const uiStore = useUIStore()

    const getIcon = (type: NotificationType) => {
      switch (type) {
        case 'success':
          return CheckIcon
        case 'error':
          return ExclamationTriangleIcon
        case 'warning':
          return ExclamationTriangleIcon
        case 'info':
          return InformationCircleIcon
        default:
          return InformationCircleIcon
      }
    }

    const remove = (id: string) => {
      uiStore.removeNotification(id)
    }

    return {
      notifications: computed(() => uiStore.notifications),
      getIcon,
      remove
    }
  }
})
</script>

<style lang="postcss" scoped>
.notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: 300px;
}

.notification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: all 0.3s ease;
  color: #666;
}

.notification__content {
  display: flex;
  align-items: center;
}

.notification__icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.notification__message {
  flex: 1;
  font-size: 14px;
}

.notification__close {
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  margin-left: 10px;
}

.notification__close-icon {
  width: 16px;
  height: 16px;
  color: #666;
}

.notification--success {
  border-left: 4px solid #10b981;
}

.notification--error {
  border-left: 4px solid #ef4444;
}

.notification--warning {
  border-left: 4px solid #f59e0b;
}

.notification--info {
  border-left: 4px solid #3b82f6;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
