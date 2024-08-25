const instance = [
  {
    path: '/departments',
    name: 'departments',
    component: () => import('@/components/Manager/DepartmentManager'),
    meta: {
      layout: 'dashboard',
      title: 'Quản lý phòng ban',
      requiresAuth: true,
    },
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/components/Manager/ProjectManager'),
    meta: {
      layout: 'dashboard',
      title: 'Quản lý dự án',
      requiresAuth: true,
    },
  },
  {
    path: '/employees',
    name: 'employees',
    component: () => import('@/components/Manager/EmployeeManager'),
    meta: {
      layout: 'dashboard',
      title: 'Quản lý nhân viên',
      requiresAuth: true,
    },
  },
  {
    path: '/deliveries',
    name: 'deliveries',
    component: () => import('@/components/Manager/DeliveryManager'),
    meta: {
      layout: 'dashboard',
      title: 'Quản lý giao hàng',
      requiresAuth: true,
    },
  },
  {
    path: '/customers',
    name: 'customers',
    component: () => import('@/components/Manager/CustomerManager'),
    meta: {
      layout: 'dashboard',
      title: 'Quản lý khách hàng',
      requiresAuth: true,
    },
  },
  {
    path: '/inventories',
    name: 'inventories',
    component: () => import('@/components/Manager/InventoryManager'),
    meta: {
      layout: 'dashboard',
      title: 'Quản lý kho',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/components/DashboardHome'),
    meta: {
      layout: 'dashboard',
      title: 'Dashboard',
      requiresAuth: true,
    },
  },
]
export default instance
