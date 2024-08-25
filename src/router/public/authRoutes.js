export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/Login'),
    meta: {
      title: 'Đăng Nhập',
      layout: 'auth',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/components/Register'),
    meta: {
      title: 'Đăng Ký',
      layout: 'auth',
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/components/ForgotPassword'),
    meta: {
      title: 'Quên Mật Khẩu',
      layout: 'auth',
    },
  },
  {
    path: '/confirm-change-password',
    name: 'confirmChangePassword',
    component: () => import('@/components/ConfirmChangePassword'),
    meta: {
      title: 'Xác nhận đổi mật khẩu',
      layout: 'auth',
    },
  },
  {
    path: '/activate',
    name: 'activate',
    component: () => import('@/components/AccountVerification'),
    meta: {
      title: 'Kích hoạt tài khoản',
      layout: 'auth',
    },
  },
]
