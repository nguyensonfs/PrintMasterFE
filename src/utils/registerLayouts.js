export default {
  install(app) {
    app.component(
      'default-layout',
      defineAsyncComponent(() => import('@/layouts/default.vue'))
    )

    app.component(
      'auth-layout',
      defineAsyncComponent(() => import('@/layouts/auth.vue'))
    )

    app.component(
      'dashboard-layout',
      defineAsyncComponent(() => import('@/layouts/dashboard.vue'))
    )
  },
}
