import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

/**
 * Verifica si hay un token de autenticación válido
 * Si no hay token, redirige a login con la ruta original como query param
 */
export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authTokens = localStorage.getItem('auth_tokens')

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
