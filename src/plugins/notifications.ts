import { App } from 'vue'
import TheNotifications from '@/components/ui/TheNotifications.vue'

export const notificationsPlugin = {
  install(app: App) {
    // Registra el componente globalmente
    app.component('TheNotifications', TheNotifications)
  }
}
