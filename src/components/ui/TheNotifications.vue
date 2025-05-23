<template>
  <div class="notifications">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notificationsArray"
        :key="notification.id"
        class="notification"
        :class="`notification--${notification.type}`"
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
import { useNotifications } from '@/composables/useNotifications'
import {
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import type { NotificationType, Notification } from '@/composables/useNotifications'

export default defineComponent({
  name: 'TheNotifications',
  components: {
    XMarkIcon,
    CheckIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon
  },
  setup() {
    const notificationsApi = useNotifications()
    const { notifications } = notificationsApi

    const notificationsArray = computed(() => notifications.value)

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

    const remove = (id: number) => {
      notifications.value = notifications.value.filter((n: Notification) => n.id !== id)
    }

    const add = (notification: Omit<Notification, 'id'>) => {
      const id = Date.now()
      notifications.value.push({ ...notification, id })

      if (notification.timeout) {
        setTimeout(() => remove(id), notification.timeout)
      }
    }

    return {
      notificationsArray,
      getIcon,
      remove,
      notifications: notifications.value,
      add
    }
  }
})
</script>

<style scoped>
.notifications {
  position: fixed;
  top: calc(var(--header-height) + 1rem);
  right: 1rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 400px;
}

.notification {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.notification__content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.notification__icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.notification__message {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.notification__close {
  padding: 0.25rem;
  background: none;
  border: none;
  color: currentColor;
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.2s;
}

.notification__close:hover {
  opacity: 1;
}

.notification__close-icon {
  width: 1rem;
  height: 1rem;
}

.notification--success {
  background-color: #ecfdf5;
  color: #047857;
}

.notification--error {
  background-color: #fef2f2;
  color: #dc2626;
}

.notification--warning {
  background-color: #fffbeb;
  color: #d97706;
}

.notification--info {
  background-color: #f3f4f6;
  color: #4b5563;
}

/* Transiciones */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
