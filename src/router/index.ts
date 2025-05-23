import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { authGuard } from './guards/authGuard'

// Definición de rutas
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { title: 'Iniciar sesión', public: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: { title: 'Crear cuenta', public: true }
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/dashboard/DashboardView.vue'),
    meta: { title: 'Dashboard', requiresAuth: true }
  },
  // Rutas de Artículos
  {
    path: '/articulos',
    name: 'articles',
    component: () => import('../views/articles/ArticlesListView.vue'),
    meta: { title: 'Artículos', requiresAuth: true }
  },
  {
    path: '/articulos/nuevo',
    name: 'articles-new',
    component: () => import('../views/articles/ArticleFormView.vue'),
    meta: { title: 'Nuevo Artículo', requiresAuth: true }
  },
  {
    path: '/articulos/:id',
    name: 'articles-detail',
    component: () => import('../views/articles/ArticleDetailView.vue'),
    meta: { title: 'Detalle de Artículo', requiresAuth: true },
    props: true
  },
  {
    path: '/articulos/:id/editar',
    name: 'articles-edit',
    component: () => import('../views/articles/ArticleFormView.vue'),
    meta: { title: 'Editar Artículo', requiresAuth: true },
    props: true
  },
  // Rutas de Libros
  {
    path: '/libros',
    name: 'books',
    component: () => import('../views/books/BooksListView.vue'),
    meta: { title: 'Libros', requiresAuth: true }
  },
  {
    path: '/libros/nuevo',
    name: 'books-new',
    component: () => import('../views/books/BookFormView.vue'),
    meta: { title: 'Nuevo Libro', requiresAuth: true }
  },
  {
    path: '/libros/:id',
    name: 'books-detail',
    component: () => import('../views/books/BookDetailView.vue'),
    meta: { title: 'Detalle de Libro', requiresAuth: true },
    props: true
  },
  {
    path: '/libros/:id/editar',
    name: 'books-edit',
    component: () => import('../views/books/BookFormView.vue'),
    meta: { title: 'Editar Libro', requiresAuth: true },
    props: true
  },
  // Ruta de error 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada', public: true }
  }
];

// Crear el router
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});

// Middleware de navegación
router.beforeEach(authGuard)

// Middleware de títulos dinámicos
router.beforeEach((to, from, next) => {
  const baseTitle = 'Backoffice | Blog Personal'
  document.title = to.meta.title ? `${to.meta.title} - ${baseTitle}` : baseTitle
  next()
})

export { router }
