import { ref, readonly } from 'vue'
import type { Component, Ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: number
  message: string
  type: NotificationType
  timeout?: number
}

export interface NotificationComponent extends Component {
  notifications: Notification[]
  add: (notification: Omit<Notification, 'id'>) => void
  remove: (id: number) => void
}

let notificationComponent: NotificationComponent | null = null
const notifications: Ref<Notification[]> = ref([])

export interface NotificationsApi {
  notifications: Ref<Notification[]>
  setNotificationComponent: (component: NotificationComponent) => void
  notify: (message: string, type: NotificationType, timeout?: number) => void
  success: (message: string, timeout?: number) => void
  error: (message: string, timeout?: number) => void
  info: (message: string, timeout?: number) => void
  warning: (message: string, timeout?: number) => void
}

export function useNotifications(): NotificationsApi {
  const setNotificationComponent = (component: NotificationComponent) => {
    notificationComponent = component
  }

  const notify = (
    message: string,
    type: NotificationType = 'info',
    timeout = 3000
  ) => {
    const notification: Omit<Notification, 'id'> = {
      message,
      type,
      timeout
    }

    if (notificationComponent) {
      notificationComponent.add(notification)
    } else {
      const id = Date.now()
      notifications.value.push({ ...notification, id })
      if (timeout) {
        setTimeout(() => {
          const index = notifications.value.findIndex((n: Notification) => n.id === id)
          if (index !== -1) {
            notifications.value.splice(index, 1)
          }
        }, timeout)
      }
    }
  }

  const success = (message: string, timeout = 3000) => {
    notify(message, 'success', timeout)
  }

  const error = (message: string, timeout = 5000) => {
    notify(message, 'error', timeout)
  }

  const info = (message: string, timeout = 3000) => {
    notify(message, 'info', timeout)
  }

  const warning = (message: string, timeout = 4000) => {
    notify(message, 'warning', timeout)
  }

  return {
    notifications: readonly(notifications) as Ref<Notification[]>,
    setNotificationComponent,
    notify,
    success,
    error,
    info,
    warning
  }
}

export { notifications }
