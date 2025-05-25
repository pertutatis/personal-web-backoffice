import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

/**
 * Verifica si hay un token de autenticación válido
 * Si no hay token, redirige a login con la ruta original como query param
 */
export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  const authTokens = localStorage.getItem('auth_tokens')

  // Actualizar estado de autenticación en el store
  if (authTokens) {
    authStore.$patch({ isAuthenticated: true })
  } else {
    authStore.$patch({ isAuthenticated: false })
  }

  if (!authTokens && to.name !== 'login' && to.name !== 'register') {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // Si está autenticado e intenta acceder a login/register, redirigir a dashboard
  if (authTokens && (to.name === 'login' || to.name === 'register')) {
    next({ name: 'dashboard' })
    return
  }

  next()
}
