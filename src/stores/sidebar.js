import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    items: [
      { icon: 'mdi-home', title: 'Trang chủ', url: '/dashboard', roles: [] },
      {
        icon: 'mdi-warehouse',
        title: 'Quản lý kho',
        url: '/inventories',
        roles: [],
      },
      {
        icon: 'mdi-truck-delivery',
        title: 'Quản lý giao hàng',
        url: '/deliveries',
        roles: [],
      },
      {
        icon: 'mdi-image',
        title: 'Quản lý dự án',
        url: '/projects',
        roles: [],
      },
      {
        icon: 'mdi-account-tie',
        title: 'Quản lý nhân viên',
        url: '/employees',
        roles: ['Admin'],
      },
      {
        icon: 'mdi-account-multiple',
        title: 'Quản lý khách hàng',
        url: '/customers',
        roles: [],
      },
      {
        icon: 'mdi-domain',
        title: 'Quản lý phòng ban',
        url: '/departments',
        roles: ['Admin'],
      },
    ],
  }),
  actions: {
    getAccessibleItems(userRoles) {
      return this.items.filter(
        (item) =>
          item.roles.length === 0 ||
          item.roles.some((role) => userRoles.includes(role))
      )
    },
  },
  getters: {
    getSidebar: (state) => {
      return state.items
    },
  },
})
