const instance = [
  {
    path: '/departments',
    name: 'departments',
    component: () =>
      import('@/components/Manager/DepartmentManager/DepartmentManager.vue'),
    meta: {
      layout: 'dashboard',
      title: 'Quản lý phòng ban',
      requiresAuth: true,
    },
  },
  {
    path: '/projects',
    name: 'projects',
    component: () =>
      import('@/components/Manager/ProjectManager/ProjectManager.vue'),
    children: [
      {
        path: ':projectId',
        name: 'projectDetail',
        component: () =>
          import('@/components/Manager/ProjectManager/ProjectView.vue'),
        props: true,
      },
      {
        path: ':projectId/designs',
        name: 'designs',
        component: () =>
          import('@/components/Manager/ProjectManager/ProjectDesignView.vue'),
        props: true,
      },
    ],
    meta: {
      layout: 'dashboard',
      title: 'Quản lý dự án',
      requiresAuth: true,
    },
  },
  {
    path: '/employees',
    name: 'employees',
    component: () =>
      import('@/components/Manager/EmployeeManager/EmployeeManager.vue'),
    meta: {
      layout: 'dashboard',
      title: 'Quản lý nhân viên',
      requiresAuth: true,
    },
  },
  {
    path: '/deliveries',
    name: 'deliveries',
    component: () =>
      import('@/components/Manager/DeliveryManager/DeliveryManager.vue'),
    meta: {
      layout: 'dashboard',
      title: 'Quản lý giao hàng',
      requiresAuth: true,
    },
  },
  {
    path: '/customers',
    name: 'customers',
    component: () =>
      import('@/components/Manager/CustomerManager/CustomerManager.vue'),
    meta: {
      layout: 'dashboard',
      title: 'Quản lý khách hàng',
      requiresAuth: true,
    },
  },
  {
    path: '/inventories',
    name: 'inventories',
    component: () =>
      import('@/components/Manager/InventoryManager/InventoryManager.vue'),
    meta: {
      layout: 'dashboard',
      title: 'Quản lý kho',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/components/DashboardHome/DashboardHome.vue'),
    meta: {
      layout: 'dashboard',
      title: 'Dashboard',
      requiresAuth: true,
    },
  },
]
export default instance
