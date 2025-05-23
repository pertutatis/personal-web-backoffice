import { startMockServer } from '../tests/mock-server'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import { notificationsPlugin } from './plugins/notifications'
import { createAuthPlugin } from './stores/authStore'
import App from './App.vue'

// Iniciar servidor mock solo en desarrollo
if (import.meta.env.DEV) {
  startMockServer()
}

// Crear la aplicación
const app = createApp(App)

// Configurar Pinia con el plugin de autenticación
const pinia = createPinia()
pinia.use(createAuthPlugin())
app.use(pinia)

// Router
app.use(router)

// Sistema de notificaciones
app.use(notificationsPlugin)

// Montar la aplicación
app.mount('#app')

// Exportar para tests
export { app, pinia, router }
