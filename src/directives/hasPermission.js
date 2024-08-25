import { useAuthStore } from '@/stores/auth'

export default {
  mounted(el, binding) {
    const authStore = useAuthStore()
    const requiredPermissions = binding.value

    const userPermissions = authStore.getUserPermissions

    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission)
    )

    if (!hasPermission) {
      el.style.display = 'none'
    }
  },
}
