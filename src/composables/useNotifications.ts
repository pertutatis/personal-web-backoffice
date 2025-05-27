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
  add: (notification: Omit<Notification, 'id'>) => void
  remove: (id: number) => void
}

// Crear un array reactivo privado y una versión de solo lectura para exponer
const notificationsData = ref<Notification[]>([])
const notifications = readonly(notificationsData)

// Variable global para el componente de notificaciones
let notificationComponent: NotificationComponent | null = null

export interface NotificationsApi {
  notifications: Readonly<Ref<Notification[]>>
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
    // Prevenir notificaciones vacías
    if (!message) return;

    const notification: Omit<Notification, 'id'> = {
      message,
      type,
      timeout
    }

    try {
      if (notificationComponent) {
        notificationComponent.add(notification)
      } else {
        // Si no hay componente, almacenar en el array para mostrarlo cuando esté disponible
        const id = Date.now()
        // Usar la versión no readonly interna para la modificación
        notificationsData.value = [...notificationsData.value, { ...notification, id }]
        
        // Auto-borrar después del timeout si se especifica
        if (timeout) {
          setTimeout(() => {
            notificationsData.value = notificationsData.value.filter(n => n.id !== id)
          }, timeout)
        }
      }
    } catch (error) {
      console.error('Error al mostrar notificación:', error)
    }
  }

  const success = (message: string, timeout?: number) => {
    notify(message, 'success', timeout)
  }

  const error = (message: string, timeout?: number) => {
    notify(message, 'error', timeout)
  }

  const info = (message: string, timeout?: number) => {
    notify(message, 'info', timeout)
  }

  const warning = (message: string, timeout?: number) => {
    notify(message, 'warning', timeout)
  }

  return {
    notifications,
    setNotificationComponent,
    notify,
    success,
    error,
    info,
    warning
  }
}
