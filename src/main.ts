import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { router } from './router'
import { notificationsPlugin } from './plugins/notifications'
import { createAuthPlugin } from './stores/authStore'
import App from './App.vue'

import './assets/main.css'

// Crear la aplicación
const app = createApp(App)

// Configurar Pinia con el plugin de autenticación
const pinia = createPinia()
pinia.use(createAuthPlugin())
app.use(pinia)

// Configurar Vue Query
app.use(VueQueryPlugin)

// Router
app.use(router)

// Sistema de notificaciones
app.use(notificationsPlugin)

// Montar la aplicación
app.mount('#app')

// Exportar para tests
export { app, pinia, router }
