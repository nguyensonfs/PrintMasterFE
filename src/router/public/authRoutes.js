export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/Login/Login.vue'),
    meta: {
      title: 'Đăng Nhập',
      layout: 'auth',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/components/Register/Register.vue'),
    meta: {
      title: 'Đăng Ký',
      layout: 'auth',
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/components/ForgotPassword/ForgotPassword.vue'),
    meta: {
      title: 'Quên Mật Khẩu',
      layout: 'auth',
    },
  },
  {
    path: '/confirm-change-password',
    name: 'confirmChangePassword',
    component: () =>
      import('@/components/ConfirmChangePassword/ConfirmChangePassword.vue'),
    meta: {
      title: 'Xác nhận đổi mật khẩu',
      layout: 'auth',
    },
  },
  {
    path: '/activate',
    name: 'activate',
    component: () =>
      import('@/components/AccountVerification/AccountVerification.vue'),
    meta: {
      title: 'Kích hoạt tài khoản',
      layout: 'auth',
    },
  },
]
