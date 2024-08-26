import { getUserRoleLeaderAPI } from '@/apis/userServices'
import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
  state: () => ({
    leaders: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAllLeaders() {
      this.loading = true
      try {
        const response = await getUserRoleLeaderAPI()
        this.leaders = response
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
  },
})
