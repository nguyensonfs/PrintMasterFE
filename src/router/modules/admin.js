const admin = [
  {
    path: '/dashboard',
    name: 'admin-dashboard',
    component: () => import('@/views/admin/dashboard.vue'),
    meta: {
      layout: 'dashboard',
      title: 'Dashboard',
      requiresAuth: true,
    },
  },
  {
    path: '/teams',
    name: 'admin-teams',
    component: () => import('@/views/admin/teams.vue'),
    meta: {
      layout: 'dashboard',
      title: 'Quản lý phòng ban',
      requiresAuth: true,
    },
  },
]
export default admin
