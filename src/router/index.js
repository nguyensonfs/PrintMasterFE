import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import dashboardRoutes from './private'
import authRoutes from './public/authRoutes'
const routes = [
  ...dashboardRoutes,
  ...authRoutes,
  {
    path: '/not-authorized',
    name: 'notAuthorized',
    component: () => import('@/components/NotAuthorized/NotAuthorized.vue'),
    meta: {
      title: 'NotAuthorized',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('@/components/NotFound/NotFound.vue'),
    meta: {
      title: 'NotFound',
    },
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'PrintMaster - Chuyên Gia In Ấn'
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const userPermissions = authStore.getUserPermissions
  const routePermissions = to.meta.permissions
  // if (requiresAuth && !authStore.isAuthenticated) {
  //   next({ name: 'login' })
  // } else if (
  //   requiresAuth &&
  //   routePermissions &&
  //   !routePermissions.some((permission) => userPermissions.includes(permission))
  // ) {
  //   next({ name: 'notAuthorized' })
  // } else {
  //   next()
  // }

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
